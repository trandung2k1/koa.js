const Router = require('@koa/router');
const AuthorController = require('../controllers/author.controller');
const router = new Router({
    prefix: '/api/authors',
});

router.get('/', AuthorController.getAuthors);
router.post('/', AuthorController.createAuthors);
router.get('/:id', AuthorController.getAnAuthor);
router.patch('/:id', AuthorController.updateAuthorById);
router.delete('/:id', AuthorController.deleteAuthorById);

module.exports = router;
