@echo off
chcp 65001 >nul
echo ====================================================
echo Automaticky nastroj pro nahrani zmen na GitHub
echo ====================================================
echo.
echo KROK 1: Zaznamenavam zmenene soubory...
git add .
echo [HOTOVO]
echo.

echo KROK 2: Vytvarim ulozenou verzi (commit)...
git commit -m "Implementace faze pruzkumu, tlacitka Preskocit a uprava otazku dle zaverecne prace"
echo.

echo KROK 3: Odesilam data na internet do repozitare GitHub...
git push origin main
IF %ERRORLEVEL% NEQ 0 (
  echo.
  echo Upozorneni: Odeslani na vetev 'main' neuspesne, pravdepodobne se vase vetev jmenuje 'master'. Pokousim se znovu...
  git push origin master
)

echo.
echo ====================================================
echo Proces byl ukoncen. 
echo Pokud nize nevidite zadnou zavaznou chybu FATAL nebo ERROR,
echo data se v poradku nahrala a Render nyni aplikaci aktualizuje.
echo ====================================================
pause
