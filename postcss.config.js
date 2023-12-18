const mode = process.env.NODE_ENV;
const dev = mode === 'development';

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: dev ? false : { preset: 'default' }
  }
};
