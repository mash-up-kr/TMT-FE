import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/nearby/:path*",
        destination: "/feed/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: { dimensions: false },
          },
        ],
        as: "*.js",
        condition: { query: /react/ },
      },
    },
  },
};

export default nextConfig;
