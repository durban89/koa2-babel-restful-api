/**
 * Created by durban on 16/8/23.
 */
const mysql = require('mysql');


module.exports = (settings) => {
  let __Instance = null;

  const _defaultConfig = {
    connectionLimit: 10,
    acquireTimeout: 1000,  // 获取链接(排队)超时 1s
    queueLimit: 20,
    host: '',
    user: '',
    password: '',
    supportBigNumbers: true,
    bigNumberStrings: true
  };

  const _QUERY_TIMEOUT = 2000; // 2s

  __Instance = mysql.createPoolCluster({
    removeNodeErrorCount: 50,
    restoreNodeTimeout: 5, // 错误到达阈值后,屏蔽5ms,而不是直接踢下线 (node-mysql 发现节点数为0后不尝试重启节点,而是直接返回没有节点的错误)
    canRetry: false // 目前master,slave都各只有一个node,如果允许retry,第二次尝试的时候,发现之前节点被下线,只返回"POOL_NOEXIST",拿不到pool.getConnection()出错的信息
  });

  settings.master.forEach((c) => {
    __Instance.add('MASTER', Object.assign({}, _defaultConfig, c));
  });

  settings.slave.forEach((c, i) => {
    __Instance.add(`SLAVE${i}`, Object.assign({}, _defaultConfig, c));
  });

  const _extendError = (err, sql) => {
    err.sql = (sql || '').length > 50 ? sql.substr(0, 50) + '...' : sql;
  };

  const getConnection = (node) => {
    return new Promise(function (resolve, reject) {
      __Instance.getConnection(node, (err, conn) => {
        if (err) {
          return reject(err);
        }
        resolve(conn);
      })
    });
  };

  const query = (conn, queryObj) => {
    return new Promise((resolve, reject) => {
      conn.query(queryObj, (err, res) => {
        if (err) {
          _extendError(err, queryObj.sql);
          return reject(err);
        }
        resolve(res);
      });
    });
  };

  return async (ctx, next) => {
    ctx.mysqlQuery = async (node, queryObj) => {
      if ('object' === typeof node) {
        queryObj = node;
        node = (/^select /i.test(queryObj.sql)) ? 'SLAVE*' : 'MASTER';
      }
      queryObj = Object.assign({timeout: _QUERY_TIMEOUT}, queryObj);
      let res = null;
      let conn = null;
      ctx.logger.info({tag: 'sql-pre', data: queryObj});
      try {
        let begin = +(new Date());
        conn = await getConnection(node);
        res = await query(conn, queryObj);
        ctx.logger.info({tag: 'sql', data: queryObj, rt: (new Date()) - begin});
      } catch (e) {
        _extendError(e, queryObj.sql);
        throw e;
      } finally{
        conn.release();
      }
      return res;
    };


    ctx.escape = mysql.escape;

    await next();
  }
};