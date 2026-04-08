@echo off
echo ============================================================
echo   SDH Borotin - Priprava souboru k odevzdani (Finalni export)
echo ============================================================
echo.

set TARGET=soubory_k_odevzdani_zp

echo [1/4] Vytvarim cistou slozku %TARGET%...
if exist %TARGET% (
    echo    - Slozka jiz existuje, cistim ji...
    rd /s /q %TARGET%
)
mkdir %TARGET%

echo [2/4] Kopiruji zdrojove kody a webova data...
xcopy /s /e /i /y "public" "%TARGET%\public" >nul
copy "server.js" "%TARGET%\" >nul
copy "package.json" "%TARGET%\" >nul
copy "package-lock.json" "%TARGET%\" >nul
copy "otazky.json" "%TARGET%\" >nul
copy "spustit_server.bat" "%TARGET%\" >nul
copy "README_PRO_OPONENTA.md" "%TARGET%\" >nul

echo [3/4] Resim bezpecnost (.env.example namisto .env)...
copy ".env.example" "%TARGET%\" >nul

echo [4/4] Presunuji text zaverecne prace do slozky...
if exist "zaverecna_prace_komplet.md" (
    move "zaverecna_prace_komplet.md" "%TARGET%\" >nul
    echo    - Soubor zaverecna_prace_komplet.md uspesne uskladnen.
) else (
    echo    - Varovani: zaverecna_prace_komplet.md nenalezen!
)

echo.
echo ============================================================
echo   HOTOVO! Balicek je pripraven ve slozce: %TARGET%
echo   Tuto slozku nyni muzete celou zabalit (ZIP) a odevzdat.
echo ============================================================
pause
