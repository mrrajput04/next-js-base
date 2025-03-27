/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure Node.js runtime is used
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },

    // Replace serverComponentsExternalPackages with transpilePackages
    transpilePackages: ['mongoose', 'winston'],

    // Configure webpack to handle swagger-ui-dist assets
    webpack: (config, { dev, isServer }) => {
        if (!dev) {
            config.devtool = false;
        }
        return config;
    },

    // Configure headers to handle source map requests
    async headers() {
        return [
            {
                source: '/_next/static/css/:path*',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'text/css',
                    },
                ],
            },
        ];
    },

    // Remove output: 'export' if it exists
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig; 