@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 메모 앱
echo.
echo  ========================================
echo    메모 앱을 실행합니다
echo  ========================================
echo.
echo  잠시 후 브라우저가 자동으로 열립니다.
echo  이 검은 창을 닫으면 앱 사용이 중지됩니다.
echo.
npm.cmd run start
echo.
echo  앱이 종료되었습니다.
pause
