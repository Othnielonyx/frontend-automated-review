// postcss.config.cjs
module.exports = {
  plugins: [
    require('tailwindcss'),  // Add Tailwind CSS as a PostCSS plugin
    require('autoprefixer')   // Optional, adds vendor prefixes
  ],
};
