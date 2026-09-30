@echo off
chcp 65001 >nul
echo ========================================================
echo   HAVEN PROPTECH - KICH HOAT LOCAL SLM QWEN2.5-0.5B
echo ========================================================
echo.
echo Dang kiem tra Ollama tren he thong...
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Chua tim thay Ollama tren may.
    echo Vui long cai dat Ollama tai: https://ollama.com/download/windows
    pause
    exit /b 1
)

echo [OK] Da tim thay Ollama.
echo Dang nap mo hinh haven-ai tu Modelfile...
ollama create haven-ai -f "%~dp0Modelfile"

echo.
echo ========================================================
echo   KHOI DONG THANH CONG HAVEN LOCAL SLM!
echo ========================================================
echo Ban co the hoi dap truc tiep ngay ben duoi:
ollama run haven-ai
