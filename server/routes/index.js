const Router = require('koa-router')
const loginController = require('../controllers/login.js')

let router = new Router()
// 登录接口
router.get('/login', loginController)

module.exports = router