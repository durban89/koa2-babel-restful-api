'use strict';

//环境配置
process.chdir(__dirname);
process.env.NODE_CONFIG_DIR = __dirname + '/' + 'config';

const koa = require('koa');
const config = require('config');

let app = new koa();
let event = require('./routers/event');
app.proxy = true;

app.use((ctx, next) => {
  ctx.body = 'Hello World!';
})

app.use(event.routes());

app.listen(config.port);
console.log('The app listening ' + config.port);
module.exports = app;
