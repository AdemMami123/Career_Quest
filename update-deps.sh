#!/bin/bash

# Install the required Tailwind PostCSS plugin
npm install --save-dev @tailwindcss/postcss

# Clean any potential cache issues
rm -rf node_modules/.vite-temp
rm -rf node_modules/.cache

# Restart the dev server
echo "Dependencies updated! Now run 'npm run dev' to start your development server."
