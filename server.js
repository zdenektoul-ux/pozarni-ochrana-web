const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Nastavení statických souborů (HTML, CSS, JS půjdou ze složky public)
app.use(express.static(path.join(__dirname, 'public')));
// Middleware pro čtení těla požadavků (JSON a URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nastavení session pro přihlášeného uživatele (aby si pamatoval, kdo test dělá)
app.use(session({
    secret: 'pozar-bezpecnostni-tajny-klic', // V reálné produkci by toto bylo uloženo bezpečněji
    resave: false,
    saveUninitialized: false
}));

// --- NASTAVENÍ E-MAILU ---
// Transportér pro Seznam.cz
const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_ADRESA, 
        pass: process.env.EMAIL_HESLO
    },
    tls: {
        rejectUnauthorized: false
    }
});

// --- DATABÁZE ---
// Založíme databázi nebo se připojíme k již existující databázi sqlite
const db = new sqlite3.Database(path.join(__dirname, 'db', 'app.db'), (err) => {
    if (err) {
        console.error('Chyba při připojování k databázi:', err.message);
    } else {
        console.log('Připojeno k databázi SQLite.');
        inicializujDatabazi();
    }
});

// Vytvoření tabulek v databázi, pokud ještě neexistují
function inicializujDatabazi() {
    db.serialize(() => {
        // Tabulka pro uživatele (upraveno o e-mail pro obnovu hesla)
        db.run(`CREATE TABLE IF NOT EXISTS uzivatele (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jmeno TEXT NOT NULL UNIQUE,
            email TEXT UNIQUE,
            heslo TEXT NOT NULL,
            reset_token TEXT,
            reset_token_expirace DATETIME,
            role TEXT DEFAULT 'uzivatel'
        )`);

        // Přidání sloupce role do existující databáze, pokud chybí
        db.all("PRAGMA table_info(uzivatele)", (err, rows) => {
            if (rows) {
                if (!rows.some(r => r.name === 'role')) {
                    db.run("ALTER TABLE uzivatele ADD COLUMN role TEXT DEFAULT 'uzivatel'");
                }
                if (!rows.some(r => r.name === 'reset_token')) {
                    db.run("ALTER TABLE uzivatele ADD COLUMN reset_token TEXT");
                }
            }
        });

        // Tabulka pro výsledky testů, spojená s cizím klíčem na uživatele
        db.run(`CREATE TABLE IF NOT EXISTS vysledky (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uzivatel_id INTEGER,
            skore INTEGER NOT NULL,
            celkem_otazek INTEGER NOT NULL,
            cas_ve_vterinach INTEGER NOT NULL,
            kategorie TEXT,
            datum DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(uzivatel_id) REFERENCES uzivatele(id)
        )`);

        // Přidání sloupce kategorie do existující tabulky vysledky, pokud chybí
        db.all("PRAGMA table_info(vysledky)", (err, rows) => {
            if (rows && !rows.some(r => r.name === 'kategorie')) {
                db.run("ALTER TABLE vysledky ADD COLUMN kategorie TEXT");
            }
        });

        // Spaced Repetition: Ukládání detailu jednotlivých odpovědí
        db.run(`CREATE TABLE IF NOT EXISTS odpovedi_uzivatelu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uzivatel_id INTEGER,
            otazka_id INTEGER,
            kategorie TEXT,
            spravne INTEGER,
            datum DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(uzivatel_id) REFERENCES uzivatele(id)
        )`);

        // Tabulka pro globální nastavení aplikace (např. registrační kód)
        db.run(`CREATE TABLE IF NOT EXISTS nastaveni (
            klic TEXT PRIMARY KEY,
            hodnota TEXT NOT NULL
        )`, () => {
            // Vložíme výchozí klíč na začátku, pokud tam žádný není
            db.run(`INSERT OR IGNORE INTO nastaveni (klic, hodnota) VALUES ('registracni_kod', 'HASICI2026')`);
        });

        console.log('Tabulky v databázi jsou připraveny.');
    });
}

// --- API ROUTY (SPACED REPETITION KVÍZ) ---

// Získání dlaždic a postupu v kategoriích
app.get('/api/kategorie', (req, res) => {
    if (!req.session.uzivatelId) return res.status(401).json({ chyba: 'Nejste přihlášeni.' });
    fs.readFile(path.join(__dirname, 'otazky.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ chyba: 'Nelze načíst otázky.' });
        let otazky = [];
        try { otazky = JSON.parse(data); } catch(e){}
        
        const map = {};
        otazky.forEach(o => {
            const kat = o.kategorie || 'mix';
            if(!map[kat]) map[kat] = { nazev: kat, celkem: 0, prosel: 0 };
            map[kat].celkem++;
        });
        
        db.all(`SELECT kategorie, COUNT(DISTINCT otazka_id) as prosle FROM odpovedi_uzivatelu WHERE uzivatel_id = ? GROUP BY kategorie`, [req.session.uzivatelId], (dbErr, rows) => {
            if(rows) {
                rows.forEach(r => {
                    const k = r.kategorie || 'mix';
                    if(map[k]) map[k].prosel = r.prosle;
                });
            }
            res.json(Object.values(map));
        });
    });
});

// Získání mixu 10 otázek pro konkrétní test
app.get('/api/test-otazky/:kategorie', (req, res) => {
    if (!req.session.uzivatelId) return res.status(401).json({ chyba: 'Nejste přihlášeni.' });
    const zvolenaKat = req.params.kategorie;
    
    fs.readFile(path.join(__dirname, 'otazky.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ chyba: 'Nelze načíst otázky.' });
        let otazky = [];
        try { otazky = JSON.parse(data); } catch(e){}
        
        if (zvolenaKat !== 'mix') {
             otazky = otazky.filter(o => o.kategorie === zvolenaKat);
        }
        
        db.all(`SELECT otazka_id, spravne FROM odpovedi_uzivatelu WHERE uzivatel_id = ? AND kategorie = ? ORDER BY datum DESC`, [req.session.uzivatelId, zvolenaKat], (dbErr, rows) => {
            let historie = {};
            if (rows) {
                rows.forEach(r => {
                    if(!historie[r.otazka_id]) historie[r.otazka_id] = [];
                    historie[r.otazka_id].push(r.spravne);
                });
            }
            
            let nove = [], kriticke = [], upevnujici = [], zvladnute = [];
            
            otazky.forEach(o => {
                if(!historie[o.id]) {
                    nove.push(o);
                } else {
                    const ans = historie[o.id];
                    const lastAns = ans[0]; // Nejnovější odpověď
                    
                    if (lastAns === 0) {
                        kriticke.push(o); // Posledně bylo odpovězeno špatně
                    } else {
                        // Jak dlouhý je "streak" (šňůra nepřerušených správných odpovědí)?
                        let streak = 0;
                        for(let i = 0; i < ans.length; i++) {
                            if (ans[i] === 1) streak++;
                            else break;
                        }
                        
                        if (streak >= 3) {
                            zvladnute.push(o); // Plně fixováno v paměti
                        } else {
                            upevnujici.push(o); // Mezi 1 až 2 správnými v řadě (nebo kdysi chyby)
                        }
                    }
                }
            });
            
            const shuffle = a => a.sort(() => 0.5 - Math.random());
            shuffle(nove); shuffle(kriticke); shuffle(upevnujici); shuffle(zvladnute);
            
            let mix = [];
            
            // Plnění dle e-learningových vah: 4 kritické, 3 nové, 2 upevňující, 1 zvládnutá
            let popKrit = Math.min(4, kriticke.length);
            mix.push(...kriticke.splice(0, popKrit));
            
            let popNov = Math.min(3, nove.length);
            mix.push(...nove.splice(0, popNov));
            
            let popUpev = Math.min(2, upevnujici.length);
            mix.push(...upevnujici.splice(0, popUpev));
            
            let popZvlad = Math.min(1, zvladnute.length);
            mix.push(...zvladnute.splice(0, popZvlad));
            
            // Fallback (záchrana kapacity): Pokud celkové pole nemá ještě 10 otázek, doplní se spravedlivě vším, co ještě zbylo
            let zbytkove = [...kriticke, ...nove, ...upevnujici, ...zvladnute];
            shuffle(zbytkove);
            
            while(mix.length < 10 && zbytkove.length > 0) {
                mix.push(zbytkove.shift());
            }
            
            shuffle(mix);
            res.json(mix);
        });
    });
});

// Uložení detailního průchodu testem
app.post('/api/uloz-vysledek-testu', (req, res) => {
    if (!req.session.uzivatelId) return res.status(401).json({ chyba: 'Nejste přihlášeni.' });
    const { odpovedi, skore, celkem_otazek, cas_ve_vterinach, kategorie } = req.body;
    
    db.serialize(() => {
        db.run(`INSERT INTO vysledky (uzivatel_id, skore, celkem_otazek, cas_ve_vterinach, kategorie) VALUES (?, ?, ?, ?, ?)`, 
            [req.session.uzivatelId, skore, celkem_otazek, cas_ve_vterinach, kategorie || 'mix']);
            
        if (odpovedi && odpovedi.length > 0) {
            const stmt = db.prepare(`INSERT INTO odpovedi_uzivatelu (uzivatel_id, otazka_id, kategorie, spravne) VALUES (?, ?, ?, ?)`);
            odpovedi.forEach(odp => {
                stmt.run(req.session.uzivatelId, odp.otazka_id || 0, kategorie || 'mix', odp.spravne);
            });
            stmt.finalize();
        }
        
        res.json({ uspech: true });
    });
});

// Zjištění stavu, zda je uživatel přihlášen
app.get('/api/status', (req, res) => {
    if (req.session.uzivatelId) {
        res.json({ prihlasen: true, jmeno: req.session.jmeno, role: req.session.role });
    } else {
        res.json({ prihlasen: false });
    }
});

// --- API: REGISTRACE A PŘIHLÁŠENÍ ---

app.post('/api/registrace', async (req, res) => {
    const { jmeno, email, heslo, klicSboru } = req.body;
    if (!jmeno || !email || !heslo || !klicSboru) {
        return res.status(400).json({ chyba: 'Vyplňte všechna pole včetně bezpečnostního Kódu Sboru.' });
    }

    db.get(`SELECT hodnota FROM nastaveni WHERE klic = 'registracni_kod'`, [], async (err, row) => {
        if (err || !row) return res.status(500).json({ chyba: 'Chyba serveru při validaci bezpečnostního kódu.' });
        
        if (klicSboru !== row.hodnota) {
            return res.status(400).json({ chyba: 'Vložený tajný Registrační kód sboru není správný!' });
        }

        try {
            const hashedPassword = await bcrypt.hash(heslo, 10);
            
            db.run(`INSERT INTO uzivatele (jmeno, email, heslo) VALUES (?, ?, ?)`, 
                [jmeno, email, hashedPassword], 
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE')) {
                            return res.status(400).json({ chyba: 'Uživatel s tímto jménem nebo e-mailem již existuje.' });
                        }
                        return res.status(500).json({ chyba: 'Chyba při ukládání do databáze.' });
                    }
                    
                    // Přihlášení rovnou po registraci
                    req.session.uzivatelId = this.lastID;
                    req.session.jmeno = jmeno;
                    req.session.role = 'uzivatel'; // Výchozí role
                    res.json({ uspech: true, zprava: 'Registrace proběhla úspěšně.' });
                }
            );
        } catch (hashErr) {
            res.status(500).json({ chyba: 'Chyba při zpracování hesla.' });
        }
    });
});

app.post('/api/prihlaseni', (req, res) => {
    const { jmeno, heslo } = req.body;
    if (!jmeno || !heslo) return res.status(400).json({ chyba: 'Zadejte jméno a heslo.' });

    db.get(`SELECT id, jmeno, heslo, role FROM uzivatele WHERE jmeno = ?`, [jmeno], async (err, row) => {
        if (err) return res.status(500).json({ chyba: 'Chyba databáze.' });
        if (!row) return res.status(401).json({ chyba: 'Neplatné jméno nebo heslo.' });

        const isMatch = await bcrypt.compare(heslo, row.heslo);
        if (isMatch) {
            req.session.uzivatelId = row.id;
            req.session.jmeno = row.jmeno;
            req.session.role = row.role || 'uzivatel';
            res.json({ uspech: true, zprava: 'Přihlášení úspěšné.' });
        } else {
            res.status(401).json({ chyba: 'Neplatné jméno nebo heslo.' });
        }
    });
});

app.post('/api/odhlaseni', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ chyba: 'Nepodařilo se odhlásit.' });
        }
        res.clearCookie('connect.sid'); // Vymazání cookie
        res.json({ uspech: true, zprava: 'Odhlášení proběhlo úspěšně.' });
    });
});

// --- API: NASTAVENÍ ÚČTU A HISTORIE ---
app.get('/api/moje-testy', (req, res) => {
    if (!req.session.uzivatelId) return res.status(401).json({ chyba: 'Nejste přihlášeni.' });
    db.all(`SELECT skore, celkem_otazek, cas_ve_vterinach, kategorie, datum FROM vysledky WHERE uzivatel_id = ? ORDER BY datum DESC`, [req.session.uzivatelId], (err, rows) => {
        if (err) return res.status(500).json({ chyba: 'Chyba databáze.' });
        res.json(rows);
    });
});

app.post('/api/zmena-hesla-prihlaseny', async (req, res) => {
    if (!req.session.uzivatelId) return res.status(401).json({ chyba: 'Nejste přihlášeni.' });
    const { stareHeslo, noveHeslo } = req.body;
    
    db.get(`SELECT heslo FROM uzivatele WHERE id = ?`, [req.session.uzivatelId], async (err, row) => {
        if (err || !row) return res.status(500).json({ chyba: 'Uživatel nenalezen.' });
        
        const isMatch = await bcrypt.compare(stareHeslo, row.heslo);
        if (!isMatch) return res.status(400).json({ chyba: 'Původní heslo není správné.' });
        
        const hashedPassword = await bcrypt.hash(noveHeslo, 10);
        db.run(`UPDATE uzivatele SET heslo = ? WHERE id = ?`, [hashedPassword, req.session.uzivatelId], (updErr) => {
            if (updErr) return res.status(500).json({ chyba: 'Heslo se nepodařilo změnit.' });
            res.json({ uspech: true, zprava: 'Heslo bylo změněno.' });
        });
    });
});

// --- API: ADMINISTRACE ---
function isAdmin(req, res, next) {
    if (req.session.uzivatelId && req.session.role === 'admin') {
        next();
    } else {
        res.status(403).json({ chyba: 'Přístup odepřen.' });
    }
}

app.get('/api/admin/uzivatele', isAdmin, (req, res) => {
    db.all(`SELECT id, jmeno, email, role FROM uzivatele ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ chyba: 'Chyba při načítání uživatelů.' });
        res.json(rows);
    });
});

app.delete('/api/admin/uzivatele/:id', isAdmin, (req, res) => {
    const targetId = req.params.id;
    if (targetId == req.session.uzivatelId) return res.status(400).json({ chyba: 'Nemůžete smazat sami sebe.' });
    
    db.run(`DELETE FROM uzivatele WHERE id = ?`, [targetId], function(err) {
        if (err) return res.status(500).json({ chyba: 'Nepodařilo se smazat uživatele.' });
        db.run(`DELETE FROM vysledky WHERE uzivatel_id = ?`, [targetId]);
        res.json({ uspech: true });
    });
});

app.put('/api/admin/zmenit-roli', isAdmin, (req, res) => {
    const { id, novarole } = req.body;
    if (id == req.session.uzivatelId) return res.status(400).json({ chyba: 'Nemůžete měnit roli sami sobě.' });
    if (novarole !== 'admin' && novarole !== 'uzivatel') return res.status(400).json({ chyba: 'Neplatná role.' });
    
    db.run(`UPDATE uzivatele SET role = ? WHERE id = ?`, [novarole, id], function(err) {
        if (err) return res.status(500).json({ chyba: 'Změna role selhala.' });
        res.json({ uspech: true });
    });
});

app.get('/api/admin/nastaveni/kod', isAdmin, (req, res) => {
    db.get(`SELECT hodnota FROM nastaveni WHERE klic = 'registracni_kod'`, [], (err, row) => {
        if (err || !row) return res.status(500).json({ chyba: 'Chyba při načítání kódu.' });
        res.json({ kod: row.hodnota });
    });
});

app.put('/api/admin/nastaveni/kod', isAdmin, (req, res) => {
    const { novyKod } = req.body;
    if (!novyKod) return res.status(400).json({ chyba: 'Kód nesmí být prázdný.' });
    
    db.run(`UPDATE nastaveni SET hodnota = ? WHERE klic = 'registracni_kod'`, [novyKod], function(err) {
        if (err) return res.status(500).json({ chyba: 'Chyba při ukládání kódu.' });
        res.json({ uspech: true, zprava: 'Registrační kód úspěšně změněn.' });
    });
});

app.get('/api/admin/otazky/statistiky', isAdmin, (req, res) => {
    fs.readFile(path.join(__dirname, 'otazky.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ chyba: 'Nelze načíst soubor s otázkami.' });
        
        let otazky = [];
        try { otazky = JSON.parse(data); } catch(e){}
        
        const sql = `SELECT otazka_id, COUNT(*) as celkem_odpovedi, SUM(spravne) as celkem_spravne FROM odpovedi_uzivatelu GROUP BY otazka_id`;
        
        db.all(sql, [], (dbErr, rows) => {
            if (dbErr) return res.status(500).json({ chyba: 'Chyba při dotazování do databáze.' });
            
            // Namapování databáze na rychlý slovník podle otazka_id
            let statsMap = {};
            if (rows) {
                rows.forEach(r => {
                    statsMap[r.otazka_id] = {
                        celkem: r.celkem_odpovedi,
                        spravne: r.celkem_spravne
                    };
                });
            }
            
            // Složení finálních dat (Index obtížnosti p = spravne / celkem)
            let analytika = otazky.map(o => {
                const s = statsMap[o.id];
                const celkemOdpovedi = s ? s.celkem : 0;
                const spravneOdpovedi = s ? s.spravne : 0;
                const chybneOdpovedi = celkemOdpovedi - spravneOdpovedi;
                
                // Výpočet indexu obtížnosti p v procentech (100% = na úkol všichni odpověděli správně, 0% = všichni špatně)
                let p = celkemOdpovedi > 0 ? Math.round((spravneOdpovedi / celkemOdpovedi) * 100) : null;
                
                return {
                    id: o.id,
                    kategorie: o.kategorie || 'mix',
                    otazka: o.otazka,
                    celkemOdpovedi,
                    spravneOdpovedi,
                    chybneOdpovedi,
                    indexObtiznosti: p
                };
            });
            
            // Seřadíme otázky od těch "nejhorších" (s nejmenším indexem p = nejvíce lidí chybuje), aby to admin hned viděl
            analytika.sort((a, b) => {
                let pA = a.indexObtiznosti !== null ? a.indexObtiznosti : 999; 
                let pB = b.indexObtiznosti !== null ? b.indexObtiznosti : 999;
                return pA - pB;
            });
            
            res.json(analytika);
        });
    });
});

// --- API: OBNOVA HESLA ---
// Zpracování požadavku na reset hesla (odeslání mailu)
app.post('/api/zapomenute-heslo', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ chyba: 'Nebyl zadán e-mail.' });
    }

    db.get(`SELECT id, jmeno FROM uzivatele WHERE email = ?`, [email], (err, row) => {
        if (err || !row) {
            // I když e-mail neexistuje, z bezpečnostních důvodů nevracíme chybu, 
            // aby někdo neuhádl zaregistrované adresy.
            return res.json({ uspech: true, zprava: 'Pokud e-mail existuje, odeslali jsme odkaz pro obnovu hesla.' });
        }

        // 1. Vygenerujeme náhodný token (32 bytový string)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expirace = new Date(Date.now() + 3600000); // 1 hodina platnost

        // 2. Uložíme do databáze
        db.run(`UPDATE uzivatele SET reset_token = ?, reset_token_expirace = ? WHERE id = ?`, 
            [resetToken, expirace.toISOString(), row.id], (updErr) => {
            if (updErr) {
                console.error(updErr);
                return res.status(500).json({ chyba: 'Chyba serveru při generování tokenu.' });
            }

            // 3. Pošleme odkaz na mail
            const resetOdkaz = 'http://localhost:' + PORT + '?resetToken=' + resetToken;
            
            const mailOptions = {
                from: process.env.EMAIL_ADRESA,
                to: email,
                subject: 'Obnova hesla - Systém pro testy z požární ochrany',
                html: '<p>Dobrý den,</p>' +
                      '<p>obdrželi jsme žádost o změnu hesla k vašemu účtu pod přihlašovacím jménem: <strong>' + row.jmeno + '</strong>.</p>' +
                      '<p>Pro resetování hesla klikněte na následující odkaz (platnost 1 hodina):</p>' +
                      '<p><a href="' + resetOdkaz + '">' + resetOdkaz + '</a></p>' +
                      '<br><p><small>Pokud jste o změnu nepožádali, tento e-mail prosím ignorujte.</small></p>'
            };

            transporter.sendMail(mailOptions, (mailErr, info) => {
                if (mailErr) {
                    console.error('Chyba odesílání emailu:', mailErr);
                    return res.status(500).json({ chyba: 'Nastala chyba při odesílání e-mailu.' });
                }
                res.json({ uspech: true, zprava: 'Odkaz byl odeslán na Váš e-mail.' });
            });
        });
    });
});

// Zpracování zadání nového hesla (potvrzení resetu)
app.post('/api/obnova-hesla', async (req, res) => {
    const { token, noveHeslo } = req.body;

    if (!token || !noveHeslo) return res.status(400).json({ chyba: 'Chybí parametry.' });

    db.get(`SELECT id FROM uzivatele WHERE reset_token = ? AND reset_token_expirace > ?`, 
        [token, new Date().toISOString()], async (err, row) => {
        
        if (err || !row) {
            return res.status(400).json({ chyba: 'Token je neplatný nebo jeho platnost expirovala.' });
        }

        // Hash nového hesla
        const hashedPassword = await bcrypt.hash(noveHeslo, 10);

        // Uložení a smazání tokenu z logu
        db.run(`UPDATE uzivatele SET heslo = ?, reset_token = NULL, reset_token_expirace = NULL WHERE id = ?`, 
            [hashedPassword, row.id], (updErr) => {
            if (updErr) return res.status(500).json({ chyba: 'Heslo se nepodařilo změnit.' });
            
            res.json({ uspech: true, zprava: 'Heslo bylo úspěšně změněno. Můžete se přihlásit.' });
        });
    });
});


// Spuštění samotného serveru
app.listen(PORT, () => {
    console.log(`Server úspěšně běží a naslouchá na adrese http://localhost:${PORT}`);
});
