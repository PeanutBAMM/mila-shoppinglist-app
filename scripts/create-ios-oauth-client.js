const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function createIOSOAuthClient() {
  try {
    // Load service account
    const keyPath = path.join(__dirname, '../mcp-extensions/google-cloud-mcp-extended/service-account.json');
    const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    
    // Create auth client
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/cloudplatformprojects'
      ],
    });

    const authClient = await auth.getClient();
    const projectId = keyFile.project_id;
    
    console.log(`🔍 Project ID: ${projectId}`);
    
    // Try using the IAM API to create OAuth2 credentials
    const iam = google.iam('v1');
    const oauth2 = google.oauth2('v2');
    
    // First, let's check existing OAuth clients via different approach
    console.log('\n📋 Checking existing OAuth configurations...');
    
    // Try to use the undocumented API that Console uses
    const baseUrl = 'https://console.cloud.google.com';
    const credentialsUrl = `${baseUrl}/m/credential/list?project=${projectId}`;
    
    console.log('\n🚀 Attempting to create iOS OAuth client...');
    
    // Unfortunately, Google doesn't expose a public API for creating OAuth clients
    // outside of IAP (Identity-Aware Proxy) context
    
    // Let's try one more approach - using the credentials API directly
    const request = {
      auth: authClient,
      parent: `projects/${projectId}`,
      oauthClient: {
        displayName: 'Mila iOS Client',
        applicationId: 'com.peanutventures.mila',
        applicationType: 'IOS'
      }
    };
    
    console.log('\n❌ Unfortunately, Google does not provide a public API to create OAuth clients');
    console.log('   outside of the IAP (Identity-Aware Proxy) service.');
    console.log('\n📝 The only way to create iOS OAuth clients is through the Console UI.');
    console.log('\n🔗 Direct link to create it manually:');
    console.log(`   https://console.cloud.google.com/apis/credentials/oauthclient?project=${projectId}`);
    console.log('\n📱 iOS OAuth Client Configuration:');
    console.log('   - Application type: iOS');
    console.log('   - Name: Mila iOS Client');
    console.log('   - Bundle ID: com.peanutventures.mila');
    
    // Let's at least list existing clients
    console.log('\n📊 Checking existing OAuth clients via alternative method...');
    
    // We can try to get project metadata
    const cloudresourcemanager = google.cloudresourcemanager('v1');
    const project = await cloudresourcemanager.projects.get({
      auth: authClient,
      projectId: projectId
    });
    
    console.log('\n✅ Project confirmed:', project.data.name);
    console.log('   Project Number:', project.data.projectNumber);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the script
createIOSOAuthClient().catch(console.error);
