const Router = require('@koa/router');
const BookController = require('../controllers/book.controller');
const router = new Router({
    prefix: '/api/books',
});

router.get('/', BookController.getBooks);
router.post('/', BookController.createBook);
router.get('/:id', BookController.getABook);
router.patch('/:id', BookController.updateBook);
router.delete('/:id', BookController.deleteBook);

module.exports = router;
