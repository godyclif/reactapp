import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "6ded384e-beae-4f7c-9e9a-4c440ffde870-00-ado7texje5fj.worf.replit.dev"
    ]
  }
});