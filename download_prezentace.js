const https = require('https');
const fs = require('fs');
const path = require('path');

const url = "https://www.hasici-vzdelavani.cz/node/168";
const baseFolder = path.join(__dirname, "prezentace");

// Vytvoří hlavní složku, pokud neexistuje
if (!fs.existsSync(baseFolder)) fs.mkdirSync(baseFolder);

// Toto jsou přesné klíčové fráze z tabulky webu, podle kterých rozdělíme obsah do 6 kapitol
const categories = [
    "ORGANIZACE POŽÁRNÍ OCHRANY",
    "OCHRANA ZDRAVÍ A ŽIVOTA HASIČE",
    "PŘEDLÉKAŘSKÁ POMOC",
    "POŽÁRNÍ PREVENCE",
    "POŽÁRNÍ TAKTIKA",
    "TECHNICKÝ VÝCVIK"
];

// Ošetření chyby s certifikáty na starších webech
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log("Připojuji se k webu Hasiči Vzdělávání...");

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Stránka načtena, analyzuji odkazy...");
        
        // Rozdělíme HTML kód na části podle nadpisů kapitol
        let separator = new RegExp("(" + categories.join("|") + ")", "g");
        let textMatch = data.split(separator);
        
        // Hledáme jakýkoliv odkaz na soubor
        let allLinksRegex = /href="([^"]+\.(pdf|doc|docx|pptx|ppt|mp4))"/ig;

        let downloadQueue = [];

        // textMatch[0] je balast nahoře
        // textMatch[1] = "ORGANIZACE POŽÁRNÍ OCHRANY", textMatch[2] = odpovídající obsah...
        for (let i = 1; i < textMatch.length; i += 2) {
            let catName = textMatch[i].trim(); 
            let catContent = textMatch[i+1];
            
            // Pojmenujeme složky např. 1_ORGANIZACE POŽÁRNÍ OCHRANY
            let catFolder = path.join(baseFolder, `${Math.floor(i/2)+1}_${catName}`);
            if (!fs.existsSync(catFolder)) fs.mkdirSync(catFolder);
            
            let match;
            while ((match = allLinksRegex.exec(catContent)) !== null) {
                let fileUrl = match[1];
                if (!fileUrl.startsWith("http")) fileUrl = "https://www.hasici-vzdelavani.cz" + fileUrl;
                
                downloadQueue.push({ url: fileUrl, folder: catFolder });
            }
        }
        
        // Odstranění případných duplicit (kdyby tam autoři měli stejný odkaz dvakrát v textu)
        let uniqueQ = [];
        let seen = new Set();
        for (let item of downloadQueue) {
            if (!seen.has(item.url)) {
                seen.add(item.url);
                uniqueQ.push(item);
            }
        }

        console.log(`Nalezeno celkem ${uniqueQ.length} unikátních souborů. Začínám sekvenční stahování...`);
        downloadNext(uniqueQ, 0);
    });
}).on('error', (err) => {
    console.error("Chyba při stahování samotné stránky: ", err.message);
});

function downloadNext(queue, index) {
    if (index >= queue.length) {
        console.log("\n==================================");
        console.log("✅ VŠECHNY SOUBORY BYLY ÚSPĚŠNĚ STAŽENY!");
        console.log("Lze je nahrát do NotebookLM.");
        console.log("==================================");
        return;
    }
    
    let item = queue[index];
    let fileName = path.basename(item.url);
    // Dekódování URL znaků (např. %20 na mezeru) pro hezké názvy
    fileName = decodeURIComponent(fileName); 
    let destPath = path.join(item.folder, fileName);
    
    process.stdout.write(`Stahuji ${index + 1}/${queue.length}: ${fileName}... `);
    
    const request = https.get(item.url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            // Sledujeme případné přesměrování
            https.get(res.headers.location, (redirRes) => {
                let file = fs.createWriteStream(destPath);
                redirRes.pipe(file);
                file.on('finish', () => { file.close(); console.log("OK"); downloadNext(queue, index + 1); });
            });
        } else if (res.statusCode === 200) {
            let file = fs.createWriteStream(destPath);
            res.pipe(file);
            file.on('finish', () => { file.close(); console.log("OK"); downloadNext(queue, index + 1); });
        } else {
            console.log(`Chyba serveru ${res.statusCode}`);
            downloadNext(queue, index + 1);
        }
    });

    request.on('error', (err) => {
        console.log("Chyba spojení: " + err.message);
        downloadNext(queue, index + 1);
    });
}
