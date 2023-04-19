const Router = require('@koa/router');
const SiteController = require('../controllers/site.controller');
const router = new Router({});
router.get('/', SiteController.getHomePage);
router.get('/about', SiteController.getAboutPage);
module.exports = router;
