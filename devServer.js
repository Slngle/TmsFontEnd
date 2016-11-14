/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 *
 */

const
  webpack = require('webpack'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  webpackHotMiddleware = require('webpack-hot-middleware'),
  Express = require('express'),
  config = require('./webpack.config.dev'),
  compiler = webpack(config),
  app = new Express(),
  port = 3339;

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/demo/index.html`);
});
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.info('Listening on port http://localhost:%s', port);
  }
});
