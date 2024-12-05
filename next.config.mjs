/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push('bun:sqlite');
        return config;
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000'],
        }
    }
};

export default nextConfig;