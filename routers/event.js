'use strict';

let Router = require('koa-router');
let event = new Router();
import EventController from '../controllers/EventController';


event.get('/stat', EventController.stat);

module.exports = event;