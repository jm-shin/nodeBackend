const Router = require('koa-router');
const posts = new Router();

const info = ctx => {
  ctx.body = ctx;
};

posts.get('/', info);
posts.post('/', info);

module.exports = posts;
