/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        MONGODB_URI: process.env.MONGODB_URI,
        SIGNING_SECRET: process.env.Signing_Secret,
        
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['via.placeholder.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
    },
    experimental: {
        serverActions: {
            allowedOrigins: [
                'localhost:3000',
                'trupti-mauve.vercel.app',
                'trupti-git-master-arjavs-projects-8d0c162c.vercel.app',
                'trupti-7fiyastni-arjavs-projects-8d0c162c.vercel.app'
            ],
            bodySizeLimit: '2mb'
        }
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    },
};

export default nextConfig;