'use strcit';

const fs = require('fs');
const env = process.env.NODE_ENV;

module.exports = {
  "port": "3034",
  "logger": {
    "name": "qeeniao-event",
    "streams": [{
      "level": "info",
      "type": "rotating-file",
      "path": env != 'production' ? "log/server.log" : `log/${process.pid}-server.log`,
      "period": "1d",
      "count": 2 // keep 2 back copies
    }]
  },
  "mysql": {
    master: [{
      host: '127.0.0.1',
      user: 'root',
      port: 3306,
      password: '123456',
      database: 'statistics',
      connectionLimit: 10,
      queueLimit: 10000,
      acquireTimeout: 5000,
    }, ],
    slave: [{
      host: '127.0.0.1',
      user: 'root',
      port: 3306,
      password: '123456',
      database: 'statistics',
      connectionLimit: 10,
      queueLimit: 10000,
      acquireTimeout: 5000,
    }, ],
    prefix: '',
  }
}
