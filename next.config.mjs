/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: "images.pexels.com" }
        ],
    },
    reactStrictMode: true,
    swcMinify: true,
};

export default nextConfig;
