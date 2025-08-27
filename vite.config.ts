import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import fs from 'fs';
import path from 'path';

const host = 'develop.fracttal.com';

let srcPath = 'instrumented/src';
if (
  !fs.existsSync(path.resolve(__dirname, srcPath)) &&
  fs.existsSync(path.resolve(__dirname, 'instrumented'))
) {
  srcPath = 'instrumented';
}


export default defineConfig(({ command, mode }) => {
  return {
    build: {
      outDir: 'build',
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
    optimizeDeps: {
      exclude: ['@zxing/library', 'immutable'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, srcPath),
      },
    },
    plugins: [
      react({
        include: '**/*.tsx',
      }),
      viteTsconfigPaths(),
      svgrPlugin(),
      federation({
        name: 'remote_app',
        filename: 'remoteEntry.js',
        exposes: {
          './FracttalAiButton': './src/layouts/FracttalAI/FracttalAI.tsx',
          // './FracttalAiMain': './src/view/Ai/Ai.tsx',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: false },
          'react-dom': { singleton: true, eager: true, requiredVersion: false },
          'react-redux': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          'react-router-dom': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          '@mui/material': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          '@mui/system': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          '@mui/icons-material': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          '@emotion/react': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          '@emotion/styled': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          '@mui/styles': {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
        },
      }),
    ],
    server: {
      hmr: {
        overlay: false,
      },
      open: true,
      port: 3000,
      fs: {
        allow: ['instrumented', '.'],
        strict: false,
      },
      proxy: {
        // with options
        '^/rpc/.*': {
          target: `https://${host}`,
          changeOrigin: true,
        },
        '^/oauth/.*': {
          target: `https://${host}`,
          changeOrigin: true,
        },
        // Proxying websockets or socket.io
        '/rpc/ws': {
          target: `wss://${host}`,
          ws: true,
        },
      },
    },
  };
});
