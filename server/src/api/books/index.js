const Router = require('koa-router');
const books = new Router();
const booksCtrl = require('./books.controller');

books.post('/', booksCtrl.create);
books.get('/', booksCtrl.list);
books.get('/:id', booksCtrl.get);
books.delete('/:id', booksCtrl.remove);
books.put('/:id', booksCtrl.replace);
books.patch('/:id', booksCtrl.update);

module.exports = books;
