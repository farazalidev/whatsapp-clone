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
      boxShadow: {},
      backgroundImage: {
        pattern: "url('/pattern.png')",
        pattern_light: "url('/pattern-light.png')",
        transparent_bg: "url('/placeholders/transparent bg.png')",
      },
      colors: {
        whatsapp: {
          light: {
            input_bg: '#F0F2F5',
            placeholder_text: '#84919A',
            primary_bg: '#FFFFFF',
            secondary_bg: '#F0F2F5',
            text: '#000',
            bg: '#E0E0DD',
            sender_bg: '#F0F2F5',
            secondary_gray: '#F0F2F5',
          },
          dark: {
            input_bg: '#202C33',
            placeholder_text: 'rgba(255, 255, 255, 0.5)',
            primary_bg: '#111B21',
            secondary_bg: '#222E35',
            text: '#fff',
            bg: '#0b141a',
            sender_bg: '#202C33',
          },
          default: {
            primary_green: '#00a884',
          },
          misc: {
            scrollbar_dark: '#374045',
            scrollbar_light: '#CED0D1',
            link: '#53bdeb',
            sideBarOverlayHeaderLightBg: '#008069',
            message_input: '#2A3942',
            my_message_bg_dark: '#005C4B',
            my_message_bg_light: '#D9FDD3',
            other_message_bg_dark: '#202C33',
            other_message_bg_light: '#FFFFFF',
            attachment_bg_hover: '#374248',
            attachment_bg_hover_light: '#D9DBDF',
            whatsapp_primary_green_light: '#00A884',
            delete_red: '#F15C6D',
            playerBg: '#3B4A54',
            device_not_found_modal_bg: '#3B4A54',
          },
        },
      },

      container: {
        center: true,
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1580px',
        },
      },
    },
  },

  plugins: [],
};
export default config;
