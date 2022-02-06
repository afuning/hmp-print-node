'use strict';
const Controller = require('egg').Controller;

class DemoController extends Controller {
  async index() {
    const {
      ctx,
    } = this;
    await ctx.render('demo.html');
  }
}

module.exports = DemoController;
