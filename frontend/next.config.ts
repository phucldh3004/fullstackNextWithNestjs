import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Fix Turbopack root directory issue
  turbopack: {
    root: __dirname
  },

  // Proxy API requests to backend
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: process.env.NEXT_PUBLIC_API_URL
  //         ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
  //         : 'http://localhost:3001/:path*', // Fallback to local backend
  //     },
  //   ];
  // },

  async rewrites() {
    return [
      // {
      //   source: "/api/:path*",
      //   destination: "https://fullstacknextwithnestjs.onrender.com/:path*"
      // }
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*"
      }
    ]
  },

  // Optional: Handle CORS in development
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ]
  }
}

export default nextConfig

