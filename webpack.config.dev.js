/**
 *
 *
 * 
 *
 */

const
  path = require('path'),
  webpack = require('webpack'),
  precss = require('precss'),
  autoprefixer = require('autoprefixer'),
  postcssFor = require('postcss-for');

module.exports = {
  devtool: 'cheap-module-eval-source-map', //设置合并后可查看原文件
  entry: [
    'webpack-hot-middleware/client',
    './src/js/app'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'], // 当requrie的模块找不到时，添加这些后缀
    alias: {
      actionType: path.resolve(__dirname, './src/js/actions/ActionType'),
      dispatch: path.resolve(__dirname, './src/js/dispatcher/AppDispatcher'),
      mixin: path.resolve(__dirname,'./src/js/mixin'),
      lib: path.resolve(__dirname,'./src/js/lib'),
      mixinComponents: path.resolve(__dirname,'./src/js/mixin-components'),
      components: path.resolve(__dirname,'./src/js/components'),
      AppStores:path.resolve(__dirname,'./src/js/stores/AppStores'),
      AppActions:path.resolve(__dirname,'./src/js/actions/AppActions')
    },
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  plugins: [
    
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEBUG: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /[^_]\.css$/,
        loaders: ['style', 'css','postcss'],
        include: __dirname
      },
      {
        test: /_\.css$/,
        loaders: ['style', 'css?modules&localIdentName=[local]__[name]_[hash:base64:5]', 'postcss','sass'],
        include: __dirname
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        loader: 'url-loader?limit=10240',
        include: __dirname
      }
    ]
  },
  postcss: () => {
    const ret = [precss, autoprefixer, postcssFor];
    return ret;
  }
};
