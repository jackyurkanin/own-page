/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
      return [
        {
          source: "/api/py/:path*",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/api/py/:path*"
              : "/api/",
        },
      ];
    },
    images: {
      domains: ["apod.nasa.gov", "127.0.0.1", "openweathermap.org"], 
    },
    transpilePackages: ['three'],
  };
  

export default nextConfig;
