'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/getScreenshot', controller.home.screenshot);
  router.get('/demo', controller.demo.index);
};
