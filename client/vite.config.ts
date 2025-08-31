import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import generouted from "@generouted/react-router/plugin"

export default defineConfig({
  plugins: [react(), tailwindcss(), generouted()],
})
