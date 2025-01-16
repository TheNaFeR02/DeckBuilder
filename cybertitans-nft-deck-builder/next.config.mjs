/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
            hostname: "img.daisyui.com"
        },
        {
            hostname: "jy37vuigv8.ufs.sh",
        }
    ]
    }
};

export default nextConfig;
