/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: '#DC2626', dark: '#991B1B', light: '#EF4444' },
                ink: { DEFAULT: '#000000', bg: '#111111', surface: '#1C1C1C', border: '#333333' },
                soft: '#F9FAFB',
                line: '#E5E7EB',
                muted: '#6B7280',
                darkmuted: '#A1A1AA',
            },
            fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
            boxShadow: { card: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05)' },
        },
    },
    plugins: [],
};
