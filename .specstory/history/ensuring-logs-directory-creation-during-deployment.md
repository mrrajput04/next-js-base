## SpecStory

## Ensuring Logs Directory Creation During Deployment (2/2/2025, 8:23:40 PM)

_**User**_

The deployment has been giving this error:
Copying files to destination directory '/home/site/wwwroot'...
rsync: [receiver] rename "/home/site/wwwroot/logs/.app.log.N9d8vs" -> "logs/app.log": No such file or directory (2)
rsync error: some files/attrs were not transferred (see previous errors) (code 23) at main.c(1338) [sender=3.2.7]
Is there a way I can ensure that the logs directory is created during the deployment?

---

_**Assistant**_

I'll help you modify the code to ensure the logs directory is created during deployment. We should add a script that runs during the build or startup phase to create the necessary directories.

Let's create a new script file:

```typescript:src/lib/init/ensureDirectories.ts
import fs from 'fs';
import path from 'path';

export function ensureDirectories() {
  const directories = [
    'logs',
    // Add any other required directories here
  ];

  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  });
}
```

Now, let's modify the app entry point to call this function. Since you're using Next.js 14, we'll add it to a custom server middleware:

```typescript:src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ensureDirectories } from './lib/init/ensureDirectories';

// Run once at startup
if (process.env.NODE_ENV === 'production') {
  ensureDirectories();
}

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
```

This solution will:
1. Create a utility function to ensure required directories exist
2. Run the directory creation on startup in production environment
3. Create the logs directory if it doesn't exist

The middleware will run early in the application lifecycle, ensuring the directories are created before they're needed.

Alternatively, if you prefer to handle this during the build process, you can create a script and add it to your package.json:

```json:package.json
{
  "scripts": {
    // ... existing scripts ...
    "postbuild": "node -e \"require('fs').mkdirSync('logs', { recursive: true })\""
  }
}
```

Choose the solution that best fits your deployment workflow. The middleware approach is more robust as it runs every time the application starts, while the package.json script runs during the build process.

---

_**User**_

Are there any other potential problems spots for the production build?

---

_**Assistant**_

Looking at your setup, there are a few potential areas we should address to make the production build more robust:

1. First, let's modify the middleware to handle potential filesystem errors:

```typescript:src/middleware.ts
// ... existing imports ...

// Run once at startup
if (process.env.NODE_ENV === 'production') {
  try {
    ensureDirectories();
  } catch (error) {
    console.error('Failed to create directories:', error);
    // Don't throw - we don't want to crash the app, but we want to know if there's an issue
  }
}

// ... rest of the file
```

2. Let's add a build cleanup script to ensure we don't have stale files. Create a new script:

```typescript:scripts/build-cleanup.js
const { rimraf } = require('rimraf');
const fs = require('fs');
const path = require('path');

async function cleanup() {
  // Clean .next directory
  await rimraf('.next');
  
  // Ensure logs directory exists and is writable
  const logsDir = path.join(process.cwd(), 'logs');
  try {
    fs.mkdirSync(logsDir, { recursive: true });
    // Test write permissions
    const testFile = path.join(logsDir, 'test.log');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
  } catch (error) {
    console.error('Error setting up logs directory:', error);
    process.exit(1);
  }
}

cleanup().catch(console.error);
```

3. Update your package.json scripts to include the cleanup:

```json:package.json
{
  "scripts": {
    // ... existing scripts ...
    "prebuild": "node scripts/check-runtime.js && node scripts/build-cleanup.js",
    "postbuild": "node -e \"require('fs').mkdirSync('logs', { recursive: true })\"",
    "build": "next build",
    // Add a production start script that ensures directories exist
    "start:prod": "node -e \"require('./src/lib/init/ensureDirectories.js').ensureDirectories()\" && next start"
  }
}
```

4. Add a .gitkeep file to ensure the logs directory is tracked in git:

```text:logs/.gitkeep

```

5. Update your .gitignore to ignore log files but keep the directory:

```text:.gitignore
# ... existing entries ...

# Logs
logs/*
!logs/.gitkeep
```

These changes will:
1. Make the directory creation more resilient with proper error handling
2. Clean up stale build files before each build
3. Ensure the logs directory exists and is writable
4. Keep the logs directory in version control while ignoring log files
5. Add a production-specific start script that ensures directories exist

Additionally, you might want to consider:

1. Adding health check endpoints to verify the application state
2. Setting up proper log rotation to prevent the logs directory from growing too large
3. Adding environment variable validation at startup
4. Setting up proper file permissions for the logs directory in production

Would you like me to provide implementations for any of these additional suggestions?

---

_**User**_

I'm getting this from the Azure App Service during deployment:
./src/lib/init/ensureDirectories.ts
A Node.js module is loaded ('fs' at line 1) which is not supported in the Edge Runtime.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime

Import trace for requested module:
./src/lib/init/ensureDirectories.ts

./src/lib/init/ensureDirectories.ts
A Node.js module is loaded ('path' at line 2) which is not supported in the Edge Runtime.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime

Import trace for requested module:
./src/lib/init/ensureDirectories.ts

./src/lib/init/ensureDirectories.ts
A Node.js API is used (process.cwd at line: 8) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime

Import trace for requested module:
./src/lib/init/ensureDirectories.ts

When I'm using an Azure App Service do I have to specify which runtime the App Service should run in Azure configuration?

---

_**Assistant**_

Ah, I see the issue. The error is occurring because the middleware is running in the Edge Runtime by default, but we're trying to use Node.js specific modules (fs, path). Let's fix this:

1. First, let's modify the middleware to explicitly use the Node.js runtime:

```typescript:src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ensureDirectories } from './lib/init/ensureDirectories';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';

// Run once at startup
if (process.env.NODE_ENV === 'production') {
  try {
    ensureDirectories();
  } catch (error) {
    console.error('Failed to create directories:', error);
  }
}

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configure middleware to run only on API routes
export const config = {
  matcher: '/api/:path*',
}; 
```

2. For Azure App Service, you should also add a web.config file to ensure proper Node.js configuration:

```xml:web.config
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="node_modules/next/dist/bin/next" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="node_modules/next/dist/bin/next"/>
        </rule>
      </rules>
    </rewrite>
    <directoryBrowse enabled="false" />
  </system.webServer>
</configuration>
```

3. In your Azure App Service configuration, make sure to:
   - Set the Node.js version in Configuration > General settings
   - Add an application setting:
     ```
     WEBSITE_NODE_DEFAULT_VERSION=18.x (or your preferred Node version)
     ```

4. You might also want to add a startup command in the Azure Portal under Configuration > General settings > Startup Command:
```bash
npm run start:prod
```

These changes should resolve the Edge Runtime issues and ensure proper Node.js execution in Azure App Service. The web.config file helps IIS properly handle the Node.js application, and the explicit runtime setting in middleware.ts ensures we're using Node.js capabilities where needed.

Let me know if you need help with any specific Azure App Service configuration steps!

---

_**User**_

Let's get rid of the ensureDirectories.js stuff.  I don't want to fall into an "Edge" vs "Node.js" run-time hole again.  I've been there before.

---

_**Assistant**_

That's a wise decision. Let's simplify things and remove all the ensureDirectories-related code that was causing runtime conflicts.

1. First, let's clean up the middleware:

```typescript:src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    return NextResponse.next();
}

// Configure middleware to run only on API routes
export const config = {
    matcher: '/api/:path*',
}; 
```

2. Let's update the package.json scripts to be simpler:

```json:package.json
{
  "scripts": {
    // ... other scripts ...
    "prebuild": "node scripts/check-runtime.js",
    "build": "next build",
    "start": "next start"
  }
}
```

3. We can delete these files:
- Delete `src/lib/init/ensureDirectories.ts`
- Delete `scripts/build-cleanup.js`

The logs directory can be created manually in Azure App Service during deployment or setup, which is a more reliable approach. You can do this through:
1. Azure Portal's Kudu console
2. Deployment script in Azure
3. Azure App Service's startup command

Would you like me to show you any of those alternative approaches for handling the logs directory in Azure?

---

_**User**_

@package.json I think this file still refers to ensureDirectories.js.  Let's get rid of that.

---

_**Assistant**_

Yes, let's clean up those remaining references in package.json:

```json:package.json
{
  "scripts": {
    // ... existing scripts ...
    "prebuild": "node scripts/check-runtime.js",
    "postbuild": "node -e \"require('fs').mkdirSync('logs', { recursive: true })\"",
    "start": "next start"
  }
}
```

I've removed the `start:prod` script since it was referencing the `ensureDirectories.js` file we're removing. We're keeping the simple `postbuild` script that creates the logs directory, as it's a straightforward Node.js command without any runtime complications.

---

_**User**_

Can I test a production build locally?

---

_**Assistant**_

Yes, you can test a production build locally! Here's how to do it:

1. First, build the production version:
```bash
npm run build
```

2. Then start the production server:
```bash
npm start
```

Or you can do it in one command:
```bash
npm run build && npm start
```

This will:
1. Create an optimized production build in the `.next` directory
2. Start the server in production mode on port 3000 (default)

A few things to note:
- The production build will use production environment variables, so make sure your `.env.local` or `.env.production` has the correct values
- Production mode disables hot reloading and development-specific features
- The logs directory will be created during the build process (via the postbuild script)

To test with a different port, you can use:
```bash
PORT=3001 npm start
```

Would you like me to show you how to verify specific production features like environment variables or logging?

---

_**User**_

what does web.config do again, and do I really need it?

---

_**Assistant**_



The web.config file is specifically for IIS (Internet Information Services) - Microsoft's web server that runs on Windows. It's needed when you're deploying to Azure App Service running on Windows, as it tells IIS how to handle your Node.js/Next.js application.

Here's what each main part does:
```xml
<handlers>
  <!-- Tells IIS to use iisnode module to process Node.js applications -->
  <add name="iisnode" path="node_modules/next/dist/bin/next" verb="*" modules="iisnode" />
</handlers>

<rewrite>
  <rules>
    <!-- Rules that tell IIS how to route requests to your Next.js app -->
    <rule name="StaticContent">
      <!-- Handles static files -->
      <action type="Rewrite" url="public{REQUEST_URI}"/>
    </rule>
    <rule name="DynamicContent">
      <!-- Routes all other requests to Next.js -->
      <action type="Rewrite" url="node_modules/next/dist/bin/next"/>
    </rule>
  </rules>
</rewrite>
```

Do you need it?
- If deploying to Azure App Service on **Windows**: Yes
- If deploying to Azure App Service on **Linux**: No
- If deploying to other platforms (Vercel, Netlify, etc.): No

If you're using Azure App Service on Linux, you can safely remove this file. Which platform are you deploying to?

---



---

