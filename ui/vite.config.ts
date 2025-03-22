import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (!env.UI_PORT) {
    console.error('ERROR: UI_PORT environment variable is required in .env file')
    process.exit(1)
  }

  const UI_PORT = parseInt(env.VITE_UI_PORT, 10)

  return {
    plugins: [vue()],
    server: {
      port: UI_PORT
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})

