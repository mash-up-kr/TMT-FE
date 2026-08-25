import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(apiBaseUrl ? [new URL("/**", apiBaseUrl)] : []),
      new URL("https://picsum.photos/**"),
    ],
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
