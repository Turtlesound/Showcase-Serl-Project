import type { Config } from 'tailwindcss';


const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: '#3b82f6', // Main accent color
        'light-blue': '#bfdbfe', // Light blue for hover states
        'dark-blue': '#1e3a8a', // Dark blue for headers and footers
        'gray-light': '#f9fafb', // Light gray for backgrounds
      },
      maxWidth: {
        'screen-lg': '1024px', // Large screens
        'screen-xl': '1280px', // Extra large screens
        'screen-2xl': '1536px', // Extra extra large screens
        'full': '80%', // Full width
      },
      typography: (theme: (key: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            h1: {
              color: theme('colors.dark-blue'),
              fontWeight: 'bold',
            },
            h2: {
              color: theme('colors.dark-blue'),
            },
            a: {
              color: theme('colors.accent'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.light-blue'),
                textDecoration: 'none',
              },
            },
            strong: {
              fontWeight: '700',
            },
            kbd: {
              backgroundColor: theme('colors.gray.200'),
              borderRadius: '0.25rem',
              padding: '0.2rem 0.4rem',
              margin: '0',
              display: 'inline',
            },
            blockquote: {
              borderLeftColor: theme('colors.accent'),
              fontStyle: 'italic',
              color: theme('colors.gray.600'),
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              color: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
