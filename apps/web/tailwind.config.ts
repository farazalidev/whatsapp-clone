import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**',
    'apps/web/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: {
            input_bg: '#F0F2F5',
            placeholder_text: '#84919A',
            primary_bg: '#FFFFFF',
            secondary_bg: '#F0F2F5',
            text: '#000',
          },
          dark: {
            input_bg: '#202C33',
            placeholder_text: 'rgba(255, 255, 255, 0.5)',
            primary_bg: '#111B21',
            secondary_bg: '#222E35',
            text: '#fff',
          },
          default: {
            primary_green: '#00a884',
          },
        },
      },

      container: {
        center: true,
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },

  plugins: [],
};
export default config;
