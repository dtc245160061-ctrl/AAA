@echo off
chcp 65001 >nul
title HAVEN AI - Khởi Chạy Dự Án (RTX 3060 6GB VRAM)
color 0A

echo ======================================================================
echo    HAVEN PROPTECH AI PLATFORM - 1-CLICK LAUNCHER FOR RTX 3060
echo ======================================================================
echo.

:: 1. Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Khong tim thay Node.js tren may tinh cua ban!
    echo Vui long tai va cai dat Node.js LTS tu: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Node.js da duoc tim thay:
node -v
echo.

:: 2. Cai dat thu vien dependencies neu can
if not exist "node_modules\" (
    echo [2/4] Dang cai dat dependencies (npm install)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install that bai!
        pause
        exit /b 1
    )
) else (
    echo [2/4] Thu vien node_modules da ton tai. Kiem tra nhanh...
    call npm install --prefer-offline --no-audit
)
echo.

:: 3. Kiem tra va chuan bi Ollama + Qwen 2.5 7B
echo [3/4] Kiem tra Ollama AI Engine (RTX 3060 6GB VRAM)...
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo [CANH BAO] May ban chua cai Ollama!
    echo App van se hoat dong voi Cloud Gemini RAG va heuristic fallback.
    echo De trai nghiem AI Local sieu toc tren RTX 3060, hay cai dat tai: https://ollama.com/
    echo.
) else (
    echo Khoi dong dich vu Ollama neu chua chay...
    start "" /B ollama serve >nul 2>nul
    timeout /t 2 >nul
    echo Dang dong bo model Qwen 2.5:7b chuyen dung cho RTX 3060...
    ollama pull qwen2.5:7b
    echo [OK] Model qwen2.5:7b da san sang!
    echo.
)

:: 4. Khoi chay ung dung va tu dong mo trinh duyet
echo [4/4] Khoi dong HAVEN Dev Server tren http://localhost:5173/ ...
echo Nhan Ctrl + C de dung ung dung bat ky luc nao.
echo ======================================================================
echo.

npm run dev -- --open
pause
