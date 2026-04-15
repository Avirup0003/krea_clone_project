import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
theme: {
    extend: {
fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        'krea-1': '4px',
        'krea-2': '8px',
        'krea-3': '12px',
        'krea-4': '16px',
        'krea-5': '24px',
        'krea-6': '32px',
        'krea-7': '48px',
      },
      colors: {
        krea: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        slate: {
          900: '#0f0f23',
          950: '#020617',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#A855F7',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1a1a2e',
          foreground: '#E2E8F0',
        },
        border: '#334155',
        ring: 'hsl(262.1 83.3% 57.8%)',
      },
      borderRadius: {
        'krea': '12px',
        'krea-lg': '20px',
        'krea-xl': '24px',
      },
      boxShadow: {
        'krea-glow': '0 0 20px 0 rgba(168, 85, 247, 0.5)',
        'krea-glow-lg': '0 0 30px 0 rgba(168, 85, 247, 0.4), 0 0 60px 0 rgba(168, 85, 247, 0.2)',
        'krea-inset': 'inset 0 0 20px rgba(168, 85, 247, 0.1)',
        "neon-purple": "0 0 10px #8b5cf640, 0 0 25px #8b5cf625, 0 0 50px #8b5cf610",
      },
      animation: {
        'krea-pulse': 'krea-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'krea-bounce': 'krea-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'krea-float': 'krea-float 6s ease-in-out infinite',
        pulsate: "pulsate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "rainbow-shift": "rainbow-shift 3s ease-in-out infinite",
        "particle-float": "particle-float 6s ease-in-out infinite",
        "tilt-3d": "tilt-3d 0.3s ease-out",
        wave: "wave 2s ease-in-out infinite",
        "bounce-glow": "bounce-glow 1.5s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        'krea-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 1px 0 rgba(168, 85, 247, 0.4), 0 0 20px 0 rgba(168, 85, 247, 0.2), 0 0 40px 0 rgba(168, 85, 247, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 10px 0 rgba(168, 85, 247, 0.8), 0 0 30px 0 rgba(168, 85, 247, 0.5), 0 0 60px 0 rgba(168, 85, 247, 0.3)' 
          },
        },
        'krea-bounce': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1.05)' },
        },
        'krea-float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-15px) translateX(10px)' },
        },
        pulsate: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
        "rainbow-shift": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "particle-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)", opacity: "0.7" },
          "33%": { transform: "translateY(-20px) rotate(120deg)", opacity: "1" },
          "66%": { transform: "translateY(-10px) rotate(240deg)", opacity: "0.8" },
        },
        "tilt-3d": {
          "0%": { transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)" },
          "100%": { transform: "perspective(1000px) rotateX(5deg) rotateY(5deg)" },
        },
        wave: {
          "0%, 100%": { transform: "translateX(0%) skew(0deg, 0deg)" },
          "50%": { transform: "translateX(10%) skew(1deg, 2deg)" },
        },
        "bounce-glow": {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
          "60%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [animate],
};
export default config;

