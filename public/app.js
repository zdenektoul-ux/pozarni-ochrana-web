// --- PŮVODNÍ KÓD PRO OBSLUHU ZÁLOŽEK A TLAČÍTEK ---
function zobrazAplikaci(idSekce) {
    document.getElementById('uvodContainer').classList.add('hidden-section');
    document.getElementById('loginContainer').classList.add('hidden-section');
    document.getElementById('testContainer').classList.add('hidden-section');
    document.getElementById('vysledekContainer').classList.add('hidden-section');
    document.getElementById('obnovaContainer').classList.add('hidden-section');
    document.getElementById('zmenaHeslaContainer').classList.add('hidden-section');
    
    const nastaveni = document.getElementById('nastaveniContainer');
    if(nastaveni) nastaveni.classList.add('hidden-section');
    const admin = document.getElementById('adminContainer');
    if(admin) admin.classList.add('hidden-section');
    
    document.getElementById(idSekce).classList.remove('hidden-section');
    document.getElementById(idSekce).classList.add('active-section');
}

function prepniTab(typ) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    if (typ === 'login') {
        tabBtns[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active-form');
        document.getElementById('loginForm').classList.remove('hidden-form');
        document.getElementById('registerForm').classList.remove('active-form');
        document.getElementById('registerForm').classList.add('hidden-form');
    } else {
        tabBtns[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active-form');
        document.getElementById('registerForm').classList.remove('hidden-form');
        document.getElementById('loginForm').classList.remove('active-form');
        document.getElementById('loginForm').classList.add('hidden-form');
    }
}

// NÁHRADA ZA SERVER BĚHEM UKÁZKY (Fake API - pro úvodní malou ukázku)
const vzoroveOtazky = [
    {
        "id": 1,
        "otazka": "Jaké je telefonní číslo na hasiče v České republice?",
        "moznosti": ["150", "155", "158", "112"],
        "spravnaOdpoved": 0,
        "vysvetleni": "Linka 150 je přímá volba na Hasičský záchranný sbor ČR."
    },
    {
        "id": 2,
        "otazka": "Čím se nesmí hasit hořící olej na pánvi?",
        "moznosti": ["Vodou", "Pěnovým hasicím přístrojem", "Zakrytím mokrým hadrem", "Pískem"],
        "spravnaOdpoved": 0,
        "vysvetleni": "Při hašení horkého oleje vodou by došlo k prudkému varu."
    }
];

function ukazVzorovouOtazku() {
    const kontejner = document.getElementById('vzorovaOtazka');
    kontejner.style.display = 'block';
    
    const ukazka = vzoroveOtazky[0];
    let moznostiHtml = '<ul>';
    ukazka.moznosti.forEach(m => { moznostiHtml += `<li>${m}</li>`; });
    moznostiHtml += '</ul>';

    kontejner.innerHTML = `
        <h3>Ukázka: ${ukazka.otazka}</h3>
        ${moznostiHtml}
        <p><i>Správná odpověď v systému je: Možnost č. ${ukazka.spravnaOdpoved + 1}</i></p>
    `;
}

// --- NOVÝ KÓD PRO SAMOTNÝ KVÍZ ---
// Tento kód bude později napojený na databázi a Node.js

let aktualniSeznamOtazek = []; // Zde si uložíme otázky pro aktuální test
let indexAktualniOtazky = 0;   // Kterou otázku zrovna ukazujeme (0 = první)
let body = 0;                  // Počet správných odpovědí
let vybranaMoznost = null;     // Ukazatel, co uživatel naklikl (0, 1, 2 nebo 3)
let timerInterval = null;      // Proměnná pro časomíru
let uplynuloSekund = 0;        // Měřič času testu
let aktualniKategorie = 'mix'; // Aktuální vybraný okruh
let odeslaneOdpovedi = [];     // Záznam odpovědí pro Spaced Repetition
let detailyOdpovedi = [];      // Detaily pro vypsání chyb v závěru

const nazvyKategorii = {
    'organizace': 'Organizace požární ochrany',
    'zdravoveda': 'Ochrana zdraví a záchrana života',
    'predlekarska': 'Předlékařská první pomoc',
    'prevence': 'Požární prevence a ochrana',
    'taktika': 'Požární taktika a hašení',
    'technika': 'Technický výcvik a prostředky',
    'mix': 'Náhodný mix ze všech okruhů'
};

const ikonyKategorii = {
    'organizace': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path><path d="M10 9h4"></path><path d="M10 13h4"></path></svg>`,
    'zdravoveda': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M12 7v6"></path><path d="M9 10h6"></path></svg>`,
    'predlekarska': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M12 11v6"></path><path d="M9 14h6"></path></svg>`,
    'prevence': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>`,
    'taktika': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fd7e14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"></path><path d="M14 2v2"></path><path d="M16 8a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v14h8V8Z"></path><path d="M12 14v-4"></path><path d="M12 22v-4"></path></svg>`,
    'technika': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    'mix': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#17a2b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"></path><path d="M4 20h5v-5"></path><path d="M21 3l-8 8"></path><path d="M3 21l8-8"></path><path d="M21 21l-8-8"></path><path d="M3 3l8 8"></path></svg>`
};

// Reálné odesílání přihlašovacích údajů
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Zabrání znovunačtení stránky
    const jmeno = document.getElementById('loginName').value;
    const heslo = document.getElementById('loginPass').value;

    try {
        const res = await fetch('/api/prihlaseni', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jmeno, heslo })
        });
        const data = await res.json();
        if (res.ok) {
            // Po úspěšném přihlášení aktualizujeme UI a vrátíme uživatele na úvodní obrazovku
            await overStavPrihlaseni();
            zobrazAplikaci('uvodContainer');
        } else {
            alert(data.chyba);
        }
    } catch (err) {
        alert("Chyba spojení.");
    }
});

// Reálné odesílání registračních údajů
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const jmeno = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const heslo = document.getElementById('regPass').value;
    const klicSboru = document.getElementById('regKlic').value.trim();

    try {
        const res = await fetch('/api/registrace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jmeno, email, heslo, klicSboru })
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.zprava);
            // Registrace proběhla a systém automaticky přihlásil
            await overStavPrihlaseni();
            zobrazAplikaci('uvodContainer');
        } else {
            alert(data.chyba);
        }
    } catch (err) {
        alert("Chyba spojení.");
    }
});

// Hlavní funkce, která "nastartuje" test
async function spustitTest(kategorie = 'mix') {
    // 1. Resetujeme hodnoty do výchozího stavu
    aktualniKategorie = kategorie;
    indexAktualniOtazky = 0;
    body = 0;
    uplynuloSekund = 0;
    odeslaneOdpovedi = [];
    detailyOdpovedi = [];
    
    document.getElementById('nadpisTestu').innerText = "Probíhá testování na téma: " + (nazvyKategorii[kategorie] || kategorie.toUpperCase());
    
    // Zobrazíme vizuální načítání
    document.getElementById('textOtazky').innerText = "Načítám adaptivní mix otázek, připravte se...";
    document.getElementById('moznostiProstor').innerHTML = '';
    zobrazAplikaci('testContainer');
    
    try {
        const res = await fetch(`/api/test-otazky/${kategorie}`);
        if(res.ok) {
            let data = await res.json();
            
            // Jádro: Náhodné míchání možností (Fisher-Yates) aby nebyla správná odpověď pořád na stejném místě
            data.forEach(otazka => {
                const spravnyText = otazka.moznosti[otazka.spravnaOdpoved]; // Uložíme si původní správný text
                
                // Zamíchat pole mozností
                for (let i = otazka.moznosti.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [otazka.moznosti[i], otazka.moznosti[j]] = [otazka.moznosti[j], otazka.moznosti[i]];
                }
                
                // Znovu přiřadit index správné odpovědi
                otazka.spravnaOdpoved = otazka.moznosti.indexOf(spravnyText);
            });
            
            aktualniSeznamOtazek = data;
            
            if(aktualniSeznamOtazek.length === 0) {
                alert("V této kategorii zatím nejsou žádné otázky.");
                zobrazAplikaci('uvodContainer');
                return;
            }
            
            // Zobrazíme na obrazovce celkový počet (např. Otázka 1 / 10)
            document.getElementById('celkemOtazek').innerText = aktualniSeznamOtazek.length;
            
            // Spustíme časovač
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                uplynuloSekund++;
                let minuty = Math.floor(uplynuloSekund / 60);
                let sekundy = uplynuloSekund % 60;
                document.getElementById('casomer').innerText = 
                    (minuty < 10 ? '0' + minuty : minuty) + ':' + 
                    (sekundy < 10 ? '0' + sekundy : sekundy);
            }, 1000);

            // Naneseme první otázku
            vykresliInstanciOtazky();
        } else {
            alert("Chyba při stahování mixu otázek.");
            zobrazAplikaci('uvodContainer');
        }
    } catch(err) {
        alert("Nelze spustit test (chyba sítě).");
        zobrazAplikaci('uvodContainer');
    }
}

// Funkce ukáže konkrétní (aktuální) otázku do HTML okna
function vykresliInstanciOtazky() {
    const otazka = aktualniSeznamOtazek[indexAktualniOtazky];
    vybranaMoznost = null; // Vyresetujeme výběr
    document.getElementById('btnDalsi').disabled = true; // Tlačítko další nejde kliknout na prázdno
    
    // Obnovíme ukazatel čísla
    document.getElementById('aktualniCislo').innerText = indexAktualniOtazky + 1;
    
    // Vepíšeme text otázky
    document.getElementById('textOtazky').innerText = otazka.otazka;
    
    // Vygenerujeme 4 klikací bloky (tlačítka pro možnosti)
    let htmlMoznosti = '';
    otazka.moznosti.forEach((textMoznosti, moznostIndex) => {
        // Zavolá funkci pro označení odpovědi po kliknutí
        htmlMoznosti += `<button class="moznost-btn" onclick="oznacMoznost(${moznostIndex}, this)">
            ${String.fromCharCode(65 + moznostIndex)}. ${textMoznosti}
        </button>`;
    });
    
    document.getElementById('moznostiProstor').innerHTML = htmlMoznosti;
    
    // Změníme text tlačítka, pokud jsme u poslední otázky
    if (indexAktualniOtazky === aktualniSeznamOtazek.length - 1) {
        document.getElementById('btnDalsi').innerText = "Dokončit test ✔️";
    } else {
        document.getElementById('btnDalsi').innerText = "Další otázka ➡";
    }
}

// Funkce, která uživateli "obarví" to, co zaklikl
window.oznacMoznost = function(indexMoznosti, tlacitkoElement) {
    vybranaMoznost = indexMoznosti; // Zapamatujeme si to do paměti
    
    // Odbarvíme všechna ostatní tlačítka (zbavíme je třídy 'vybrano')
    const vsechnaTlacitka = document.querySelectorAll('.moznost-btn');
    vsechnaTlacitka.forEach(btn => btn.classList.remove('vybrano'));
    
    // Přidáme speciální CSS třídu pro označení zakliknutému tlačítku
    tlacitkoElement.classList.add('vybrano');
    
    // Umožníme kliknout na tlačítko ZDE...
    document.getElementById('btnDalsi').disabled = false;
};

// Funkce pro posunutí na "další" obrazovku s otázkou
window.dalsiOtazku = function() {
    // 1. Zkontrolujeme, zda uživatel předchozí otázku trefil správně (body)
    const spravnaVolba = aktualniSeznamOtazek[indexAktualniOtazky].spravnaOdpoved;
    let jeSpravne = (vybranaMoznost === spravnaVolba) ? 1 : 0;
    
    if (jeSpravne === 1) {
        body++; // Přičteme bod
    }
    
    // Uložíme si stopu pro databázi adaptivního učení
    odeslaneOdpovedi.push({
        otazka_id: aktualniSeznamOtazek[indexAktualniOtazky].id,
        spravne: jeSpravne
    });
    
    // Uložíme si detailní záznam pro závěrečnou obrazovku chyb
    detailyOdpovedi.push({
        otazka: aktualniSeznamOtazek[indexAktualniOtazky].otazka,
        spravneZodpovezeno: jeSpravne === 1,
        vybranyText: vybranaMoznost !== null ? aktualniSeznamOtazek[indexAktualniOtazky].moznosti[vybranaMoznost] : 'Neodpovězeno',
        spravnyText: aktualniSeznamOtazek[indexAktualniOtazky].moznosti[spravnaVolba],
        vysvetleni: aktualniSeznamOtazek[indexAktualniOtazky].vysvetleni
    });
    
    // 2. Jsme na konci kvízu?
    indexAktualniOtazky++;
    if (indexAktualniOtazky < aktualniSeznamOtazek.length) {
        vykresliInstanciOtazky(); // Jdeme kreslit další otázku z pole
    } else {
        ukonciTest(); // Test skončil (není co kreslit)
    }
};

// Funkce shromáždí body, uloží do DB a ukáže obrazovku "Hotovo"
async function ukonciTest() {
    clearInterval(timerInterval); // Zastavíme odbíjení času
    
    const maxBodu = aktualniSeznamOtazek.length;
    const procenta = Math.round((body / maxBodu) * 100) || 0;
    
    // Gamifikace na základě skóre
    let motivaceHtml = '';
    if (procenta === 100) {
        motivaceHtml = '<div style="font-size: 3.5rem; margin-bottom: 10px;">🏆</div><h3 style="color: var(--accent-color); margin-top: 0;">Excelentní výkon! Jste mistr oboru.</h3>';
    } else if (procenta >= 80) {
        motivaceHtml = '<div style="font-size: 3.5rem; margin-bottom: 10px;">🥇</div><h3 style="color: #28a745; margin-top: 0;">Skvělá práce! Velmi solidní znalosti.</h3>';
    } else if (procenta >= 60) {
        motivaceHtml = '<div style="font-size: 3.5rem; margin-bottom: 10px;">🥈</div><h3 style="color: #17a2b8; margin-top: 0;">Dobrá práce! Dobrý základ, ale je co pilovat.</h3>';
    } else if (procenta >= 40) {
        motivaceHtml = '<div style="font-size: 3.5rem; margin-bottom: 10px;">🥉</div><h3 style="color: #fd7e14; margin-top: 0;">Slušná snaha, pro ostrou akci to ale chce více praxe.</h3>';
    } else {
        motivaceHtml = '<div style="font-size: 3.5rem; margin-bottom: 10px;">🚒</div><h3 style="color: #dc3545; margin-top: 0;">Tohle se nepovedlo. Doporučujeme důkladně projít studijní materiály!</h3>';
    }
    
    document.getElementById('gamifikaceProstor').innerHTML = motivaceHtml;
    
    document.getElementById('skoreProcenta').innerText = procenta + "%";
    document.getElementById('skoreZlomkem').innerText = body + " / " + maxBodu;
    document.getElementById('konecnyCas').innerText = document.getElementById('casomer').innerText;
    
    // Vykreslení chyb ušetříme do speciální sekce
    const chybyProstor = document.getElementById('chybyProstor');
    let chybyHtml = '';
    const chyby = detailyOdpovedi.filter(d => !d.spravneZodpovezeno);
    
    if (chyby.length === 0) {
        chybyHtml = '<h3 style="color: #28a745; text-align: center;">🔥 Vynikající práce! Zásah byl proveden bez jediné chybičky! 🏆</h3>';
    } else {
        chybyHtml = `<h3 style="color: #dc3545;">Prostor pro zlepšení (počet chyb v testu: ${chyby.length}):</h3>`;
        chyby.forEach(ch => {
            chybyHtml += `
            <div style="background: #fff; padding: 15px; border-left: 5px solid #dc3545; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <h4 style="margin-top: 0;">${ch.otazka}</h4>
                <p style="margin: 5px 0;">❌ <span style="text-decoration: line-through; color: #dc3545;">${ch.vybranyText}</span></p>
                <p style="margin: 5px 0;">✅ <strong style="color: #28a745;">${ch.spravnyText}</strong></p>
                <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-style: italic; color: #555;">
                    💡 <strong>Vysvětlení:</strong> ${ch.vysvetleni || "K této otázce nemáme žádné podrobné odůvodnění."}
                </div>
            </div>`;
        });
    }
    chybyProstor.innerHTML = chybyHtml;
    
    zobrazAplikaci('vysledekContainer');
    
    // Odeslání do Node.js backendu
    try {
        await fetch('/api/uloz-vysledek-testu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                odpovedi: odeslaneOdpovedi,
                skore: body,
                celkem_otazek: maxBodu,
                cas_ve_vterinach: uplynuloSekund,
                kategorie: aktualniKategorie
            })
        });
        // Po uložení zaktualizujeme progres uživatele (kartičky)
        nactiKategorie();
    } catch(err) {
        console.error("Nepodařilo se uložit výsledek testu na server.");
    }
}

// --- LOGIKA OKOLO PŘERUŠENÍ A OPUŠTĚNÍ TESTU ---
window.potvrditUkonceniTestu = function() {
    document.getElementById('ukoncitModal').classList.remove('hidden-section');
};

window.skrytUkonceniTestu = function() {
    document.getElementById('ukoncitModal').classList.add('hidden-section');
};

window.zahoditTest = function() {
    clearInterval(timerInterval);
    document.getElementById('ukoncitModal').classList.add('hidden-section');
    zobrazAplikaci('uvodContainer');
};

// --- LOGIKA OBNOVY HESLA ---

// Zpracování odeslání emailu pro reset hesla
document.getElementById('obnovaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('obnovaEmail').value;

    try {
        const response = await fetch('/api/zapomenute-heslo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        
        if (response.ok) {
            alert(result.zprava);
            zobrazAplikaci('loginContainer');
        } else {
            alert("Chyba: " + result.chyba);
        }
    } catch (err) {
        alert("Nepodařilo se spojit se serverem.");
    }
});

// Zpracování odeslání nového hesla
document.getElementById('zmenaHeslaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const heslo = document.getElementById('noveHeslo').value;
    const hesloPotvrzeni = document.getElementById('noveHesloPotvrzeni').value;
    const token = document.getElementById('resetTokenUrl').value;

    if (heslo !== hesloPotvrzeni) {
        alert("Hesla se neshodují, zadejte je znovu.");
        return;
    }

    try {
        const response = await fetch('/api/obnova-hesla', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, noveHeslo: heslo })
        });
        const result = await response.json();

        if (response.ok) {
            alert(result.zprava);
            zobrazAplikaci('loginContainer');
        } else {
            alert("Chyba: " + result.chyba);
        }
    } catch (err) {
        alert("Nepodařilo se dokončit obnovu hesla.");
    }
});

// Záchyt odkazu při načtení stránky (pokud přichází uživatel z e-mailu)
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('resetToken');

    if (resetToken) {
        // Uživatel přišel s tokenem na obnovu z e-mailu, ukaž mu modifikovaný container
        document.getElementById('resetTokenUrl').value = resetToken;
        zobrazAplikaci('zmenaHeslaContainer');
        
        // Smažeme parametr z URL (aby po refreshi neměl token na očích a předešlo se zmatkům)
        window.history.replaceState({}, document.title, "/");
    }

    // Ověření stavu přihlášení na každém načtení stránky
    overStavPrihlaseni();
});

// --- SPRÁVA RELACE (SESSION / PŘIHLÁŠENÍ) ---
async function overStavPrihlaseni() {
    try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data.prihlasen) {
            aktualizujZobrazeniPrihlaseni(data.jmeno, data.role);
        }
    } catch(err) {
        console.error("Nelze ověřit stav:", err);
    }
}

function aktualizujZobrazeniPrihlaseni(jmeno, role = 'uzivatel') {
    // Úprava hlavičky - přidání rozbalovacího menu
    const userArea = document.getElementById('userArea');
    let adminLink = role === 'admin' ? `<a href="#" onclick="zobrazAdministraci(); return false;" style="color: #dc3545; font-weight: bold;">Administrace</a>` : '';

    userArea.innerHTML = `
        <div class="user-dropdown">
            <button class="user-dropdown-btn" onclick="toggleDropdown()">👤 ${jmeno} ▼</button>
            <div id="userDropdownContent" class="user-dropdown-content">
                <a href="#" onclick="zobrazNastaveniUctu(); return false;">Nastavení účtu</a>
                ${adminLink}
                <a href="#" onclick="odhlasit(); return false;">Odhlásit se</a>
            </div>
        </div>
    `;

    // Změna hlavního tlačítka na úvodu a načtení dlaždic
    const hlavniTlacitko = document.getElementById('hlavniAkcniTlacitko');
    if (hlavniTlacitko) {
        // Skryjeme stará tlačítka a ukázku
        const akcniTlacitka = document.querySelector('.action-buttons');
        if(akcniTlacitka) akcniTlacitka.style.display = 'none';
        const vzorova = document.getElementById('vzorovaOtazka');
        if(vzorova) vzorova.style.display = 'none';
        
        // Zobrazíme sekci kategorií
        const katProstor = document.getElementById('kategorieProstor');
        if (katProstor) {
            katProstor.style.display = 'block';
            nactiKategorie();
        }
    }
}

// Funkce stahne progrese uzivatele v modulech a vykresli dlaždice
async function nactiKategorie() {
    try {
        const res = await fetch('/api/kategorie');
        if(res.ok) {
            const data = await res.json();
            const grid = document.getElementById('kategorieGrid');
            grid.innerHTML = '';
            
            // Přidáme možnost "Všechno - Náhodný mix"
            grid.innerHTML += vytvorKartaHtml('mix', 'Náhodný mix okruhů', null, null);
            
            data.forEach(kat => {
                if(kat.nazev !== 'mix') {
                    // Použijeme mapování názvů, pokud existuje
                    const nadpisKarty = nazvyKategorii[kat.nazev] || kat.nazev.toUpperCase();
                    grid.innerHTML += vytvorKartaHtml(kat.nazev, nadpisKarty, kat.prosel, kat.celkem);
                }
            });
        }
    } catch(err) {
        console.error("Chyba načítání kategorií", err);
    }
}

function vytvorKartaHtml(idKat, nadpis, prosel, celkem) {
    let progress = '';
    if(celkem !== null) {
        let pct = Math.round((prosel / celkem) * 100) || 0;
        progress = `<div style="margin-top:10px; font-size: 0.9em; color:#555;">
            Progres: ${prosel} / ${celkem} otázek (${pct}%)
            <div style="background:#eee; height:8px; border-radius:4px; margin-top:5px; overflow:hidden;">
                <div style="background:var(--accent-color); height:100%; width:${pct}%;"></div>
            </div>
        </div>`;
    }
    const ikona = ikonyKategorii[idKat] || '';
    return `
    <div class="kategorie-card" onclick="spustitTest('${idKat}')" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
        <div>
            <div style="margin-bottom: 12px; display: inline-block;">${ikona}</div>
            <h4>${nadpis}</h4>
            ${progress}
        </div>
        <button class="btn btn-primary" style="width: 100%; margin-top: 15px; pointer-events: none;">Vybrat a spustit test</button>
    </div>`;
}

function toggleDropdown() {
    // CSS očekává třídu 'show' na obalovacím divu .user-dropdown, nikoliv uvnitř
    document.getElementById("userDropdownContent").parentElement.classList.toggle("show");
}

// Zavřít dropdown, když uživatel klikne mimo
window.onclick = function(event) {
    if (!event.target.matches('.user-dropdown-btn') && !event.target.closest('.user-dropdown')) {
        let dropdowns = document.getElementsByClassName("user-dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

async function odhlasit() {
    try {
        await fetch('/api/odhlaseni', { method: 'POST' });
        // Znovunačtení stránky aplikaci čistě vyresetuje
        window.location.reload(); 
    } catch(err) {
        console.error("Chyba při odhlašování:", err);
    }
}

// --- NASTAVENÍ ÚČTU A HISTORIE ---
function prepniTabNastaveni(typ) {
    document.getElementById('tabHistorieBtn').classList.remove('active');
    document.getElementById('tabHesloBtn').classList.remove('active');
    document.getElementById('historieTab').classList.add('hidden-form');
    document.getElementById('historieTab').classList.remove('active-form');
    document.getElementById('zmenaHeslaProfilForm').classList.add('hidden-form');
    document.getElementById('zmenaHeslaProfilForm').classList.remove('active-form');

    if (typ === 'historie') {
        document.getElementById('tabHistorieBtn').classList.add('active');
        document.getElementById('historieTab').classList.remove('hidden-form');
        document.getElementById('historieTab').classList.add('active-form');
    } else {
        document.getElementById('tabHesloBtn').classList.add('active');
        document.getElementById('zmenaHeslaProfilForm').classList.remove('hidden-form');
        document.getElementById('zmenaHeslaProfilForm').classList.add('active-form');
    }
}

async function nactiProgressBary() {
    try {
        const res = await fetch('/api/kategorie');
        if (res.ok) {
            const data = await res.json();
            const pbContainer = document.getElementById('historieProgressBary');
            let html = '';
            data.forEach(kat => {
                if (kat.nazev === 'mix') return; // Náhodný mix nebudeme ukazovat ve statických učebních progress barech 
                const nadpis = nazvyKategorii[kat.nazev] || kat.nazev;
                const ikona = ikonyKategorii[kat.nazev] || '';
                const pct = kat.celkem > 0 ? Math.round((kat.prosel / kat.celkem) * 100) : 0;
                
                html += `
                <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 15px;">
                    <div style="width: 30px; text-align: center;">${ikona}</div>
                    <div style="flex-grow: 1;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 3px;">
                            <strong>${nadpis}</strong>
                            <span>${kat.prosel} / ${kat.celkem} (${pct}%)</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                </div>`;
            });
            pbContainer.innerHTML = html;
        }
    } catch (err) {
        console.error("Chyba při načítání progress barů", err);
    }
}

async function zobrazNastaveniUctu() {
    zobrazAplikaci('nastaveniContainer');
    prepniTabNastaveni('historie');
    
    // Vykreslení celkových znalostních progress barů
    nactiProgressBary();
    
    try {
        const response = await fetch('/api/moje-testy');
        if (response.ok) {
            const data = await response.json();
            const list = document.getElementById('historieList');
            if (data.length === 0) {
                list.innerHTML = '<p>Zatím nemáte splněné žádné testy. Vrhněte se do toho!</p>';
            } else {
                let html = '<div class="historie-grid">';
                data.forEach(t => {
                    const d = new Date(t.datum).toLocaleString('cs-CZ');
                    const pct = Math.round((t.skore / t.celkem_otazek) * 100);
                    
                    let barva = '#dc3545'; // Červená pro nesplněno
                    if (pct >= 80) barva = '#28a745'; // Zelená pro skvělé skóre
                    else if (pct >= 60) barva = '#fd7e14'; // Oranžová
                    else if (pct >= 40) barva = '#17a2b8'; // Modrá pro aspoň snahu
                    
                    const katName = nazvyKategorii[t.kategorie] || t.kategorie || 'Neznámá varianta';
                    let ikona = ikonyKategorii[t.kategorie];
                    if(!ikona) ikona = `<div style="font-size:24px;">📝</div>`; // Fallback ikona
                    
                    html += `
                    <div class="historie-item">
                        <div class="historie-ikona">${ikona}</div>
                        <div class="historie-info">
                            <strong>${katName}</strong><br>
                            <span style="font-size: 0.85rem; color: #666;">${d} | Čas plnění: ${t.cas_ve_vterinach} s</span>
                        </div>
                        <div class="historie-skore" style="color: ${barva};">
                            ${pct} %<br>
                            <span style="font-size: 0.8rem; color: #888;">${t.skore} z ${t.celkem_otazek} bodů</span>
                        </div>
                    </div>`;
                });
                html += '</div>';
                list.innerHTML = html;
            }
        }
    } catch (e) {
        document.getElementById('historieList').innerText = "Chyba při načítání historie ze serveru.";
    }
}

document.getElementById('zmenaHeslaProfilForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const stareHeslo = document.getElementById('stareHesloProfil').value;
    const noveHeslo = document.getElementById('noveHesloProfil').value;
    
    try {
        const response = await fetch('/api/zmena-hesla-prihlaseny', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stareHeslo, noveHeslo })
        });
        const result = await response.json();
        alert(result.zprava || result.chyba);
        if (response.ok) {
            document.getElementById('stareHesloProfil').value = '';
            document.getElementById('noveHesloProfil').value = '';
        }
    } catch(err) {
        alert("Chyba při komunikaci se serverem.");
    }
});

// --- ADMINISTRACE ---
async function zobrazAdministraci() {
    zobrazAplikaci('adminContainer');
    nactiUzivateleAdmin();
    nactiRegistracniKod();
    nactiStatistikyOtazekAdmin();
}

async function nactiRegistracniKod() {
    try {
        const res = await fetch('/api/admin/nastaveni/kod');
        const data = await res.json();
        if (res.ok) {
            document.getElementById('adminZobrazenyKod').innerText = data.kod;
        }
    } catch(e) {}
}

async function zmenRegistracniKod() {
    const novyKod = document.getElementById('adminNovyKod').value.trim();
    if (!novyKod) return alert("Kód nesmí být prázdný!");
    
    try {
        const res = await fetch('/api/admin/nastaveni/kod', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ novyKod })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Kód změněn!");
            document.getElementById('adminNovyKod').value = '';
            nactiRegistracniKod();
        } else {
            alert("Chyba: " + data.chyba);
        }
    } catch(e) {
        alert("Chyba připojení k serveru.");
    }
}

async function nactiUzivateleAdmin() {
    const list = document.getElementById('adminUzivateleList');
    list.innerHTML = '<tr><td colspan="5">Načítám...</td></tr>';
    try {
        const response = await fetch('/api/admin/uzivatele');
        if (response.ok) {
            const data = await response.json();
            list.innerHTML = '';
            data.forEach(u => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${u.id}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${u.jmeno}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${u.email || ''}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <select class="role-select" onchange="zmenitRoli(${u.id}, this.value)">
                            <option value="uzivatel" ${u.role !== 'admin' ? 'selected' : ''}>Uživatel</option>
                            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                        <button class="btn btn-outline" style="padding: 5px 10px; border-color: #dc3545; color: #dc3545;" onclick="smazatUzivatele(${u.id})">Smazat</button>
                    </td>
                `;
                list.appendChild(tr);
            });
        } else {
            list.innerHTML = '<tr><td colspan="5" style="color:red;">Nemáte oprávnění nebo nastala chyba.</td></tr>';
        }
    } catch(err) {
        list.innerHTML = '<tr><td colspan="5">Chyba spojení.</td></tr>';
    }
}

async function smazatUzivatele(id) {
    if (!confirm("Opravdu chcete smazat tohoto uživatele? Veškerá historie bude ztracena.")) return;
    
    try {
        const res = await fetch(`/api/admin/uzivatele/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
            nactiUzivateleAdmin();
        } else {
            alert(data.chyba || "Chyba při mazání.");
        }
    } catch(e) {
        alert("Chyba sítě.");
    }
}

async function zmenitRoli(id, novarole) {
    try {
        const res = await fetch('/api/admin/zmenit-roli', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, novarole })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Role úspěšně změněna.");
            if (novarole === 'uzivatel') {
                overStavPrihlaseni();
            }
        } else {
            alert(data.chyba || "Chyba při změně role.");
            nactiUzivateleAdmin();
        }
    } catch(e) {
        alert("Chyba sítě.");
    }
}

// Načtení analytiky (obtížnosti) testových úloh 
async function nactiStatistikyOtazekAdmin() {
    const list = document.getElementById('adminAnalytikaList');
    list.innerHTML = '<tr><td colspan="5">Načítám analýzu ze serveru...</td></tr>';
    
    try {
        const response = await fetch('/api/admin/otazky/statistiky');
        if (response.ok) {
            const data = await response.json();
            list.innerHTML = '';
            
            if(data.length === 0) {
                list.innerHTML = '<tr><td colspan="5">Zatím nejsou k dispozici žádná data o testování.</td></tr>';
                return;
            }
            
            data.forEach(q => {
                const tr = document.createElement('tr');
                
                // Určení barvy podle indexu obtížnosti p
                let barvaP = '';
                let textP = q.indexObtiznosti !== null ? q.indexObtiznosti + ' %' : 'N/A';
                
                if (q.indexObtiznosti !== null) {
                    if (q.indexObtiznosti <= 40) {
                        barvaP = 'color: #dc3545; font-weight: bold;'; // Těžká (varování)
                    } else if (q.indexObtiznosti >= 80) {
                        barvaP = 'color: #28a745;'; // Velmi snadná
                    }
                }
                
                tr.innerHTML = `
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>ID: ${q.id}</strong><br><small style="color:#777;">${q.kategorie}</small></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 0.9em;">${q.otazka.substring(0, 100)}...</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;"><strong>${q.celkemOdpovedi}</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #28a745;">${q.spravneOdpovedi}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; ${barvaP}">${textP}</td>
                `;
                list.appendChild(tr);
            });
        } else {
            list.innerHTML = '<tr><td colspan="5" style="color:red;">Nelze načíst analytická data.</td></tr>';
        }
    } catch(err) {
        list.innerHTML = '<tr><td colspan="5">Chyba spojení.</td></tr>';
    }
}
