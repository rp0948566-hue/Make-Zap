import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/Agent Company/**', '**/clone_of_the_website_shown_in_the_image_otmtyq/**']
    }
  }
});
