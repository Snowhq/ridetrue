import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@solana-program/token-2022", "@solana-program/token", "@coinbase/wallet-sdk", "@base-org/account"],
};

export default nextConfig;
