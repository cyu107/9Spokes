const tailwind = require('tailwindcss');

module.exports = () => ({
  plugins: [
    require('postcss-import'),
    tailwind('./tailwind.config.js'),
    require('postcss-nested'),
    require('postcss-custom-properties'),
    require('autoprefixer'),
  ],
});
