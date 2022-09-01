const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                accent: {
                    background: {
                        light: "#AAAAAA",
                        dark: "#333333",
                    },
                    cardBackground: {
                        light: "#F0F0F0",
                        dark: "#555555",
                    }
                }
            },
        }
    },
    plugins: [],
}

