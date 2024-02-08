//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/file/attachment-download/:user_id*/:file_id*',
        destination: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_SERVER_URL}api/file/attachment-download/:user_id*/:file_id*`,
      },
    ];
  },
  nx: {
    svgr: true,
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
  redirects: async () => [{ source: '/', destination: '/user', permanent: true }],
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
