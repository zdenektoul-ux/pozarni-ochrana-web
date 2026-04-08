# Abstrakt a klíčová slova

## Abstrakt (CZ)
Tato závěrečná práce se zabývá návrhem a vývojem webové aplikace určené pro testování a upevňování odborných znalostí členů jednotky sboru dobrovolných hasičů (JSDH) Borotín. Hlavním cílem bylo nahradit zastaralý systém papírových testů moderním digitálním řešením, které využívá adaptivní algoritmy učení. Teoretická část práce analyzuje metody didaktického testování, položkovou analýzu a principy kognitivní psychologie, konkrétně metodu rozloženého opakování (*Spaced Repetition*) a mikroučení (*Microlearning*). V praktické části je popsána technická implementace aplikace v prostředí Node.js a SQLite s důrazem na bezpečnost, UX/UI design a efektivní správu dat. Výsledkem je funkční webový portál s automatizovaným hodnocením, analytikou pro administrátory a gamifikačními prvky, které zvyšují motivaci uživatelů. Aplikace umožňuje členům sboru efektivní přípravu na odborné zkoušky a zajišťuje dlouhodobé udržení znalostí v oblasti požární ochrany.

**Klíčová slova:** JSDH Borotín, e-learning, požární ochrana, rozložené opakování, testovací aplikace, didaktický test, mikroučení, položková analýza.

---

## Abstract (EN)
This final thesis focuses on the design and development of a web application for testing and reinforcing the professional knowledge of members of the Volunteer Fire Department (VFD) in Borotín. The primary objective was to replace the outdated paper-based testing system with a modern digital solution utilizing adaptive learning algorithms. The theoretical part of the thesis analyzes methods of didactic testing, item analysis, and principles of cognitive psychology, specifically Spaced Repetition and Microlearning. The practical part describes the technical implementation of the application using Node.js and SQLite, with an emphasis on security, UX/UI design, and efficient data management. The outcome is a functional web portal featuring automated evaluation, administrative analytics, and gamification elements designed to enhance user motivation. The application enables department members to prepare efficiently for professional examinations and ensures long-term retention of knowledge in the field of fire protection.

**Keywords:** Volunteer Fire Department, e-learning, fire protection, Spaced Repetition, testing application, didactic test, microlearning, item analysis.

# 1 Úvod a cíl práce

## 1.1 Úvod

Požární ochrana je v České republice ukotvena zákonem č. 133/1985 Sb., o požární ochraně, ve znění pozdějších předpisů. Tento zákon mimo jiné vymezuje úkoly jednotek požární ochrany. Zásadním pilířem plošného pokrytí území jsou v našem systému jednotky sborů dobrovolných hasičů obcí (dále jen „JSDH"). Jejich fungování a podmínky odborné přípravy podrobně upravuje vyhláška Ministerstva vnitra č. 247/2001 Sb., o organizaci a činnosti jednotek požární ochrany.

Být členem výjezdové jednotky dobrovolných hasičů vyžaduje nejen fyzickou zdatnost a pohotovost, ale klade také značné nároky na odborné znalosti. Předpokladem pro zařazení do výjezdů je povinnost absolvovat základní odbornou přípravu (ZOP) a následně se průběžně vzdělávat. Oficiální vzdělávání zajišťují např. Ústřední hasičské školy SH ČMS (Sdružení hasičů Čech, Moravy a Slezska, 2026), případně jsou školení pořádána přímo v gesci místně příslušných složek Hasičského záchranného sboru ČR (zákon č. 320/2015 Sb.). Většina těchto kurzů je navíc primárně určena pro velitele a strojníky k získání jejich odborné způsobilosti. Přihlášení zbylých řadových členů zásahové jednotky do těchto oficiálních vzdělávacích programů je v běžné praxi časově i organizačně velmi obtížné. Finanční náročnost takových školení je navíc značná. Současná cena 40hodinového kurzu pro jednoho člena je 7 700 Kč (Ústřední hasičská škola Bílé Poličany, 2026), což při proškolení celé jednotky může představovat ekonomickou zátěž v řádu desítek tisíc korun.

Tíha základní teoretické přípravy a průběžného opakování tak často plně leží na bedrech velitele místní jednotky. Autor této práce byl v roce 2026 zvolen velitelem sboru a zároveň se brzy oficiálně stane velitelem zásahové jednotky SDH Borotín. Z této pozice vyplývá nutnost zajistit odpovídající úroveň znalostí a připravenosti všech členů JSDH.

Přestože existuje celá řada kvalitních oficiálních studijních materiálů HZS ČR, efektivní teoretická příprava dobrovolných hasičů naráží na své limity. Praxe předávání znalostí členům obvykle probíhá nárazově formou prezenčních přednášek, které jsou zakončené oficiálním elektronickým testem bez další datové návaznosti. Udržet u jednotky po absolvování takového kurzu dlouhodobě teoretické vědomosti a aktivně s ní probírat a oživovat učivo bývá velmi složité. Velitel pak obvykle nemá po takovém jednorázovém testování k dispozici data, která by mu ukázala, ve kterých tematických okruzích hasiči nejvíce chybují. Nástup moderních digitálních technologií otevírá cestu k novým nástrojům, které mohou tento informační a analytický deficit vyřešit.

## 1.2 Cíl práce

Cílem této závěrečné práce je návrh a vytvoření vlastní testovací aplikace pro potřeby jednotky sboru dobrovolných hasičů Borotín. Aplikace má nahradit tradiční jednorázové zkoušení moderním webovým nástrojem, který bude pro členy sboru obslužně nenáročný a usnadní jim pravidelné a efektivní udržování znalostí.

Pro dosažení hlavního cíle byly zformulovány následující dílčí úkoly:
1. Zpracování rešerše: Prozkoumat současné oficiální i neoficiální webové platformy pro testování hasičů a zhodnotit jejich silné a slabé stránky ve vztahu k potřebám JSDH.
2. Analýza aspektů testování: Vyhodnotit technologické i obsahové požadavky na nový systém zohledňující principy mikroučení (microlearningu), s cílem vytvořit platformu, která dokáže členy jednotky testovat adaptivně přímo na míru jejich dosavadním znalostem.
3. Návrh a implementace aplikace: Využít poznatky z rešerše k návrhu a naprogramování prototypu webové aplikace.
4. Zhodnocení výsledků: Posoudit dosažené řešení a vymezit konkrétní možnosti dalšího využití aplikace.

# 2 Rešerše

Nezbytným krokem před návrhem vlastní aplikace bylo provedení rešerše stávajících platforem a e-learningových systémů určených pro teoretickou přípravu hasičů. Cílem bylo zhodnotit funkčnost dostupných řešení, jejich metodickou otevřenost a technologickou vhodnost pro potřeby pravidelného školení členů dobrovolné jednotky.

## 2.1 Oficiální informační portály
Základním zdrojem studijních materiálů pro členy jednotek požární ochrany je vzdělávací portál hasici-vzdelavani.cz, provozovaný Hasičským záchranným sborem ČR (MV – GŘ HZS ČR, 2026). Tento portál shromažďuje dokumenty, prezentace a doporučené metodické materiály pro teoretickou přípravu hasičů. Pro studijní účely je nepostradatelný, avšak neslouží k ověřování vědomostí. Forma obsahu je statická a archivační – portál nenabízí testování, nedisponuje analytikou průchodu učivem a práce s rozsáhlými PDF dokumenty na mobilním zařízení je nepraktická.

Podobným způsobem fungují webové stránky České asociace hasičských důstojníků cahd.cz, které nabízejí ucelený souhrn metodických předpisů (Česká asociace hasičských důstojníků, 2026). Jedná se však primárně o plná znění Bojových řádů a dalších konsolidovaných předpisů. Rozsah i odborná hloubka těchto dokumentů jsou pro běžného řadového člena dobrovolné jednotky příliš detailní. Pro účely pravidelného školení v JSDH obce je potřeba tento objem znalostí zúžit na nejpodstatnější témata a zpřístupnit je ve srozumitelnější a stručnější podobě.

## 2.2 Portál hasici-elearning.cz
E-learningový portál hasici-elearning.cz provozuje Střední odborná škola požární ochrany a Vyšší odborná škola požární ochrany (SOŠ PO a VOŠ PO) ve Frýdku-Místku, která je organizační součástí HZS ČR (SOŠ PO a VOŠ PO, 2026). Portál nabízí videokurzy a online ověřovací testy určené pro získávání oficiální kvalifikace. Z hlediska potřeb průběžného školení dobrovolné jednotky má však dva podstatné limity.

Prvním je omezená dostupnost. Přístup do systému je členu jednotky zpravidla zřízen až v okamžiku, kdy je zařazen do oficiálního vzdělávacího cyklu. Druhým limitem je samotný účel testování. Systém je koncipován jako nástroj pro ověření splnění kurzu a vydání certifikace. Po úspěšném absolvování testu již není možné se k otázkám vracet a průběžně s nimi pracovat. Testy tak plní funkci formálního hodnocení, nikoliv nástroje pro dlouhodobé procvičování a opakování učiva.

## 2.3 Vzdělávací portál SH ČMS
Sdružení hasičů Čech, Moravy a Slezska dlouhodobě modernizuje a rozvíjí vzdělávání dobrovolných hasičů napříč republikou (Sdružení hasičů Čech, Moravy a Slezska, 2026). Pro tyto účely provozuje také vlastní e-learningový portál na adrese vzdelavani.dh.cz (Sdružení hasičů Čech, Moravy a Slezska, 2026). Po technologické stránce je tento portál postaven na systému Moodle, který patří mezi celosvětově nejrozšířenější systems pro řízení výuky (Moodle, 2026).

Moodle je robustní a prověřená platforma používaná především na vysokých školách a ve firemním vzdělávání. Pro potřeby pravidelného testování členů dobrovolné jednotky však představuje řešení s řadou kompromisů. Prostředí systému je navrženo pro komplexní správu kurzů a jeho uživatelské rozhraní je pro účely jednoduchého a rychlého testování z mobilního telefonu nepřehledné. Množství navigačních prvků, panelů a vnořených struktur kurzu snižuje přístupnost pro uživatelů, kteří potřebují pouze rychlý přístup k testovým otázkám.

## 2.4 Obecné testovací a e-learningové platformy
Kromě specializovaných hasičských systémů existuje řada obecných platforem pro tvorbu a distribuci testů a kvízů. Mezi nejznámější patří Kahoot! (Kahoot!, 2026), Quizlet (Quizlet, 2026) nebo možnost tvorby formulářových testů prostřednictvím služby Google Forms (Google, 2026).

Platforma Kahoot! je primárně navržena pro skupinové kvízy v reálném čase. Ačkoliv nabízí i asynchronní režim (Kahoot!, 2026), jeho bezplatná verze je omezena počtem účastníků a časovou platností sdíleného odkazu. Herní mechanika založená na rychlosti odpovědi je navíc méně vhodná pro systematické procvičování odborných znalostí.

Quizlet nabízí intuitivní prostředí pro tvorbu kartičkových sad a individuální studium. Platforma v placené verzi pro pedagogy umožňuje základní sledování pokroku členů skupiny. Pro potřeby JSDH je však tento systém nepraktický z hlediska správy uživatelů a nákladovosti předplatného.

Google Forms umožňuje vytvářet jednoduché testové formuláře bez nutnosti programování. Pro jednorázové ověření znalostí je tento nástroj postačující, avšak postrádá jakoukoli logiku opakovaného testování, evidenci historie odpovědí a cílený výběr otázek na základě předchozích výsledků.

## 2.5 Vlastní řešení jednotlivých sborů
Na úrovni jednotlivých sborů dobrovolných hasičů nebo okrsků lze v praxi nalézt také vlastní webové stránky, které svým členům nabízejí studijní materiály nebo jednoduché testy. Příkladem takového řešení jsou webové stránky SDH Darkovice sdh-darkovice.cz, které obsahují sekci s online testy zaměřenými na topografické značky, grafické značky požární techniky, zákon o požární ochraně nebo taktiku zásahu (SDH Darkovice, 2026). Tyto weby vznikají z iniciativy konkrétních velitelů či aktivních členů a poskytují obsah přizpůsobený místním podmínkám.

Tato řešení mohou v některých případech nabízet i základní evidenci výsledků, například formou veřejného žebříčku s počtem správných odpovědí a dosaženým časem. Chybí v nich však zpravidla systematický pedagogický přístup – cílený výběr otázek na základě předchozích odpovědí uživatele, analytický přehled o průběhu testování pro velitele nebo průběžné opakování nezvládnutého učiva.

## 2.6 Shrnutí rešeršních zjištění
Z provedeného přehledu vyplývá, že současná nabídka vzdělávacích systémů pro hasiče funguje spolehlivě v oblasti svého primárního zaměření – zajištění kvalifikace, archivace předpisů a řízení formálního vzdělávání. Pro potřeby pravidelného a systematického školení členů konkrétní dobrovolné jednotky však dostupná řešení nevyhovují. Hlavní identifikované nedostatky lze shrnout následovně:
- obsahová složitost a odborná hloubka přesahující potřeby řadových členů JSDH,
- uzavřenost systémů a nemožnost průběžného opakovaného procvičování,
- absence individuální evidence výsledků a analytických dat pro velitele jednotky.

# 3 Analýza požadavků

Jelikož žádná z běžně dostupných platforem plně nevyhovuje potřebám pravidelného školení členů JSDH Borotín, jeví se jako nejvhodnější cesta vývoj vlastní webové aplikace. Tato kapitola shrnuje klíčové požadavky, které z provedené rešerše a z potřeb cílové skupiny vyplývají.

## 3.1 Obsahové požadavky
Aplikace musí pokrývat tematické okruhy odpovídající rozsahu základní odborné přípravy členů jednotek SDH obcí. Východiskem pro stanovení obsahu je přehled oblastí školení zveřejněný na vzdělávacím portálu HZS ČR (MV – GŘ HZS ČR, 2026), který definuje šest hlavních tematických oblastí: organizace požární ochrany, ochrana zdraví a života hasiče, předlékařská pomoc, požární prevence, požární taktika a technický výcvik. Otázky musí být formulovány srozumitelně a jednoznačně, s jednou správnou odpovědí ze čtyř nabízených variant, což odpovídá doporučenému formátu testových položek s výběrem odpovědí (Jeřábek a Bílek, 2010).

## 3.2 Požadavky na způsob testování
Aplikace musí umožňovat krátké testovací bloky v duchu mikroučení, aby členové jednotky mohli procvičovat kdykoliv bez nutnosti vyhradit si delší časový úsek (Brown, Roediger III a McDaniel, 2017). Výběr otázek musí být adaptivní – otázky, u nichž uživatel opakovaně chybuje, mu mají být předkládány s vyšší frekvencí, a to na základě principu rozloženého opakování (Wozniak, 1990). Konkrétní realizace obou přístupů je popsána v kapitole 5 (Implementace).

## 3.3 Sběr statistických údajů
Aplikace musí zaznamenávat průběh testování a poskytovat administrátorovi přehled o kvalitě testové sady i o úrovni znalostí členů sboru. Tento požadavek vychází z metodiky kvantitativního vyhodnocování didaktických testů (Chráska, 2016; Jeřábek a Bílek, 2010). Způsob výpočtu sledovaných ukazatelů a jejich interpretace jsou popsány v kapitole 5 (Implementace).

# 4 Návrh aplikace

Aplikace je navržena jako jednoduchý a snadno přístupný nástroj pro průběžné procvičování teoretických znalostí členů JSDH Borotín. Tato kapitola popisuje navržené řešení po stránce architektury, uživatelského rozhraní, zabezpečení a datového modelu.

## 4.1 Architektura a technologický stack
Aplikace je navržena jako webová aplikace s klient-server architekturou. Uživatel přistupuje k aplikaci prostřednictvím webového prohlížeče, veškerá logika testování a správy dat je zajištěna na straně serveru.

Pro serverovou část byl zvolen běhový prostředek Node.js s webovým frameworkem Express.js. Volba vychází z požadavku na jednoduchost nasazení a minimální nároky na infrastrukturu. Node.js umožňuje provozovat celou aplikaci jako jeden proces bez nutnosti konfigurace externích služeb. Současně umožňuje využít jednotný programovací jazyk JavaScript na straně serveru i klienta, což zjednodušuje údržbu kódu.

Pro ukládání dat je použita souborová databáze SQLite. Ta nevyžaduje instalaci databázového serveru a umožňuje snadný přenos celé aplikace včetně dat. Pro potřeby malé jednotky s desítkami uživatelů je tento typ databáze plně dostačující.

Klientská část aplikace je tvořena statickými soubory HTML, CSS a JavaScript bez použití externího frameworku. Tento přístup zajišťuje rychlé načítání stránek a minimální závislost na knihovnách třetích stran.

## 4.2 Uživatelské role a správa přístupu
Systém rozlišuje dvě uživatelské role: člen a administrátor.

Člen se po registraci a přihlášení dostává na hlavní obrazovku s přehledem tematických kategorií. Může spouštět testy, prohlížet svou historii výsledků a sledovat svůj postup v jednotlivých kategoriích.

Administrátor má kromě funkcí běžného člena přístup k sekci správy. Ta zahrnuje přehled registrovaných uživatelů s možností jejich odebrání, souhrnnou statistiku testových otázek s indexem obtížnosti, správu registračního kódu a možnost změny rolí ostatních uživatelů.

## 4.3 Návrh uživatelského rozhraní
Uživatelské rozhraní je navrženo s důrazem na jednoduchost ovládání a responzivitu. Při návrhu byly uplatněny zásady použitelnosti webu, jak je popisují Krug (2014), Nielsen (2000) a Řezáč (2016), tedy minimalizace počtu rozhodnutí, která musí uživatel učinit, přehledná navigace a jednoznačné ovládací prvky. Vizuální identita aplikace vychází z barevnosti webových stránek SDH Borotín (Komínek, 2026) a barev praporu sboru, čímž je posílena sounáležitost uživatelů s jednotkou.

Hlavní obrazovka zobrazuje tematické kategorie formou dlaždic, přičemž každá dlaždice vizuálně indikuje postup uživatele v dané kategorii. Po výběru kategorie jsou uživateli předloženy otázky s výběrem jedné správné odpovědi ze čtyř variant. Po dokončení celého testu zobrazí systém souhrnné vyhodnocení. Uživatel vidí, které otázky zodpověděl správně a které chybně. U chybně zodpovězených otázek je zobrazena správná odpověď společně s textovým vysvětlením, které uživateli pomáhá pochopit správné řešení. Součástí vyhodnocení testu je motivační zpětná vazba, která uživateli slovně a vizuálně hodnotí dosažený výsledek.

Rozhraní je responzivní a přizpůsobené pro použití na mobilních zařízeních. Členové jednotky tak mohou procvičovat z telefonu kdykoliv, bez nutnosti přístupu k počítači.

## 4.4 Zabezpečení
Aplikace implementuje bezpečnostní opatření odpovídající povaze zpracovávaných dat: hashování hesel algoritmem bcrypt, správu přihlášení pomocí serverových sessions, registraci chráněnou kódem nastaveným administrátorem, obnovu zapomenutého hesla prostřednictvím jednorázového e-mailového tokenu a možnost změny hesla přihlášeným uživatelem. Přístup k administrátorským funkcím je na úrovni API chráněn kontrolou role. Technické detaily jednotlivých opatření jsou popsány v kapitole 5 (Implementace).

## 4.5 Datový model
Datový model aplikace tvoří čtyři hlavní tabulky: *uzivatele* (přihlašovací a kontaktní údaje), *vysledky* (souhrn dokončených testů), *odpovedi_uzivatelu* (detail jednotlivých odpovědí pro adaptivní výběr otázek) a *nastaveni* (konfigurační údaje aplikace). Testové otázky jsou uloženy ve strukturovaném souboru ve formátu JSON. Podrobný popis struktury a vazeb je uveden v kapitole 5 (Implementace).

# 5 Implementace

Tato kapitola popisuje technickou realizaci aplikace. Navazuje na požadavky definované v kapitole 3 (Analýza požadavků) a na návrhová rozhodnutí z kapitoly 4 (Návrh aplikace) a podrobně vysvětluje, jakým způsobem jsou jednotlivé funkce implementovány.

## 5.1 Příprava testového obsahu

### 5.1.1 Rozsah prototypu

Východiskem pro tvorbu testových otázek jsou oficiální prezentace zveřejněné na vzdělávacím portálu HZS ČR (MV – GŘ HZS ČR, 2026). Na portálu je k dispozici přibližně 90 zdrojových dokumentů ve formátu PDF, které pokrývají šest tematických oblastí stanovených pro základní odbornou přípravu (viz kapitola 3, oddíl 3.1).

V aktuální verzi prototypu jsou zpracovány dva ze šesti tematických okruhů – organizace požární ochrany (65 otázek) a požární taktika (85 otázek), celkem 150 testových otázek. Zbývající čtyři okruhy jsou v aplikaci připraveny, obsah pro ně však dosud nebyl vytvořen. Důvodem je značná časová náročnost přípravy kvalitního testového obsahu – kompletní zpracování všech šesti oblastí vyžaduje důkladnou práci se všemi zdrojovými dokumenty portálu. Dva zpracované okruhy postačují k plnohodnotnému ověření funkčnosti aplikace včetně adaptivního algoritmu, statistických přehledů a uživatelského rozhraní.

Kromě volby konkrétního okruhu nabízí aplikace rovněž režim mix, ve kterém se otázky vybírají ze všech zpracovaných okruhů dohromady. Tento režim umožňuje průřezové procvičování bez omezení na jednu tematickou oblast.

### 5.1.2 Struktura testových otázek

Při tvorbě otázek byly dodržovány zásady tvorby didaktických testů, jak je uvádějí Jeřábek a Bílek (2010): úlohy jsou na sobě nezávislé, distraktory jsou formulovány tak, aby byly stejně přijatelné a nelišily se od správné odpovědi délkou ani stylem, a znění otázky je stručné a jednoznačné. Ke každé otázce je připojeno textové vysvětlení správné odpovědi, které uživateli slouží jako bezprostřední zpětná vazba.

Otázky jsou uloženy ve strukturovaném souboru ve formátu JSON. Každý záznam obsahuje jedinečný identifikátor, text otázky, pole čtyř variant odpovědí, index správné odpovědi, kategorii a text vysvětlení. Tento formát umožňuje snadnou rozšiřitelnost testové sady bez zásahu do databáze nebo zdrojového kódu aplikace.

### 5.1.3 Tvorba obsahu s využitím umělé inteligence

Testové otázky byly generovány s využitím nástrojů umělé inteligence – konkrétně služeb Google NotebookLM (Google, 2026) a Google AI Studio s modelem Gemini (Google DeepMind, 2026). Vstupem pro generování byly plné texty oficiálních prezentací z portálu HZS ČR. Vygenerované otázky byly následně ručně revidovány autorem práce. Při revizi prvního okruhu (Organizace požární ochrany, 65 otázek) byla identifikována jedna otázka, u níž dvě varianty odpovědí obsahovaly totožnou informaci v odlišném pořadí, čímž nabízely dvě fakticky správné odpovědi. Ostatní otázky odpovídaly obsahu zdrojových materiálů. Pro produkční nasazení je nezbytná kompletní ruční revize všech otázek ve všech okruzích.

## 5.2 Realizace mikroučení

Princip mikroučení (microlearningu) spočívá v rozdělení učiva do krátkých, samostatných bloků, které uživatel zpracuje v řádu minut. Tento přístup odpovídá poznatkům o efektivním učení, podle nichž je krátkodobá práce s učivem účinnější než dlouhé studijní bloky (Brown, Roediger III a McDaniel, 2017), což koresponduje i s limity lidské pozornosti a pracovní paměti zkoumanými kognitivní psychologií (Sternberg, 2009).

V aplikaci je tento princip realizován tak, že každý test obsahuje právě deset otázek. Absolvování jednoho testu trvá přibližně tři až pět minut. Členové jednotky tak mohou procvičovat kdykoli v průběhu dne, bez nutnosti vyhradit si delší časový úsek. Aby měl uživatel přehled o svém celkovém postupu, zobrazuje hlavní obrazovka u každé tematické kategorie vizuální indikátor pokroku vyjádřený poměrem zodpovězených otázek k celkovému počtu otázek v dané kategorii.

## 5.3 Adaptivní výběr otázek

Klíčovou funkcí aplikace je adaptivní výběr otázek, který vychází z principu rozloženého opakování (spaced repetition). Podstatou tohoto přístupu je, že otázky, na které uživatel odpověděl chybně, se mu předkládají s vyšší frekvencí než otázky, které již zvládá (Wozniak, 1990). Systém tak přirozeně směřuje pozornost uživatele k jeho slabým místům a efektivněji upevňuje znalosti.

### 5.3.1 Klasifikace otázek

Na základě historie odpovědí daného uživatele je každá otázka v rámci zvolené kategorie zařazena do jedné ze čtyř skupin:

- **Nové** – otázky, na které uživatel dosud nikdy neodpovídal.
- **Kritické** – otázky, na které uživatel naposledy odpověděl chybně. Tyto otázky vyžadují okamžité zopakování.
- **Upevňující** – otázky, na které uživatel odpověděl správně, ale jeho série nepřerušených správných odpovědí je kratší než tři. Znalost ještě není plně upevněna.
- **Zvládnuté** – otázky s nepřerušenou sérií alespoň tří po sobě jdoucích správných odpovědí. Tyto otázky jsou považovány za fixované v paměti a předkládány nejméně často.

### 5.3.2 Dvoufázový adaptivní výběr

Adaptivní výběr otázek probíhá ve dvou fázích. V počáteční fázi průzkumu, dokud uživatel v dané kategorii neodpověděl alespoň na 15 % otázek, algoritmus upřednostňuje nové otázky v poměru 7 : 2 : 1 (nové : kritické : upevňující). Cílem je nejprve uživatele seznámit s šíří učiva. Tento přístup odpovídá principu, který Wozniak (1990) ve svém algoritmu SM-2 odděluje jako fázi prvního přezkoušení od fáze systematického opakování.

Zvolená hranice 15 % představuje kompromis mezi Wozniakem (1990) empiricky stanovenou optimální mírou zapomínání 20–30 % a praktickými implementacemi rozloženého opakování, které pracují s doporučenou hodnotou kolem 10 %. Wozniak (1990) ve své práci upozorňuje, že příliš vysoká míra zapomínání vede k frustraci z opakovaného selhání při vybavování a snižuje motivaci uživatele k dalšímu učení. Hodnota 15 % je proto volena tak, aby uživatel získal dostatečný přehled o šíři učiva, aniž by byl nadměrně demotivován neúspěšným vybavováním.

Po dosažení prahu 15 % pokrytí se algoritmus přepne do fáze adaptivního opakování. Test o deseti otázkách je sestaven podle pevných vah, které odrážejí priority adaptivního učení:

| Skupina | Počet otázek | Priorita |
|---|---|---|
| Kritické | až 4 | nejvyšší |
| Nové | až 3 | vysoká |
| Upevňující | až 2 | střední |
| Zvládnuté | až 1 | nejnižší |

Poměr 4 : 3 : 2 : 1 zajišťuje, že uživatel je vždy konfrontován především s otázkami, které mu činí obtíže, přičemž je do testu zařazen i nový obsah a občasné zopakování již zvládnutého učiva. Pokud v některé skupině není dostatek otázek k naplnění kvóty, doplní se test otázkami ze zbývajících skupin.

### 5.3.3 Náhodné řazení otázek a odpovědí

Aby uživatel nemohl odpovědi odhadovat na základě pozice správné varianty, jsou u každé otázky varianty odpovědí před zobrazením náhodně přeuspořádány algoritmem Fisher-Yates shuffle (Wozniak a Gorzelańczyk, 1994). Stejným způsobem je zamícháno i pořadí otázek v rámci testu.

## 5.4 Vyhodnocení testu a motivační zpětná vazba

Po zodpovězení poslední otázky zobrazí aplikace souhrnné vyhodnocení testu. Uživatel vidí dosažené skóre vyjádřené v procentech i absolutním poměrem správných odpovědí, celkový čas a přehled chybně zodpovězených otázek. U každé chybné odpovědi je zobrazena správná varianta společně s textovým vysvětlením. Zobrazení správné odpovědi s textovým vysvětlením realizuje princip korekční zpětné vazby, která je podle Browna, Roedigera III a McDaniela (2017) klíčovým faktorem efektivního učení prostřednictvím testování.

Uživatel má rovněž možnost otázku přeskočit bez výběru odpovědi. Přeskočená otázka je statisticky vyhodnocena jako chybná – je zahrnuta do výpočtu indexu obtížnosti a v adaptivním algoritmu je zařazena mezi kritické otázky, které se uživateli vrátí s nejvyšší prioritou. Ve výsledkovém přehledu je přeskočená otázka zobrazena se správnou odpovědí a vysvětlením, čímž je zachována učební hodnota i v případě, kdy uživatel na otázku neodpověděl.

Součástí vyhodnocení je motivační zpětná vazba založená na gamifikačních prvcích. Na základě dosaženého skóre systém zobrazí vizuální symbol a hodnotící text:

| Skóre | Zpětná vazba |
|---|---|
| 100 % | 🏆 „Excelentní výkon! Jste mistr oboru." |
| 80–99 % | 🥇 „Skvělá práce! Velmi solidní znalosti." |
| 60–79 % | 🥈 „Dobrá práce! Dobrý základ, ale je co pilovat." |
| 40–59 % | 🥉 „Slušná snaha, pro ostrou akci to ale chce více praxe." |
| pod 40 % | 🚒 „Tohle se nepovedlo. Doporučujeme důkladně projít studijní materiály!" |

Cílem tohoto prvku je udržet motivaci uživatele k opakovanému procvičování. Okamžité vizuální hodnocení dává členu jednotky jasnou zpětnou vazbu o jeho aktuální připravenosti.

Z hlediska ergonomie a kognitivní zátěže uživatele byla obrazovka výsledků optimalizována tak, aby zobrazovala pouze historii posledních třech absolvovaných testů formou statických informačních panelů. Tím se předchází informačnímu zahlcení a falešné afordanci (pocitu, že na starou historii lze kliknout). Celkové uživatelské rozhraní aplikace současně ctí striktní barevnou logiku: primární zlaté a modré barvy posouvají děj vpřed, zelená obrysová barva slouží jako bezpečný krok zpět do úvodu či menu, a červená barva bezpečně indikuje nevratnou, destruktivní akci, opatřenou vždy jasným textovým popisem (např. *Ano, zahodit postup*).

## 5.5 Statistické vyhodnocování testových položek

Pro administrátora aplikace slouží statistický přehled, který umožňuje posoudit kvalitu jednotlivých testových otázek a celkovou úroveň znalostí členů sboru. Tento přístup vychází z metodiky kvantitativního vyhodnocování didaktických testů (Chráska, 1999; Chráska, 2016).

Pro každou otázku je zaznamenáván celkový počet zobrazení a počet správných a chybných odpovědí napříč všemi uživateli. Na jejich základě je vypočítán index obtížnosti *p*, definovaný jako procentuální podíl uživatelů, kteří danou otázku zodpověděli správně (Jeřábek a Bílek, 2010):

*p = (počet správných odpovědí / celkový počet odpovědí) × 100 %*

Podle Jeřábka a Bílka (2010) jsou nejvhodnější otázky s hodnotou indexu obtížnosti kolem 50 %, které nejlépe rozlišují mezi uživateli s různou úrovní znalostí. Otázky s indexem pod 20 % jsou příliš obtížné a otázky s indexem nad 80 % příliš snadné – v obou případech je vhodné je revidovat.

Administrátorský přehled řadí otázky od nejnižšího indexu obtížnosti (nejtěžší), čímž velitel jednotky na první pohled vidí, ve kterých oblastech členové sboru nejvíce chybují. Tato data slouží jako podklad pro plánování prezenčních školení.

## 5.6 Zabezpečení aplikace

### 5.6.1 Hashování hesel

Hesla uživatelů jsou ukládána výhradně v hashované podobě s využitím algoritmu bcrypt. Při registraci je heslo hashováno s náhodně generovanou solí (salt), tedy náhodným řetězcem připojeným k heslu před hashováním, který zajišťuje, že i shodná hesla mají v databázi odlišnou hashovanou podobu. Počet iterací generování soli je nastaven na hodnotu 10 (salt rounds = 10). Při přihlašování se porovnává hash zadaného hesla s hashem uloženým v databázi. Prostý text hesla není nikdy uložen ani přenášen na server v nešifrované podobě jinak než jako vstup do funkce hashování.

### 5.6.2 Správa přihlášení

Pro správu přihlášení je použit mechanismus serverových sessions prostřednictvím knihovny express-session. Po úspěšném přihlášení je uživateli na straně serveru přiřazena relace obsahující jeho identifikátor, uživatelské jméno a roli. Každý následující požadavek na chráněné API ověřuje existenci a platnost této relace.

### 5.6.3 Registrace a registrační kód

Registrace nových uživatelů je chráněna registračním kódem, který nastavuje administrátor prostřednictvím administrátorského rozhraní. Při registraci zadá uživatel kromě přihlašovacích údajů a e-mailové adresy rovněž tento kód. Server jej porovná s hodnotou uloženou v tabulce nastavení a registraci povolí pouze při shodě. Tím je zajištěno, že k aplikaci nemají přístup neoprávněné osoby. Po úspěšné registraci je uživatel automaticky přihlášen.

### 5.6.4 Obnova zapomenutého hesla

Aplikace umožňuje obnovu zapomenutého hesla prostřednictvím e-mailu. Uživatel zadá svou e-mailovou adresu a systém vygeneruje kryptograficky bezpečný jednorázový token o délce 32 bajtů s časovou platností jedné hodiny. Token je uložen v databázi a odkaz pro obnovu je odeslán na zadaný e-mail prostřednictvím poštovního serveru (SMTP). Po kliknutí na odkaz a zadání nového hesla je token ověřen proti databázi včetně kontroly expirace. Po úspěšné změně hesla je token z databáze odstraněn.

Pro odesílání e-mailů s obnovou hesla byl vytvořen samostatný e-mailový účet, nezávislý na oficiálních schránkách sboru. Tímto opatřením je minimalizováno riziko kompromitace hlavních komunikačních kanálů jednotky v případě narušení bezpečnosti aplikace.

Z bezpečnostních důvodů systém při zadání neexistující e-mailové adresy nevrací chybové hlášení, aby nebylo možné zjistit, které adresy jsou v systému registrovány.

### 5.6.5 Kontrola oprávnění

Přístup k administrátorským funkcím je na úrovni API chráněn middlewarem, který ověřuje roli přihlášeného uživatele. Požadavky na správu uživatelů, změnu registračního kódu nebo zobrazení statistik jsou odmítnuty s kódem 403, pokud uživatel nemá roli administrátora. Administrátor nemůže smazat vlastní účet ani změnit svou vlastní roli, čímž je zamezeno nechtěnému uzamčení systému.

## 5.7 Nasazení a provoz aplikace

Zdrojový kód aplikace je verzován v repozitáři na platformě GitHub. Pro účely prezentace a ověření funkčnosti je aplikace nasazena ve free variantě cloudové platformy Render.com, která umožňuje provoz aplikací typu Node.js bez nutnosti správy vlastního serveru. Nasazení probíhá automaticky při každém odeslání změn do hlavní větve repozitáře.

Tato varianta hostingu je omezena dočasností databáze – po neaktivitě se instance restartuje a data jsou obnovena do výchozího stavu. Tato konfigurace postačuje pro demonstraci funkčnosti, nikoli pro produkční provoz. Pro reálné nasazení do praxe je aplikace připravena k přenesení na webové stránky SDH Borotín (sdhborotin.cz), kde bude provozována s trvalým úložištěm dat.

Konfigurace citlivých údajů (přihlašovací údaje k e-mailovému serveru) je oddělena od zdrojového kódu prostřednictvím proměnných prostředí (soubor .env), které jsou na hostingové platformě nastaveny v zabezpečeném administrátorském rozhraní.

Současná demonstrační varianta obsahuje mechanismus automatického vytvoření výchozího administrátorského účtu při startu aplikace, pokud tento účet v databázi neexistuje. Tento mechanismus je nezbytný výhradně pro demonstrační nasazení na platformě Render.com, kde se databáze po restartu obnovuje do výchozího stavu, a zajišťuje tak přístup k administraci bez nutnosti opakované registrace. V produkční verzi nasazené na sdhborotin.cz bude tento mechanismus odstraněn, neboť databáze bude trvalá a administrátorský účet bude vytvořen jednorázově při prvním nasazení.

# 6 Diskuse

Tato kapitola hodnotí dosažené výsledky v kontextu cílů definovaných v úvodu práce a nedostatků existujících řešení identifikovaných v rešerši. Současně diskutuje limity prototypu a naznačuje směry dalšího rozvoje.

## 6.1 Naplnění cílů práce

Hlavním cílem práce bylo vytvořit testovací aplikaci, která nahradí tradiční jednorázové zkoušení moderním webovým nástrojem pro průběžné udržování znalostí členů JSDH Borotín. Tento cíl byl naplněn – výsledkem je funkční prototyp webové aplikace, který pokrývá kompletní uživatelský cyklus od registrace po vyhodnocení testu s adaptivním výběrem otázek.

Dílčí úkoly formulované v oddílu 1.2 byly splněny následovně:

1. **Rešerše** (kap. 2) zmapovala současný stav vzdělávacích platforem a identifikovala tři hlavní nedostatky: obsahovou složitost přesahující potřeby řadových členů, uzavřenost systémů bez možnosti průběžného procvičování a absenci analytických dat pro velitele.
2. **Analýza požadavků** (kap. 3) konkretizovala obsahové, pedagogické a statistické nároky na nový systém.
3. **Návrh a implementace** (kap. 4 a 5) popisují zvolené řešení od architektury po nasazení.
4. **Zhodnocení výsledků** je předmětem této kapitoly.

## 6.2 Konfrontace s rešeršními zjištěními

Rešerše v kapitole 2 identifikovala u existujících řešení tři hlavní nedostatky. Následující srovnání ukazuje, jakým způsobem na ně vytvořená aplikace reaguje.

### 6.2.1 Obsahová přístupnost

Oficiální portály (hasici-vzdelavani.cz, cahd.cz) nabízejí rozsáhlé dokumenty a předpisy, jejichž odborná hloubka přesahuje potřeby řadového člena dobrovolné jednotky. Vytvořená aplikace tento problém řeší transformací zdrojových prezentací do stručných testových otázek se čtyřmi variantami odpovědí a textovým vysvětlením. Formát krátkého testu o deseti otázkách (princip mikroučení) je přístupnější než studium rozsáhlých PDF dokumentů, zejména na mobilních zařízeních.

### 6.2.2 Otevřenost a průběžné procvičování

Portál hasici-elearning.cz umožňuje testování pouze v rámci formálního vzdělávacího cyklu a po absolvování se k otázkám nelze vracet. Platforma SH ČMS na bázi systému Moodle je sice funkčně bohatší, ale její komplexní uživatelské rozhraní je pro účely rychlého mobilního testování nepřehledné. Vytvořená aplikace je oproti tomu kdykoli přístupná všem registrovaným členům sboru. Uživatel může test spustit opakovaně, přičemž adaptivní algoritmus na základě jeho předchozích odpovědí zajišťuje, že jsou mu přednostně předkládány otázky, v nichž chybuje.

### 6.2.3 Evidence výsledků a analytika pro velitele

Žádné z rešeršovaných řešení neposkytuje veliteli jednotky analytický přehled o slabých místech jeho členů. Ani vlastní webové stránky jednotlivých sborů (např. SDH Darkovice) nenabízejí více než veřejný žebříček s celkovým skóre. Vytvořená aplikace implementuje statistické vyhodnocování testových položek prostřednictvím indexu obtížnosti dle Chrásky (2016) a Jeřábka a Bílka (2010). Velitel jednotky tak na jednom místě vidí, které otázky činí členům největší obtíže, a může na jejich základě cíleně plánovat prezenční školení. Statistický přehled rovněž umožňuje identifikovat problémové nebo nevhodně formulované otázky – například otázky s příliš nízkou nebo naopak příliš vysokou úspěšností – a tyto následně opravit nebo vyřadit.

## 6.3 Přínos adaptivního přístupu

Implementovaný dvoufázový adaptivní algoritmus (oddíl 5.3.2) představuje klíčovou odlišnost od všech rešeršovaných řešení, která pracují s náhodným nebo sekvenčním výběrem otázek. Princip rozloženého opakování, na němž je algoritmus postaven (Wozniak, 1990), zajišťuje, že uživatel se v každém testu setkává především s otázkami, které mu činí obtíže. V kombinaci s korekční zpětnou vazbou – zobrazením správné odpovědi s vysvětlením (Brown, Roediger III a McDaniel, 2017) – tak aplikace aktivně podporuje proces učení, nikoli pouze testuje.

Zvoleným kompromisem je fáze průzkumu s prahem 15 %, která uživateli nejprve umožní seznámit se s šíří učiva, než se algoritmus přepne do režimu cíleného opakování. Ověření účinnosti tohoto nastavení na reálných datech z provozu jednotky je jednou z možností dalšího výzkumu.

## 6.4 Tvorba obsahu s využitím umělé inteligence

Podstatnou součástí práce bylo využití nástrojů umělé inteligence při tvorbě testového obsahu. Nástroje Google NotebookLM a Google AI Studio s modelem Gemini umožnily zpracovat desítky stran zdrojových prezentací do strukturovaných testových otázek v řádu hodin, což by při čistě manuální tvorbě představovalo násobně vyšší časovou investici.

Kvalita vygenerovaných otázek se ukázala jako překvapivě vysoká – při ruční revizi 65 otázek prvního okruhu byla nalezena jediná otázka s duplicitní odpovědí. Přesto je pro produkční nasazení nezbytná kompletní ruční revize, neboť AI nástroje mohou generovat formulačně správné, ale obsahově irelevantní nebo nepřiměřeně detailní otázky.

Samotná aplikace byla vytvořena přístupem, který Karpathy (2025) označuje pojmem „vibe coding" – vývojář formuluje požadavky přirozeným jazykem a kód generuje nástroj umělé inteligence. Tento přístup umožnil autorovi práce, který není profesionálním programátorem, vytvořit funkční prototyp webové aplikace. Vibe coding představuje významný trend v současném vývoji softwaru a otevírá možnosti tvorby digitálních nástrojů i odborníkům z jiných profesních oblastí. Současně je třeba poznamenat, že takto vytvořený kód vyžaduje důkladnou kontrolu a testování, neboť AI může generovat funkčně správné, ale bezpečnostně nebo architektonicky nevhodné řešení.

## 6.5 Ověření funkčnosti

Funkčnost adaptivního algoritmu byla ověřena prostřednictvím řízené simulace, při níž bylo vytvořeno chování tří typových uživatelů s odlišnou úrovní znalostí – Expert (úspěšnost 95 %), Pokročilý (úspěšnost 70 %) a Nováček (úspěšnost 45 %). Simulace zahrnovala celkem 600 jednotlivých odpovědí a potvrdila, že algoritmus správně reaguje na chybovost – u uživatele s nízkou úspěšností tvořily kritické otázky dominantní podíl každého následujícího testu, zatímco u uživatele s vysokou úspěšností byly testy doplňovány především o nové a zvládnuté otázky.

Aplikace byla rovněž krátkodobě vyzkoušena několika členy jednotky. Získané uživatelské zkušenosti jsou však prozatím omezené a nemají charakter systematického výzkumu. Hlubší statistické vyhodnocení na reálných datech – včetně analýzy učebních křivek a srovnání mezi členy – bude předmětem dalšího rozvoje aplikace po jejím nasazení do produkčního provozu.

## 6.6 Limity prototypu

Vytvořené řešení je prototypem, jehož primárním účelem je ověření konceptu. Je třeba pojmenovat jeho hlavní omezení:

**Pokrytí obsahu.** V aktuální verzi jsou zpracovány dva ze šesti tematických okruhů. Ačkoliv to postačuje k ověření funkčnosti všech komponent aplikace, pro reálné nasazení v jednotce je nutné zpracovat zbývající čtyři oblasti. Časová náročnost tohoto úkolu je značná, avšak metodika tvorby otázek s využitím AI nástrojů (oddíl 5.1.3) je ověřena a reprodukovatelná.

**Absence grafických otázek.** Některé oblasti odborné přípravy – zejména technický výcvik a předlékařská pomoc – vyžadují práci s obrázky, schématy nebo fotografiemi (např. rozpoznávání topografických značek, identifikace poranění). Současná verze aplikace pracuje výhradně s textovými otázkami. Rozšíření o grafický obsah představuje významný směr dalšího vývoje.

**Demonstrační hosting.** Aplikace je nasazena ve free variantě platformy Render.com s dočasnou databází, která nevyhovuje produkčnímu provozu. Pro reálné nasazení je připravena k přenesení na webové stránky SDH Borotín (sdhborotin.cz), kde bude provozována s trvalým úložištěm dat.

## 6.7 Možnosti dalšího rozvoje

Na základě zkušeností s vývojem prototypu lze identifikovat následující směry dalšího rozvoje aplikace:

1. **Doplnění zbývajících okruhů** – zpracování čtyř dosud nepokrytých tematických oblastí s využitím ověřené metodiky AI-asistované tvorby otázek a následné ruční revize.
2. **Grafické otázky** – rozšíření datového modelu o podporu obrázků v otázkách i odpovědích, což umožní testování praktických dovedností (rozpoznávání značek, identifikace vybavení, situační schémata).
3. **Produkční nasazení** – přenesení aplikace na webové stránky SDH Borotín (sdhborotin.cz) s trvalou databází a zajištění pravidelných záloh.
4. **Uživatelské testování** – sběr zpětné vazby od členů jednotky a iterativní úpravy rozhraní i obsahu na základě reálného používání.
5. **Rozšíření analytiky** – doplnění přehledů o trendy v čase (zlepšení/zhoršení výsledků), porovnání mezi členy a export dat pro potřeby dokumentace odborné přípravy.

# 7 Závěr

Cílem této závěrečné práce bylo navrhnout a vytvořit vlastní testovací webovou aplikaci pro potřeby jednotky sboru dobrovolných hasičů Borotín. Aplikace měla nahradit tradiční jednorázové zkoušení moderním nástrojem, který členům sboru usnadní pravidelné a efektivní udržování odborných znalostí.

Tento cíl byl naplněn. Výsledkem je funkční prototyp webové aplikace, která implementuje adaptivní výběr otázek založený na principu rozloženého opakování, korekční zpětnou vazbu s textovým vysvětlením, motivační prvky a statistický přehled pro velitele jednotky. Rešerše existujících řešení (kap. 2) prokázala, že žádná z dostupných platforem nenabízí kombinaci otevřeného přístupu, průběžného procvičování a analytických dat pro velitele – právě tyto funkce vytvořená aplikace poskytuje.

Při tvorbě testového obsahu se osvědčilo využití nástrojů umělé inteligence, které umožnily efektivně zpracovat desítky zdrojových dokumentů do strukturovaných testových otázek. Stejně tak se potvrdila využitelnost přístupu označovaného jako vibe coding pro tvorbu funkčního prototypu autorem, který není profesionálním programátorem.

Práce současně pojmenovává omezení prototypu – především neúplné pokrytí všech šesti tematických okruhů a absenci grafických otázek. Tato omezení nevyplývají z nedostatků návrhu, nýbrž z časové náročnosti tvorby kvalitního obsahu. Metodika přípravy otázek je ověřena a připravena k reprodukci.

V dalším období se proto práce nezastaví – aplikace bude následně nasazena do reálného produkčního provozu na webových stránkách sboru, postupně obohacena o obrazový materiál testující praktické dovednosti členů a postupně naplněna i zbývajícími tematickými okruhy. Tato rozšiřující fáze bude již plně formována zpětnou vazbou samotných hasičů z Borotína.

Vytvořená aplikace ukazuje, že i malá dobrovolná jednotka může s využitím moderních technologií a otevřených vzdělávacích materiálů HZS ČR systematicky pečovat o odbornou připravenost svých členů. Autor práce jako velitel jednotky SDH Borotín plánuje aplikaci nasadit do reálného provozu a průběžně ji rozvíjet.

# Literatura

Bibliografické citace jsou zpracovány v souladu s normou ČSN ISO 690:2022 (Informace a dokumentace – Pravidla pro bibliografické odkazy a citace informačních zdrojů). V textu práce je použit harvardský systém citování (autor, rok).

## Seznam bibliografických citací

BROWN, Peter C.; ROEDIGER III, Henry L.; McDANIEL, Mark A. Nauč se to!: Jak se s pomocí vědy efektivněji učit a více si pamatovat. Přeložila Eva Nevrlá. 1. vydání. Brno: Jan Melvil Publishing, 2017. 280 s. ISBN 978-80-7555-030-9.

ČESKÁ ASOCIACE HASIČSKÝCH DŮSTOJNÍKŮ. Souhrn metodických předpisů [online]. Ostrava: ČAHD. Dostupné z: https://www.cahd.cz/cz/dokumenty/souhrn-metodickych-predpisu [cit. 2026-03-19].

GENERÁLNÍ ŘEDITELSTVÍ HZS ČR. Hasiči e-learning [online]. Dostupné z: https://www.hasici-elearning.cz/ [cit. 2026-04-04].

GOOGLE. Google Forms – dokumentace [online]. Dostupné z: https://support.google.com/docs/answer/6281888 [cit. 2026-04-04].

GOOGLE. NotebookLM [online]. Dostupné z: https://notebooklm.google.com/ [cit. 2026-04-07].

GOOGLE DEEPMIND. Gemini [online]. Google AI Studio. Dostupné z: https://aistudio.google.com/ [cit. 2026-04-07].

CHRÁSKA, Miroslav. Didaktické testy: příručka pro učitele a studenty učitelství. Brno: Paido, 1999. 91 s. ISBN 80-85931-68-0.

CHRÁSKA, Miroslav. Metody pedagogického výzkumu: základy kvantitativního výzkumu. 2., aktualizované vydání. Praha: Grada, 2016. 254 s. ISBN 978-80-247-5326-3.

JEŘÁBEK, Ondřej; BÍLEK, Martin. Teorie a praxe tvorby didaktických testů. 1. vydání. Olomouc: Univerzita Palackého v Olomouci, 2010. ISBN 978-80-244-2494-1.

KAHOOT! Kahoot! – dokumentace a nápověda [online]. Dostupné z: https://kahoot.com/help/ [cit. 2026-04-04].

KARPATHY, Andrej. Vibe coding [online]. Příspěvek na sociální síti X, 2. února 2025. Dostupné z: https://x.com/karpathy/status/1886192184808149383 [cit. 2026-04-07].

KOMÍNEK, František. SDH Borotín – oficiální webové stránky [online]. Dostupné z: https://www.sdhborotin.cz/ [cit. 2026-03-19].

KRUG, Steve. Don't Make Me Think Revisited: A Common Sense Approach to Web Usability. United States of America: New Riders, 2014. 216 s. ISBN 978-0-321-96551-6.

MOODLE. Moodle Documentation [online]. Dostupné z: https://docs.moodle.org/ [cit. 2026-04-04].

MV – GŘ HZS ČR. Podpora velitele dobrovolné jednotky v oblasti ZOP [online]. Hasiči vzdělávání – Vzdělávací portál jednotek požární ochrany. Dostupné z: https://www.hasici-vzdelavani.cz/node/168 [cit. 2026-03-19].

NIELSEN, Jakob. Designing Web Usability: The Practice of Simplicity. Indianapolis: New Riders, 2000. ISBN 1-56205-810-X.

QUIZLET. Quizlet Help Center [online]. Dostupné z: https://help.quizlet.com/ [cit. 2026-04-04].

ŘEZÁČ, Jan. Web ostrý jako břitva: návrh fungujícího webu pro webdesignery a zadavatele projektů. Brno: House of Řezáč, 2016. 211 s. ISBN 978-80-270-0644-1.

SDH DARKOVICE. Online testy [online]. Dostupné z: https://www.sdh-darkovice.cz/testy/ [cit. 2026-04-04].

SDRUŽENÍ HASIČŮ ČECH, MORAVY A SLEZSKA. E-learning SH ČMS [online]. Dostupné z: https://vzdelavani.dh.cz/ [cit. 2026-04-04].

SDRUŽENÍ HASIČŮ ČECH, MORAVY A SLEZSKA. SH ČMS modernizuje a rozvíjí vzdělávání dobrovolných hasičů napříč republikou [online]. Dostupné z: https://www.dh.cz/index.php/usek-represe/uorr/cinnost-rady/2979-sh-cms-modernizuje-a-rozviji-vzdelavani-dobrovolnych-hasicu-napric-republikou [cit. 2026-04-04].

SOŠ PO A VOŠ PO. Střední odborná škola požární ochrany a Vyšší odborná škola požární ochrany [online]. Frýdek-Místek: HZS ČR. Dostupné z: https://hzscr.gov.cz/sos-po-a-vos-po.aspx [cit. 2026-04-04].

STERNBERG, Robert J. Kognitivní psychologie. Praha: Portál, 2009. 636 s. ISBN 978-80-7367-638-4.

ÚSTŘEDNÍ HASIČSKÁ ŠKOLA BÍLÉ POLIČANY. Kurzy a školení [online]. Dostupné z: https://uhsbp.cz/kurzy/ [cit. 2026-04-04].

Vyhláška č. 247/2001 Sb., o organizaci a činnosti jednotek požární ochrany, ve znění pozdějších předpisů [online]. In: e-Sbírka. Dostupné z: https://www.e-sbirka.cz/sb/2001/247 [cit. 2026-03-19].

WOZNIAK, Piotr A. Optimization of learning: A new approach and computer application. Master's Thesis. Poznan: Poznan University of Technology, 1990.

WOZNIAK, Piotr A.; GORZELAŃCZYK, Edward J. Optimization of repetition spacing in the practice of learning. Acta Neurobiologiae Experimentalis, 1994, roč. 54, č. 1, s. 59–62.

Zákon č. 133/1985 Sb., o požární ochraně, ve znění pozdějších předpisů [online]. In: e-Sbírka. Dostupné z: https://www.e-sbirka.cz/sb/1985/133 [cit. 2026-03-19].

Zákon č. 320/2015 Sb., o Hasičském záchranném sboru České republiky a o změně některých zákonů [online]. In: e-Sbírka. Dostupné z: https://www.e-sbirka.cz/sb/2015/320 [cit. 2026-03-19].
