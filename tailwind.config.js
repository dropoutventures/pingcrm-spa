const defaultTheme = require('tailwindcss/defaultTheme')
const FormKitVariants = require('@formkit/themes/tailwindcss')

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          100: '#e6e8ff',
          300: '#b2b7ff',
          400: '#7886d7',
          500: '#6574cd',
          600: '#5661b3',
          800: '#2f365f',
          900: '#191e38',
        },
      },
      fontFamily: {
        sans: ['"Inter var"', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        // constant(safe-area-inset-top)
        "safe-top": "calc(var(--safe-area-inset-top, 0) + env(safe-area-inset-top, 0))",
        "safe-bottom": "calc(var(--safe-area-inset-bottom, 0) + env(safe-area-inset-bottom, 0))",
        "safe-left": "calc(var(--safe-area-inset-left, 0) + env(safe-area-inset-left, 0))",
        "safe-right": "calc(var(--safe-area-inset-right, 0) + env(safe-area-inset-right, 0))",
      },
      screens: {
        standalone: { raw: "(display-mode: standalone)" },
      },
    },
  },
  plugins: [
      FormKitVariants,
  ],
}
