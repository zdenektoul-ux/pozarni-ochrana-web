# Návod ke spuštění aplikace - SDH Borotín (Školení)

Tato složka obsahuje kompletní zdrojové kódy a data pro webovou aplikaci Školení hasičů SDH Borotín.

## Požadavky na systém
Pro spuštění je nutné mít nainstalovaný **Node.js** (verze 16 nebo novější).

## Postup spuštění
1. Otevřete příkazový řádek (terminál) v této složce.
2. Nainstalujte potřebné knihovny příkazem:
   ```bash
   npm install
   ```
3. (Volitelně) Pokud chcete používat e-mailové notifikace, přejmenujte soubor `.env.example` na `.env` a vložte své SMTP údaje.
4. Spusťte aplikaci poklepáním na soubor:
   **`spustit_server.bat`**
   (nebo příkazem `node server.js`).
5. Aplikace bude dostupná v prohlížeči na adrese: `http://localhost:3000`

## Výchozí administrátorský přístup
Při prvním spuštění se v databázi automaticky vytvoří administrátor:
- **Jméno:** `admin`
- **Heslo:** `admin123`

---
*Věnováno všem hasičům, autor: Ing. Zdeněk Toul ml. (2026)*
