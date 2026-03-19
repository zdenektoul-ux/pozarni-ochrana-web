# Návod na vygenerování zkušebních otázek z přednášek

*Tento soubor slouží jako permanentní záloha našeho postupu. UI tlačítka občas mohou zlobit, proto si zde uchováváme to nejdůležitější pro vaši další práci.*

## 1. Doporučené nástroje pro načtení skript a přednášek
*   **Google NotebookLM** (Absolutní favorit, zdarma): [notebooklm.google.com](https://notebooklm.google.com/) – nahrajte sem všechny PDF a PPTX přednášky. Nástroj čerpá striktně ze zdrojů a nevymýšlí si.
*   **Claude 3.5 Sonnet / Gemini Advanced**: Klasické "chatovací" AI nástroje pro nahrání souboru s přednáškou.

## 2. Přesný příkaz (Prompt) ke zkopírování
Níže uvedený text zkopírujte a vložte do AI nástroje, jakmile nahrajete své materiály. Zaručí vám formát, který jednoduše "spolkneme" do naší aplikace.

> Nahrál/a jsem ti oficiální prezentace a materiály pro odbornou přípravu zásahové jednotky JPO (konkrétně oblast X - doplňte). Tvým úkolem je na základě těchto textů vytvořit sérii kvalitních a praktických testových otázek. Ke každé otázce vymysli 4 možnosti odpovědi (kdy právě jedna je správná) a stručné metodické vysvětlení, proč je to správně.
> 
> Výsledek mi vygeneruj POUZE jako čistý a validní JSON formát pole podle tohoto vzoru (nevypisuj nic jiného než json):
> ```json
> [
>     {
>         "kategorie": "zde_dopln_kategorii",
>         "otazka": "Jaká je maximální povolená vzdálenost...?",
>         "moznosti": ["10 metrů", "15 metrů", "20 metrů", "25 metrů"],
>         "spravnaOdpoved": 1,
>         "vysvetleni": "Podle předpisu je maximální vzdálenost 15 metrů, protože..."
>     }
> ]
> ```
> *Poznámka: Do položky 'kategorie' vlož u všech otázek vždy stejné, jednoslovné označení (např. "organizace", "zdravi", "predlekarska", "prevence", "taktika", "technika"). Hodnota 'spravnaOdpoved' se povinně indexuje od nuly (0 = první možnost, 1 = druhá možnost, 2 = třetí atd.). Dbej na to, aby nesprávné odpovědi zněly chytákově a maximálně uvěřitelně pro reálnou hasičskou praxi.*

---

> [!WARNING]
> **VELKÉ PŘIPOMENUTÍ PRO NÁŠ DALŠÍ START:**
> Zatímco odhlášení nám už z nového zlatého menu funguje, **tlačítko "Nastavení účtu" je dosud nedokončené** (zatím jen vyskakuje hláška). Jakmile spustíme Antigravity příště, toto bude jeden z našich úplně prvních úkolů!

## 3. Na co navážeme příště podle plánu
Až se k projektu vrátíte, stačí mi napsat zprávu. Systém Antigravity má naši konverzaci v paměti a navíc jsme si už schválili architekturu dalšího postupu:

1. **Implementace Kvízu:** Nastavíme databázi u nás na serveru a načteme do ní tyto vámi vygenerované JSON otázky.
2. **Nastavení účtu:** (Viz připomenutí výše) - Vytvoříme modal/stránku pro změnu hesla a tabulku k zobrazení absolvovaných testů.
3. **Dokončíme aplikaci** a oživíme algoritmus pro "rozložené opakování", o kterém jsme psali kapitolu do bakalářky.

Mějte se skvěle a ať se generování otázek daří!
