/** @type {import('next').NextConfig} */
const nextConfig = {
  // Each example is an independent app inside this repository.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname
};

module.exports = nextConfig;
