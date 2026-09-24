import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingExcludes: {
    "/*": ["./data/**/*", "./ACESSO-CRM.txt", "./.env*"],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
