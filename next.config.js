/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracing: false,
    },
    images: {
        domains: [
            'images.unsplash.com',
            'ui-avatars.com',
            'randomuser.me',
            'a0.muscache.com',
            'a1.muscache.com',
            'a2.muscache.com',
            'images.airbnb.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            }
        ]
    },
    // webpack: (config, { isServer }) => {
    //     if (isServer) {
    //         // Adiciona pacotes que só devem ser bundled no servidor
    //         config.externals = [...config.externals, 'puppeteer-core', '@sparticuz/chromium'];
    //     }
    //     return config;
    // }
}

module.exports = nextConfig 