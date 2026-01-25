@echo off
REM Setup script for OROVA V4 - Configure Gemini API Key
echo ========================================
echo OROVA V4 - Gemini API Key Setup
echo ========================================
echo.

if "%1"=="" (
    echo ERROR: No API key provided
    echo.
    echo Usage: setup_api_key.bat YOUR_API_KEY_HERE
    echo.
    echo Example: setup_api_key.bat AIzaSyABC123...
    echo.
    pause
    exit /b 1
)

set API_KEY=%1

echo Setting GEMINI_API_KEY environment variable...
echo.

REM Set for current session
set GEMINI_API_KEY=%API_KEY%

REM Set permanently for user
setx GEMINI_API_KEY "%API_KEY%"

echo.
echo ========================================
echo SUCCESS! API Key configured.
echo ========================================
echo.
echo The GEMINI_API_KEY has been set both:
echo   - For this session (immediate use)
echo   - Permanently (survives restarts)
echo.
echo Next steps:
echo   1. Start the Flask server: python app.py
echo   2. Navigate to http://localhost:5002/
echo   3. Try the "Deep Analyze" feature!
echo.
pause
