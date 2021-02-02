const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

router.use('/api', api.routes());

router.get('/', (ctx, next) => {
  ctx.body = 'Hello World!';
  next();
});

router.get('/genius/:who', ctx => {
  const { who } = ctx.params;
  const { age } = ctx.query;
  let string = who ? `Yes, ${who} is genius!` : 'I am Genius';
  string += age ? ` and I am ${age}` : '';
  ctx.body = string;
});

app.use(router.routes());

app.listen(4002, () => {
  console.log('Koa is listening to port 4002');
});
