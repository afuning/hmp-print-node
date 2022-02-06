'use strict';
const initPuppeteerPool = require('../utils/puppeteer-pool');
const PuppeteerCache = require('../utils/puppeteer-cache');
const Controller = require('egg').Controller;
global.pp = initPuppeteerPool({
  puppeteerArgs: {
    headless: true,
    slowMo: 0,
    args: [
      '--no-zygote',
      '--no-sandbox',
      '--disable-gpu',
      '--no-first-run',
      '--single-process',
      '--disable-extensions',
      '--disable-xss-auditor',
      '--disable-dev-shm-usage',
      '--disable-popup-blocking',
      '--disable-setuid-sandbox',
      '--disable-accelerated-2d-canvas',
      '--enable-features=NetworkService',
    ],
  },
});
const createRule = {
  width: { type: 'string', required: false },
  height: { type: 'string', required: false },
  url: { type: 'string', required: true },
  ele: { type: 'string', required: false },
  waitTime: { type: 'number', required: false },
};
const waitTime = n => new Promise(r => setTimeout(r, n));
class HomeController extends Controller {
  async screenshot() {
    const { app, ctx } = this;
    const opt = ctx.request.query;
    // 校验参数
    ctx.validate(createRule, opt);
    // 根据参数获取缓存
    const puppeteerCacheIns = new PuppeteerCache(app, opt);
    let base64 = await puppeteerCacheIns.getCache();
    // 不存在则走主流程
    if (!base64) {
      const browser = await global.pp.use();
      const page = await browser.newPage();
      await page.goto(opt.url);
      await page.setViewport({
        width: Number(opt.width),
        height: Number(opt.height),
      });

      await waitTime(opt.waitTime || 0);
      const ele = await page.$(opt.ele);
      base64 = await ele.screenshot({
        fullPage: false,
        omitBackground: true,
        encoding: 'base64',
      });
      await page.close();

      // 将图片上传oss，暂时不做
      // 缓存
      await puppeteerCacheIns.setCache(base64);
    }
    ctx.body = {
      data: 'data:image/png;base64,' + base64,
    };
    ctx.status = 200;
  }
}

module.exports = HomeController;
