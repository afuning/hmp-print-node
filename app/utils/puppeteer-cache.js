'use strict';

class PuppeteerCache {
  constructor(app, opt) {
    this.appIns = app;
    this.name = JSON.stringify(opt);
  }

  async getCache() {
    if (this.appIns.cache.has(this.name)) {
      return await this.appIns.cache.get(this.name);
    }
    return null;
  }

  async setCache(base64) {
    await this.appIns.cache.set(this.name, base64);
  }
}

module.exports = PuppeteerCache;
