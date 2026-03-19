# Návod a Prompt pro generování otázek z velkých textů (PDF, Skripta)

Tento dokument obsahuje postup a přesný prompt, který můžeš zkopírovat do libovolné moderní umělé inteligence (doporučeno Google AI Studio, Claude 3.5 Sonnet nebo ChatGPT 4o), abys zabránil chybám, ořezávání textu a vymýšlení vlastních kategorií. Místo toho, aby AI hádala kategorii, přímo jí ukážeš, jakou kategorii právě zpracováváte.

## Nástroje vhodné pro generování
*   **Google AI Studio (Gemini 1.5 Pro):** Ideální pro obrovská kvanta textů, pojme stovky stránek PDF a "nezapomíná" kontext.
*   **Claude (od Anthropic):** Vynikající pro přesné dodržování předepsaného formátu JSON a tvorbu srozumitelných vysvětlivek.
*   **ChatGPT (OpenAI):** Výborné na detailní logické vyvozování otázek.

## Jak postupovat krok za krokem
1.  Otevři vybraný nástroj a nahraj jeden nebo více zdrojových dokumentů (např. skripta pro *Zdravovědu* a *Techniku*).
2.  Zkopíruj vybraný **Základní Prompt** podle toho, zda zpracováváš jeden dokument, nebo více dokumentů najednou.
3.  Než ho odešleš, pro jeden dokument **přepiš v něm tučně vyznačené "NAZEV_TVE_KATEGORIE" na reálný název**. U promptu pro více dokumentů AI nastaví kategorii sama podle souboru.
4.  Zkontroluj vygenerovanou várku. Pokud je 100% správná, zkopíruj ji na konec souboru `otazky.json`.
5.  Pokud potřebuješ další otázky, použij **Pokračovací Prompt** (níže).

---

## 1. Základní Prompt - PRO JEDEN ZDROJ
Tento prompt použij, pokud nahráváš pouze jeden soubor nebo text pro jednu konkrétní kategorii.

```text
Jsi absolutní expert na požární ochranu a tvorbu e-learningových testů pro jednotky sboru dobrovolných hasičů. 
Tvým úkolem je na základě mnou přiložených (nebo níže zkopírovaných) učebních textů generovat testové otázky.

ZÁSADNÍ PRAVIDLA PRO FORMÁTOVÁNÍ A VÝSTUP:
1. Tvůj výstup musí být POUZE jeden čistý a validní JSON (pole objektů začínající '[' a končící ']'). Nepiš na začátku ani na konci naprosto žádný jiný text (ani "Zde jsou otázky:").
2. Každá vygenerovaná otázka musí v JSONu dodržet striktně tuto strukturu objektu:
{
  "kategorie": "NAZEV_TVE_KATEGORIE",
  "otazka": "Znění otázky?",
  "moznosti": [
    "Možnost 1",
    "Možnost 2",
    "Možnost 3",
    "Možnost 4"
  ],
  "spravnaOdpoved": 0, 
  "vysvetleni": "Podrobné a edukativní vysvětlení, proč je toto konkrétně správně a srozumitelné ponaučení."
}
3. U klíče "kategorie" NIC NEMĚŇ. Ve všech vygenerovaných objektech použij u každé otázky přesně hodnotu "NAZEV_TVE_KATEGORIE". Dávám ti texty právě jen k tomuto okruhu.
4. Klíč "spravnaOdpoved" musí být POUZE číselný index s reálnou definicí (0 pro první možnost, 1 pro druhou, 2 pro třetí, 3 pro čtvrtou možností, vždy musí být přesně 4 možnosti odpovědi).
5. V textu možností ani u otázek nepoužívej žádné markdownové tučné písmo jako `**slovo**`. 

ÚKOL:
Přečti si nahraný text a vygeneruj prvních 20 čistých a odborných otázek, u kterých se absolutně držíš stanovených pravidel a přesného formátu včetně jména kategorie.
```

## 2. Základní Prompt - PRO VÍCE ZDROJŮ (S JEDNOTNOU KATEGORIÍ)
Tento prompt použij, když nahraješ více PDF/souborů najednou, ale všechny spadají do jedné stejné kategorie (např. 3 různá skripta, ale všechno je to "zdravoveda"). Chceš, aby AI přečetla všechny tyto soubory a vybrala z nich ty nejdůležitější věci.

```text
Jsi absolutní expert na požární ochranu a tvorbu e-learningových testů pro jednotky sboru dobrovolných hasičů. 
Nahrál jsem ti do přílohy několik různých učebních dokumentů a skript, které ale všechny spadají do jedné kategorie. 

ZÁSADNÍ PRAVIDLA PRO FORMÁTOVÁNÍ A VÝSTUP:
1. Tvůj výstup musí být POUZE jeden čistý a validní JSON (pole objektů začínající '[' a končící ']'). Všechny otázky ze všech dokumentů musí být dohromady v jednom JSON poli. Nepiš na začátku ani na konci žádný jiný text.
2. Každá vygenerovaná otázka musí v JSONu dodržet striktně tuto strukturu:
{
  "kategorie": "NAZEV_TVE_KATEGORIE",
  "otazka": "Znění otázky?",
  "moznosti": [
    "Možnost 1",
    "Možnost 2",
    "Možnost 3",
    "Možnost 4"
  ],
  "spravnaOdpoved": 0, 
  "vysvetleni": "Podrobné a edukativní vysvětlení, proč je toto konkrétně správně a srozumitelné ponaučení."
}
3. U klíče "kategorie" NIC NEMĚŇ. U všech vygenerovaných otázek absolutně ze všech souborů použij přesně zadanou hodnotu "NAZEV_TVE_KATEGORIE".
4. Klíč "spravnaOdpoved" musí být POUZE číselný index (0 pro první možnost, ..., 3 pro čtvrtou). Vždy přesně 4 možnosti.
5. V textech nepoužívej žádné markdownové tučné písmo.

ÚKOL:
1. Zaměř se v textech na to nejdůležitější a z praxe nejpodstatnější pro dobrovolné hasiče (klíčové parametry, zásady bezpečnosti, hlavní postupy atd.).
2. Systémově a postupně projdi všechny nahrané soubory a vygeneruj z každého z nich přesně 10 testových otázek.
3. Všechny tyto otázky spoj do jednoho velkého plně validního JSON pole o velikosti (počet souborů × 10).
```

## 3. Pokračovací Prompt (Vytažení dalších dat ze všech nahraných zdrojů)
Jakmile obdržíš první JSON a potřebuješ z těch stejných souborů "vyždímat" další várku nových otázek:

```text
Výborně, JSON formát je naprosto v pořádku. 
Prosím, analyzuj všechny mnou nahrané texty ještě hlouběji. Najdi v nich odstavce, detaily a kapitoly, ze kterých jsi mi ještě netvořil žádné otázky. Podle naprosto stejných tvrdých pravidel mi z každého přiloženého souboru vygeneruj DALŠÍCH 10 (zcela nových a v žádném případě se neopakujících) otázek. Výstupem musí být opět pouze jeden jediný čistý formát JSON bez "omáčky" a vysvětlování okolo.
```
