export default {
  assetsInclude: ["**/*.ttf"],
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      sourceMap: false,
    },
  },
};
