const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'db', 'app.db');
const QUESTIONS_PATH = path.join(__dirname, 'otazky.json');

// Načtení otázek pro získání ID a kategorií
const otazky = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Chyba při připojování k databázi:', err.message);
        process.exit(1);
    }
    console.log('Připojeno k databázi pro generování testovacích dat.');
    main();
});

async function main() {
    console.log('--- START GENEROVÁNÍ SYNTETICKÝCH DAT ---');

    // 1. Vytvoření testovacích uživatelů
    const hash = await bcrypt.hash('heslo123', 10);
    const uzivatele = [
        { jmeno: 'Expert_Honza', email: 'honza@test.cz', role: 'uzivatel', successRate: 0.95 },
        { jmeno: 'Novacek_Petr', email: 'petr@test.cz', role: 'uzivatel', successRate: 0.45 },
        { jmeno: 'Sikovny_Lukas', email: 'lukas@test.cz', role: 'uzivatel', successRate: 0.75 }
    ];

    for (const u of uzivatele) {
        await new Promise((resolve) => {
            db.run(`INSERT OR IGNORE INTO uzivatele (jmeno, email, heslo, role) VALUES (?, ?, ?, ?)`, 
                [u.jmeno, u.email, hash, u.role], function() {
                db.get("SELECT id FROM uzivatele WHERE jmeno = ?", [u.jmeno], (err, row) => {
                    u.id = row.id;
                    resolve();
                });
            });
        });
    }

    // 2. Simulace testů pro každého uživatele
    // Expert udělá 20 testů, Nováček 15, Šikovný 25.
    const scenare = [
        { uid: uzivatele[0].id, count: 20, rate: 0.95, jmeno: 'Expert_Honza' },
        { uid: uzivatele[1].id, count: 15, rate: 0.45, jmeno: 'Novacek_Petr' },
        { uid: uzivatele[2].id, count: 25, rate: 0.75, jmeno: 'Sikovny_Lukas' }
    ];

    const kategorieList = ['organizace', 'taktika', 'zdravoveda', 'mix'];

    for (const s of scenare) {
        console.log(`Generuji ${s.count} testů pro uživatele ${s.jmeno}...`);
        for (let i = 0; i < s.count; i++) {
            const kat = kategorieList[Math.floor(Math.random() * kategorieList.length)];
            const katOtazky = kat === 'mix' ? otazky : otazky.filter(o => o.kategorie === kat);
            
            // Vybereme náhodných 10 otázek z kategorie
            const vybrane = katOtazky.sort(() => 0.5 - Math.random()).slice(0, 10);
            
            let skore = 0;
            const cas = Math.floor(Math.random() * 120) + 60; // 60-180 vteřin
            const datum = new Date();
            datum.setDate(datum.getDate() - (s.count - i)); // Simulace historie v čase

            const odpovedi = vybrane.map(o => {
                // Simulace úspěchu na základě successRate uživatele
                // Ale některé otázky (např. ID 4, 8, 15) uděláme záměrně těžší pro všechny
                let individualRate = s.rate;
                if ([4, 8, 15, 22, 50].includes(o.id)) individualRate *= 0.5;

                const spravne = Math.random() < individualRate ? 1 : 0;
                if (spravne) skore++;
                return { id: o.id, spravne };
            });

            // Uložíme výsledek testu
            await new Promise((resolve) => {
                db.run(`INSERT INTO vysledky (uzivatel_id, skore, celkem_otazek, cas_ve_vterinach, kategorie, datum) VALUES (?, ?, ?, ?, ?, ?)`,
                    [s.uid, skore, 10, cas, kat, datum.toISOString()], function() {
                    const stmt = db.prepare(`INSERT INTO odpovedi_uzivatelu (uzivatel_id, otazka_id, kategorie, spravne, datum) VALUES (?, ?, ?, ?, ?)`);
                    odpovedi.forEach(o => {
                        stmt.run(s.uid, o.id, kat, o.spravne, datum.toISOString());
                    });
                    stmt.finalize(resolve);
                });
            });
        }
    }

    console.log('--- HOTOVO ---');
    console.log('Byla vytvořena data pro 3 uživatele (Expert, Nováček, Šikovný).');
    console.log('Celkem vloženo cca 60 testů a 600 záznamů odpovědí.');
    console.log('Nyní se přihlas jako "admin" (heslo: admin123) a podívej se na Statistiku otázek.');
    db.close();
}
