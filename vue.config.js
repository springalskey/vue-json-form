const path = require('path');
const webpack = require('webpack');
const $env = require(path.resolve('./env/env.' + process.env.ZX_ENV + '.js'));

module.exports = {
  devServer: {
    open: true,
    hot: true,
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    overlay: {
      warnings: false,
      errors: false
    }
  },
  // 保存时不校验eslint
  lintOnSave: false,
  publicPath: $env.publicPath,
  productionSourceMap: process.env.ZX_ENV !== 'prod',
  configureWebpack: {
    performance: {
      hints: false
    },
    plugins: [
      new webpack.DefinePlugin({
        $ENV: JSON.stringify($env),
        'process.env.ZX_ENV': JSON.stringify(process.env.ZX_ENV)
      })
    ]
  }
};
