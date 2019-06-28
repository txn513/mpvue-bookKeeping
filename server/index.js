const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')
const path = require('path')
const cors = require('koa2-cors')
const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const jwtKoa = require('koa-jwt') //验证token
const jwt = require('jsonwebtoken') //创建token
const mongoose = require('mongoose')
const models = path.join(__dirname, './models');
const secret = 'appIdSessionId' //生成Token 的秘钥
let router = new Router();


// 遍历 models 并引入
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(path.join(models, file)));

// 引入自定义中间件
const userCheck = require('./middlewares/userCheck')
const errorCatch = require('./middlewares/errorCatch')

// 错误统一处理
app.use(errorCatch);

app.use(bodyParser())

//全局路由除了path 以外都需要携带token去请求
app.use(jwtKoa({secret:secret}).unless({
  path: [/\/user\/login/] 
}))

app.use(userCheck)
// 引入路由分发
let userRoutes = require('./routes')
let addAccountingRoutes = require('./routes/accounting.js')
router.use('/user',userRoutes.routes())
router.use('/accounting',addAccountingRoutes.routes())

app.use(router.routes())
app.use(router.allowedMethods())


app.on('error', function(err){
	console.log('errorEmiter',err);
})


// 连接 mongoDB
connect()
function connect() {
    mongoose.connection
      .on('error', console.log)
      .on('disconnected', connect)
      .once('open', ()=> {
        app.listen(5000, () => console.log('[Server] starting at port 5000'))
      });
    return mongoose.connect('mongodb://localhost:27017/bookkeepingDemo', { useNewUrlParser: true });
    // return mongoose.connect('mongodb://test:test@localhost:27017/bookkeepingDemo', { useNewUrlParser: true });
  }
