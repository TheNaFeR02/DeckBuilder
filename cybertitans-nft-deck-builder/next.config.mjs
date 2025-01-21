/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
            hostname: "img.daisyui.com"
        },
        {
            protocol: "https",
            hostname: "jy37vuigv8.ufs.sh",
            port: "",
            pathname: "/f/**",
            search: ""
        }
    ],
    }
};

export default nextConfig;
