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
   autoprefixer = require('autoprefixer');

 module.exports = {
   devtool: false,
   entry: {
     bundle: './src/js/app'
   },
  resolve: {
    extensions: ['', '.js', '.jsx'], // 当requrie的模块找不到时，添加这些后缀
    alias: {
      actionType: path.resolve(__dirname, './src/js/actions/ActionType'),
      dispatch: path.resolve(__dirname, './src/js/dispatcher/AppDispatcher'),
      mixin: path.resolve(__dirname,'./src/js/mixin'),
      lib: path.resolve(__dirname,'./src/js/lib'),
      mixinComponents: path.resolve(__dirname,'./src/js/mixinComponents'),
      components: path.resolve(__dirname,'./src/js/components'),
      AppStores:path.resolve(__dirname,'./src/js/stores/AppStores'),
      AppActions:path.resolve(__dirname,'./src/js/actions/AppActions')
    },
  },
   output: {
     path: path.join(__dirname, './build'),
     filename: 'bundle.js',
     publicPath: './build/'
   },
   plugins: [
     new webpack.optimize.OccurrenceOrderPlugin(),
     new webpack.DefinePlugin({
       'process.env': {
         NODE_ENV: JSON.stringify('production')
       },
       DEBUG: false
     }),
     new webpack.optimize.UglifyJsPlugin({
       compressor: { warnings: false },
       output: { comments: false }
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
         test: /.css$/,
         loaders: ['style', 'css', 'postcss'],
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
     const ret = [precss, autoprefixer];
     return ret;
   }
 };
