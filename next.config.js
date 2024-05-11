/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
}

module.exports = {
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    }
}

module.exports = nextConfig
