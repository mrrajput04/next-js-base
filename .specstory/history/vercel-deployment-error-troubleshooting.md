## SpecStory

## Vercel Deployment Error Troubleshooting (2/3/2025, 1:03:47 PM)

_**User**_

My vercel deployment keeps complaining with:
Error: ENOENT: no such file or directory, lstat '/vercel/path0/.next/export-detail.json'
Should I be providing that file?

---

_**Assistant**_

No, you don't need to provide that file manually. This error typically occurs when there's a mismatch in the Next.js configuration or build settings, especially when dealing with static exports.

For Next.js 13+ applications deployed to Vercel, you generally don't need to use the export feature. Here are a few things to check:

1. First, make sure your `next.config.js` doesn't have `output: 'export'` set. Here's how your basic `next.config.js` should look:

```javascript:next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' if it exists
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

2. In your `package.json`, make sure your build script is simply:

```json:package.json
{
  "scripts": {
    "build": "next build"
  }
}
```

Don't use `next export` in your build command.

3. If you're still having issues, try clearing your `.next` folder and Vercel's cache:
   - Delete the local `.next` folder
   - In your Vercel project settings, go to the Build & Development Settings section
   - Click "Clear Build Cache and Deploy"

The error you're seeing typically means Vercel is trying to perform a static export when it shouldn't be. Next.js on Vercel should work with server-side rendering out of the box without needing static exports.

---



---

