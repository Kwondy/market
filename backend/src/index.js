require('dotenv').config();
const {
  PORT: port,
  MONGO_URI: mongoURI
} = process.env;

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const websockify = require('koa-websocket');

const db = require('./db');

const api = require('./api');
const jwtMiddleware = require('./lib/middlewares/jwt');
const cache = require('./lib/cache');
const ws = require('./ws');

db.connect();
const app = websockify(new Koa());

app.use(compress());

app.use(jwtMiddleware);
app.use(bodyParser());

const router = new Router();
router.use('/api', api.routes());

app.use(router.routes());
app.use(router.allowedMethods());
app.ws.use(ws.routes()).use(ws.allowedMethods());

app.listen(port, () => {
  console.log(`coinmarket server is listening to port ${port}`);
});
