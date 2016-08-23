'use strict';

class EventController {
  static stat(ctx, next){
    ctx.log.info({'tag':'mysql-error'});
    ctx.throw(401, '访问受限制', { user: 'dapeng' });

    return ctx.body = {
      'message':'ok'
    };
  }
}

export default EventController;
