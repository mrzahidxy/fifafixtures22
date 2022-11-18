/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

}

module.exports = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ]
  },
}


module.exports = nextConfig
