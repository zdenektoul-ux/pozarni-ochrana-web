const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\zdene\\.gemini\\antigravity\\brain\\8b2bace6-4893-43a2-bd6e-69b7e56a4bf4';
const distPath = path.join(__dirname, 'zaverecna_prace_komplet.md');

const filesToJoin = [
  'abstrakt.md',
  'kapitola_1.md',
  'kapitola_2.md',
  'kapitola_3.md',
  'kapitola_4.md',
  'kapitola_5.md',
  'kapitola_6.md',
  'kapitola_7.md',
  'literatura.md'
];

let finalMarkdown = '';

for (const file of filesToJoin) {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  // Zajištění, že každý soubor končí novým řádkem pro spolehlivou návaznost
  finalMarkdown += content.trim() + '\n\n';
}

fs.writeFileSync(distPath, finalMarkdown, 'utf8');
console.log('Zaverecna prace byla uspesne zkompletovana a ulozena do: ' + distPath);
