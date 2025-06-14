@echo off
REM Complete OAuth Setup Script for Mila - Windows Version

echo ======================================================
echo   🚀 Mila OAuth Setup - Automated Steps
echo ======================================================
echo.

REM Step 1: Add missing IAM role
echo 📋 Step 1: Adding Resource Manager role...
echo Run this in Google Cloud Shell:
echo.
echo gcloud projects add-iam-policy-binding mila-shoppinglist-app --member="serviceAccount:mila-mcp@mila-shoppinglist-app.iam.gserviceaccount.com" --role="roles/resourcemanager.projectViewer"
echo.
pause

echo.
echo ======================================================
echo   📋 Manual Steps Required (Opening in browser)
echo ======================================================
echo.

REM Step 2: Open OAuth Consent Screen
echo 🌐 Step 2: Configure OAuth Consent Screen
echo.
echo Opening: OAuth Consent Screen configuration
echo Please configure with:
echo   - App name: Mila Shopping Assistant
echo   - Support email: [your email]
echo   - Logo: Upload assets/images/mila-avatar-new.png
echo   - Authorized domains: localhost (for dev)
echo.
start https://console.cloud.google.com/apis/credentials/consent?project=mila-shoppinglist-app
echo Press any key when you've completed the consent screen setup...
pause >nul

REM Step 3: Create OAuth Clients
echo.
echo 🔑 Step 3: Create OAuth 2.0 Client IDs
echo.
echo Opening: OAuth Credentials page
echo.
echo Please create these 3 OAuth clients:
echo.
echo 1. WEB APPLICATION:
echo    - Name: Mila Web Client
echo    - Authorized JavaScript origins:
echo      • http://localhost:19006
echo      • https://lfaybrusqgkaxmovyegv.supabase.co
echo    - Authorized redirect URIs:
echo      • http://localhost:19006/auth/callback
echo      • https://lfaybrusqgkaxmovyegv.supabase.co/auth/v1/callback
echo.
echo 2. ANDROID:
echo    - Name: Mila Android Client
echo    - Package name: com.yourcompany.mila
echo    - SHA-1: (get from your keystore)
echo.
echo 3. iOS:
echo    - Name: Mila iOS Client
echo    - Bundle ID: com.yourcompany.mila
echo.
start https://console.cloud.google.com/apis/credentials?project=mila-shoppinglist-app
echo Press any key when you've created all 3 OAuth clients...
pause >nul

REM Collect the client IDs
echo.
echo 📝 Please enter the OAuth Client IDs you just created:
echo.
set /p WEB_CLIENT_ID=Web Client ID (e.g., 123456789.apps.googleusercontent.com): 
set /p WEB_CLIENT_SECRET=Web Client Secret: 
set /p ANDROID_CLIENT_ID=Android Client ID: 
set /p IOS_CLIENT_ID=iOS Client ID: 

REM Step 4: Configure Supabase
echo.
echo 🔐 Step 4: Configure Supabase Google Provider
echo.
echo Opening: Supabase Auth configuration
echo Please enable Google provider with:
echo   - Client ID: %WEB_CLIENT_ID%
echo   - Client Secret: %WEB_CLIENT_SECRET%
echo.
start https://lfaybrusqgkaxmovyegv.supabase.co/project/lfaybrusqgkaxmovyegv/auth/providers
echo Press any key when you've configured Supabase...
pause >nul

REM Step 5: Update .env.local
echo.
echo 📄 Updating .env.local file...
(
echo # Supabase
echo EXPO_PUBLIC_SUPABASE_URL=https://lfaybrusqgkaxmovyegv.supabase.co
echo EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYXlicnVzcWdrYXhtb3Z5ZWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MzUyNTAsImV4cCI6MjA0ODQxMTI1MH0.u5gxi0GGMaoWj2FOwEBp5hqMApJWx2p5VbFuGqD38Fw
echo.
echo # Google OAuth
echo EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=%WEB_CLIENT_ID%
echo EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=%ANDROID_CLIENT_ID%
echo EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=%IOS_CLIENT_ID%
echo EXPO_PUBLIC_REDIRECT_URL=http://localhost:19006/auth/callback
) > "C:\Users\peanu\Development\Apps\Mila\.env.local"

echo ✅ .env.local updated!

REM Create a summary file
echo.
echo 📋 Creating setup summary...
(
echo OAuth Setup Summary - %date% %time%
echo =====================================
echo.
echo Web Client ID: %WEB_CLIENT_ID%
echo Android Client ID: %ANDROID_CLIENT_ID%
echo iOS Client ID: %IOS_CLIENT_ID%
echo.
echo Next Steps:
echo 1. Update app.json with scheme: "com.yourcompany.mila"
echo 2. Add iOS config in app.json:
echo    "ios": {
echo      "bundleIdentifier": "com.yourcompany.mila",
echo      "config": {
echo        "googleSignIn": {
echo          "reservedClientId": "%IOS_CLIENT_ID%"
echo        }
echo      }
echo    }
echo 3. Run: npx expo start
echo 4. Test the signInWithGoogle function!
) > "C:\Users\peanu\Development\Apps\Mila\oauth-setup-summary.txt"

echo.
echo ======================================================
echo   ✅ OAuth Setup Complete!
echo ======================================================
echo.
echo Your OAuth configuration is ready!
echo Client IDs have been saved to .env.local
echo Summary saved to oauth-setup-summary.txt
echo.
echo To test, run: npx expo start
echo Then use the signInWithGoogle function in your app!
echo.
pause
