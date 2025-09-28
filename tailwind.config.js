/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: Tells Tailwind where to scan for class names
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3B82F6', // Main button/heading color
        'secondary-cyan': '#22D3EE', // Lighter accent/background
        'light-bg': '#F8FAFC', // Very light background
        'text-dark': '#1F2937', // Dark text
        'text-light': '#6B7280', // Subtle text
        'accent-green': '#10B981', // For chat buttons
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        // Placeholder for a subtle background image if needed
        'stethoscope-pattern': "url('https://placehold.co/1000x500/F0F9FF/5EEAD4?text=Stethoscope+Pattern')",
      }
    },
  },
  // Ensure the plugins array is present, even if empty
  plugins: [],
}
