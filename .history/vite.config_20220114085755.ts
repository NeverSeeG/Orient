import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8989/OrientTDM',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        }
    },
    build: {
      target: 'modules',
      outDir: 'dist', //指定输出路径
      assetsDir: 'assets', // 指定生成静态资源的存放路径
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
