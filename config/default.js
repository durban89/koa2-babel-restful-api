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
      host: 'rdskd0b9r75wm0r8ode2.mysql.rds.aliyuncs.com',
      user: 'qeeniao',
      port: 3306,
      password: 'qeeniao1qaz',
      database: 'qeeniao_statistics',
      connectionLimit: 10,
      queueLimit: 10000,
      acquireTimeout: 5000,
    }, ],
    slave: [{
      host: 'rdskd0b9r75wm0r8ode2.mysql.rds.aliyuncs.com',
      user: 'qeeniao',
      port: 3306,
      password: 'qeeniao1qaz',
      database: 'qeeniao_statistics',
      connectionLimit: 10,
      queueLimit: 10000,
      acquireTimeout: 5000,
    }, ],
    prefix: '',
  }
}
