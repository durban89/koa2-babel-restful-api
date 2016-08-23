'use strict';

//环境配置
process.chdir(__dirname);
process.env.NODE_CONFIG_DIR = __dirname + '/' + 'config';

const koa = require('koa');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const bunyanLogger = require('koa-bunyan-logger');
const logger = require('koa-logger');

let app = new koa();
let event = require('./routers/event');
app.proxy = true;

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

app.use(bodyParser());
app.use(compress());
app.use(logger());
app.use(bunyanLogger(config.logger));

app.use(event.routes());

app.listen(config.port);
console.log('The app listening ' + config.port);
module.exports = app;
