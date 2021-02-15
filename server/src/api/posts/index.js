const Router = require('koa-router');
const posts = new Router();
const postsCtrl = require('./posts.controller');

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.read);
posts.delete('/:id', postsCtrl.remove);

module.exports = posts;
