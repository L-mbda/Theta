/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push('bun:sqlite');
        return config;
    },
    experimental: {
        serverActions: {
            // Make it to work in codespace
            allowedOrigins: ['localhost:3000'],
        }
    }
};

export default nextConfig;