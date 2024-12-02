/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push('bun:sqlite');
        return config;
    },
    experimental: {
        serverActions: {
            // Make it to work in codespace
            allowedOrigins: ['*.app.github.dev','localhost:3000'],
        }
    }
};

export default nextConfig;