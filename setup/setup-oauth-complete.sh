#!/bin/bash
# Complete OAuth Setup Script for Mila

echo "======================================================"
echo "  🚀 Mila OAuth Setup - Automated Steps"
echo "======================================================"
echo

# Function to open URLs
open_url() {
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start "$1"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$1"
    else
        xdg-open "$1"
    fi
}

# Step 1: Add missing IAM role
echo "📋 Step 1: Adding Resource Manager role..."
gcloud projects add-iam-policy-binding mila-shoppinglist-app \
    --member="serviceAccount:mila-mcp@mila-shoppinglist-app.iam.gserviceaccount.com" \
    --role="roles/resourcemanager.projectViewer" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Resource Manager role added successfully!"
else
    echo "⚠️  Could not add role (may already exist)"
fi

echo
echo "======================================================"
echo "  📋 Manual Steps Required (Opening in browser)"
echo "======================================================"
echo

# Step 2: Open OAuth Consent Screen
echo "🌐 Opening OAuth Consent Screen configuration..."
echo "Please configure with:"
echo "  - App name: Mila Shopping Assistant"
echo "  - Support email: [your email]"
echo "  - Logo: Upload mila-avatar.png"
echo
open_url "https://console.cloud.google.com/apis/credentials/consent?project=mila-shoppinglist-app"
echo "Press Enter when you've completed the consent screen setup..."
read

# Step 3: Create OAuth Clients
echo "🔑 Opening OAuth Credentials page..."
echo "Please create 3 OAuth 2.0 Client IDs:"
echo
echo "1. Web Application:"
echo "   - Name: Mila Web Client"
echo "   - Authorized JavaScript origins:"
echo "     • http://localhost:19006"
echo "     • https://lfaybrusqgkaxmovyegv.supabase.co"
echo "   - Authorized redirect URIs:"
echo "     • http://localhost:19006/auth/callback"
echo "     • https://lfaybrusqgkaxmovyegv.supabase.co/auth/v1/callback"
echo
echo "2. Android:"
echo "   - Name: Mila Android Client"
echo "   - Package name: com.yourcompany.mila"
echo
echo "3. iOS:"
echo "   - Name: Mila iOS Client"
echo "   - Bundle ID: com.yourcompany.mila"
echo
open_url "https://console.cloud.google.com/apis/credentials?project=mila-shoppinglist-app"
echo "Press Enter when you've created all 3 OAuth clients..."
read

# Collect the client IDs
echo "📝 Please enter the OAuth Client IDs you just created:"
echo
read -p "Web Client ID (e.g., 123456789.apps.googleusercontent.com): " WEB_CLIENT_ID
read -p "Web Client Secret: " WEB_CLIENT_SECRET
read -p "Android Client ID: " ANDROID_CLIENT_ID
read -p "iOS Client ID: " IOS_CLIENT_ID

# Step 4: Configure Supabase
echo
echo "🔐 Opening Supabase Auth configuration..."
echo "Please enable Google provider with:"
echo "  - Client ID: $WEB_CLIENT_ID"
echo "  - Client Secret: $WEB_CLIENT_SECRET"
echo
open_url "https://lfaybrusqgkaxmovyegv.supabase.co/project/lfaybrusqgkaxmovyegv/auth/providers"
echo "Press Enter when you've configured Supabase..."
read

# Step 5: Update .env.local
echo
echo "📄 Updating .env.local file..."
cat > C:/Users/peanu/Development/Apps/Mila/.env.local << EOF
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://lfaybrusqgkaxmovyegv.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYXlicnVzcWdrYXhtb3Z5ZWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MzUyNTAsImV4cCI6MjA0ODQxMTI1MH0.u5gxi0GGMaoWj2FOwEBp5hqMApJWx2p5VbFuGqD38Fw

# Google OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=$WEB_CLIENT_ID
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=$ANDROID_CLIENT_ID
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=$IOS_CLIENT_ID
EXPO_PUBLIC_REDIRECT_URL=http://localhost:19006/auth/callback
EOF

echo "✅ .env.local updated!"

# Step 6: Update app.json
echo
echo "📱 Updating app.json..."
# This would need jq or manual editing
echo "⚠️  Please manually update app.json with:"
echo '  "scheme": "com.yourcompany.mila"'
echo "  And add the iOS googleSignIn config with your iOS client ID"

echo
echo "======================================================"
echo "  ✅ OAuth Setup Complete!"
echo "======================================================"
echo
echo "Your OAuth configuration is ready!"
echo "Client IDs have been saved to .env.local"
echo
echo "To test, run: npx expo start"
echo "Then use the signInWithGoogle function in your app!"
