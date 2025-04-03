/** @type {import('next').NextConfig} */
const nextConfig = {
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
    }
}

module.exports = nextConfig 