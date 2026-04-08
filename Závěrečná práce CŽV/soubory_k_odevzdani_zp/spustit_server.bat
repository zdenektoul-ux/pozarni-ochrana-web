@echo off
chcp 65001 >nul
echo ====================================================
echo Spoustim lokalni server aplikace Pozarni Ochrana
echo ====================================================
echo.
echo Pro ukonceni serveru staci zavrit toto okno, nebo stisknout CTRL+C.
echo.
echo Za chvili se vam automaticky otevre internetovy prohlizec.
echo Pokud k tomu nedojde, otevrte si rucne tuto adresu: 
echo http://localhost:3000
echo.
echo Nyni startuje samotny Node.js server...
echo ====================================================

:: Otevře výchozí prohlížeč na adrese serveru
start http://localhost:3000

:: Spustí samotný server a okno zůstane běžet
node server.js

pause
