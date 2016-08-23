'use strict';

//环境配置
process.chdir(__dirname);
process.env.NODE_CONFIG_DIR = __dirname + '/' + 'config';

const fs = require('fs');

const koa = require('koa');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const bunyanLogger = require('koa-bunyan-logger');
const logger = require('koa-logger');
const mysql = require('./middleware/mysql');
const app = new koa();

//全局错误处理
app.use(async(ctx, next) => {
  try {
    await next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    ctx.body = {
      error: err.message,
      status: false,
      data: {}
    };
  }
});

app.proxy = true;
app.use(bodyParser());
app.use(compress());
app.use(logger());
app.use(bunyanLogger(config.logger));
app.use(mysql(config.mysql));

(function loadRoutes() {
  let _path = './routers';
  let files = fs.readdirSync(_path);
  files = files.filter(function (f) {
    return /[^\.].*\.js$/.test(f);
  });

  files.forEach(function (f) {
    let router = require([_path, f].join('/'));
    app.use(router.routes());
  });
})();

app.listen(config.port);
console.log('The app listening ' + config.port);
module.exports = app;
