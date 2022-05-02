// vue.config.js
module.exports = {
  /**
   * Modify the path of loading file (js, css) in header
   * if no publicPath: './'  --- /css/xxx.css   /js/xxx.js
   * has publicPath: './'   --- css/xxx.css   js/xxx.js
   */
  publicPath: './',
  css: {
    loaderOptions: {
      // @/ 是 src/ 的别名

      // 给 sass-loader 传递选项
      // sass: {
      //   // 这里假设你有 `src/variables.sass` 这个文件
      //   // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
      //   additionalData: `@import "~@/variables.sass"`
      // },

      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "~@/assets/css/variables.scss";`
      },
      // 给 less-loader 传递 Less.js 相关选项
      // less:{
      //   // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
      //   // `primary` is global variables fields name
      //   globalVars: {
      //     primary: '#fff'
      //   }
      // }
    }
  },
  devServer: {
    // API代理
    proxy: {
      '^/api': {
        target: 'http://10.86.5.107:8080',
        ws: true,
        changeOrigin: true    // CROS
      }
    }
  }
}
