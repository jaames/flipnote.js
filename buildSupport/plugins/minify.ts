import terser from '@rollup/plugin-terser';

export const minify = () => terser({
  ecma: 2020,
  compress: {
    passes: 2,
    module: true,
    unsafe_symbols: true,
    unsafe_methods: true,
    keep_infinity: true,
  },
  format: {
    comments(node, comment) {
      if (comment.type === 'comment2')
        return /\!\!/i.test(comment.value);
      return false;
    }
  },
  mangle: {
    keep_classnames: true
  }
  
});