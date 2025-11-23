import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'bebas': ['var(--font-bebas)', 'sans-serif'],
                'roboto': ['var(--font-roboto)', 'sans-serif'],
                'teko': ['var(--font-teko)', 'sans-serif'],
            },
            colors: {
                fb: {
                    navy: "#002d72",
                    yellow: "#f6eb16",
                    dark: "#001f4d",
                    light: "#fffa6e"
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
