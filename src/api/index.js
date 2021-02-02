const Router = require('koa-router');

const api = new Router();
const posts = require('./posts');
const books = require('./books');

api.use('/posts', posts.routes());
api.use('/books', books.routes());

module.exports = api;
