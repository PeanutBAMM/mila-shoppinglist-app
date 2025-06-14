import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
        />
        
        {/* PWA Meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#10b981" />
        
        <title>Mila - Je Slimme Boodschappen Buddy</title>
        
        {/* Additional responsive fixes */}
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Fix for React Native Web container */
          #root {
            display: flex;
            flex: 1;
            min-height: 100vh;
          }
          
          /* Ensure full height on mobile browsers */
          html, body {
            height: 100%;
            width: 100%;
          }
          
          /* Fix for iOS safe areas */
          @supports (padding: env(safe-area-inset-top)) {
            #root {
              padding-top: env(safe-area-inset-top);
              padding-right: env(safe-area-inset-right);
              padding-bottom: env(safe-area-inset-bottom);
              padding-left: env(safe-area-inset-left);
            }
          }
        `}} />
        
        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
