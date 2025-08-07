const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react-swc");
const path = require("path");

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Configurações de build otimizadas
  build: {
    target: "es2020",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      // Removendo a configuração de manualChunks para simplificar o build
    },
  },

  // Configurações de servidor de desenvolvimento
  server: {
    port: 5173,
    host: true,
    open: true,
  },

  // Configurações de preview
  preview: {
    port: 4173,
    host: true,
  },

  // Configurações de dependências
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "sonner",
      "lucide-react",
    ],
    dedupe: ["react", "react-dom"],
  },
});