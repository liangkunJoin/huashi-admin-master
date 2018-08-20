'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webConfig = require('./webpack.web.config');

let hotMiddleware;

function startWeb () {
  return new Promise((resolve, reject) => {
    const compiler = webpack(webConfig);
    hotMiddleware = webpackHotMiddleware(compiler, {log: false, heartbeat: 2500});
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' });
        cb()
      })
    });
    const server = new WebpackDevServer(
      compiler,
      {
        contentBase: path.join(__dirname, '../'),
        quiet: false,
        setup (app, ctx) {
          app.use(hotMiddleware);
          ctx.middleware.waitUntilValid(() => {
            resolve()
          })
        },
        proxy:  {
        '/api': {
          target: 'http://127.0.0.1:18004',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '',
          },
        }
      },

      }
    );

    server.listen(8080)
  })
}

function init () {
  Promise.all([startWeb()]).then(() => {}).catch(err => {console.log(err)});
};

init();
