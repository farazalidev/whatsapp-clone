//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: 'res.cloudinary.com', protocol: 'https' }],
  },
  nx: {
    svgr: true,
  },
  reactStrictMode: false,

  serverRuntimeConfig: {
    CLOUDINARY_NAME: 'dqgmwfomj',
    CLOUDINARY_API_KEY: '779485947724676',
    CLOUDINARY_API_SECRET: 'hWyKzST_hL_cI2iodFlqHpoX1-M',
  },
  redirects: async () => [{ source: '/', destination: '/user', permanent: true }],
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
