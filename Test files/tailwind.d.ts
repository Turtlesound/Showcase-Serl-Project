// src/types/tailwind.d.ts

import 'tailwindcss/tailwind-config';

declare module 'tailwindcss/tailwind-config' {
interface Theme {
    colors: {
    foreground: string;
    background: string;
    accent: string;
    'light-blue': string;
    'dark-blue': string;
    'gray-light': string;
      [key: string]: string; // Allow other colors as well
    };
}

  // Extend the existing Config interface
interface Config {
    content: string[];
    theme: {
    extend: {
        colors: Record<string, string>;
        maxWidth: Record<string, string>;
        typography: (theme: Theme) => any; 
    };
    };
    plugins?: any[];
}
}
