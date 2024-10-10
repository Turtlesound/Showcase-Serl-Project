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
        accent: '#3b82f6', // You can add more colors as needed
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            a: {
              color: theme('colors.accent'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.accent'),
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
              display: 'inline', // Ensures it behaves like an inline element
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
            // Other styles...
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
