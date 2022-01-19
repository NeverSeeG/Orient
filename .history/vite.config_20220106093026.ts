import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
    plugins: [vue()],
    base: "/dist/",
    build:{
      rollupOptions:{
        input:'src/views/home/index.html'
      }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080/CheckTDM',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    css: {
        //css预处理
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/scss/index.scss";`
            }
        }
    }
})
