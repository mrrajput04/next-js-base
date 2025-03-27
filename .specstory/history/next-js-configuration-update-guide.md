## SpecStory

## Next.js Configuration Update Guide (2/1/2025, 2:58:21 PM)

_**User**_

what's up with that?

---

_**Assistant**_

The error you're seeing is because the configuration option `serverComponentsExternalPackages` is no longer valid in newer versions of Next.js. This option was used in earlier versions but has been replaced with a different configuration.

To fix this, you should use `transpilePackages` instead. Here's how to update your config:

```javascript:next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },

    // Replace serverComponentsExternalPackages with transpilePackages
    transpilePackages: ['mongoose', 'winston'],

    // ... existing code ...
};

module.exports = nextConfig;
```

This change reflects Next.js's current best practices for handling external packages that need to be transpiled for use in server components. The `transpilePackages` option serves the same purpose but is the currently supported way to handle these dependencies.

The functionality remains the same - it ensures that packages like mongoose and winston are properly handled in your Next.js application, just using the updated configuration syntax.

---



---

