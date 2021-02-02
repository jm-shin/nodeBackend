const Router = require('koa-router');
const books = new Router();
const booksCtrl = require('./books.controller');

books.post('/', booksCtrl.create);

module.exports = books;
