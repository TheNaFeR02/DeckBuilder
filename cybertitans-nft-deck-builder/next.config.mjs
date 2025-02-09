/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
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
        },
        {
            protocol: "https",
            hostname: "dex-bin.bnbstatic.com",
            pathname: "/static/dapp-uploads/1lalKyaw4nxafPLQMCRzC"
        }
    ],
    },
};

export default nextConfig;
