// PostCSS configuration
// Tailwind CSS and Autoprefixer are required for processing Tailwind directives
// and adding vendor prefixes for browser compatibility.
export default {
  plugins: {
    tailwindcss: {},    // Process @tailwind directives in CSS files
    autoprefixer: {},   // Automatically add vendor prefixes (e.g., -webkit-)
  },
}
