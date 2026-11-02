@echo off
title LinguaPulse AI - Zamonaviy Ingliz Tili Ta'lim Platformasi
echo ==============================================================
echo    LinguaPulse AI - Zamonaviy Ingliz Tili Ta'lim Platformasi
echo ==============================================================
echo.
echo Server ishga tushirilmoqda: http://localhost:3001
echo To'xtatish uchun klaviaturadan: Ctrl + C
echo.
cd /d "%~dp0"
call npm.cmd run dev
pause
