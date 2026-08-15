@echo off
chcp 65001 >nul
title Origin Movers - публикация превью
cd /d "%~dp0"

echo.
echo ==========================================
echo   ORIGIN MOVERS - публикация превью
echo ==========================================
echo.
echo Сейчас будет создан ПУБЛИЧНЫЙ репозиторий
echo origin-preview на GitHub (kolaepi34-ctrl)
echo и туда зальются файлы главной страницы.
echo.
echo Публичный - значит сайт увидит любой,
echo у кого есть ссылка.
echo.
set /p ok="Продолжить? Введите ДА и нажмите Enter: "
if /i not "%ok%"=="ДА" if /i not "%ok%"=="da" if /i not "%ok%"=="yes" goto :otmena

echo.
echo [1/2] Создаю репозиторий и заливаю файлы...
"C:\Program Files\GitHub CLI\gh.exe" repo create origin-preview --public --source . --push
if errorlevel 1 goto :oshibka

echo.
echo [2/2] Включаю GitHub Pages...
"C:\Program Files\GitHub CLI\gh.exe" api -X POST repos/kolaepi34-ctrl/origin-preview/pages -f "source[branch]=main" -f "source[path]=/" 2>nul
if errorlevel 1 (
  echo.
  echo   Pages не включились автоматически - включите вручную:
  echo   https://github.com/kolaepi34-ctrl/origin-preview/settings/pages
  echo   Source: Deploy from a branch, ветка main, папка / root, Save
)

echo.
echo ==========================================
echo   ГОТОВО
echo.
echo   Ссылка для заказчика (через 2-3 минуты):
echo   https://kolaepi34-ctrl.github.io/origin-preview/
echo ==========================================
echo.
pause
exit /b

:oshibka
echo.
echo ОШИБКА при создании репозитория.
echo Возможно, репозиторий с таким именем уже есть.
echo Пришлите Клоду текст ошибки выше.
echo.
pause
exit /b

:otmena
echo.
echo Отменено. Ничего не опубликовано.
echo.
pause
