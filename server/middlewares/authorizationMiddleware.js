const jwt = require('jsonwebtoken') //创建token
const mongoose = require('mongoose')
const secret = 'appIdSessionId' //生成Token 的秘钥

export default async (ctx, next) => {
    let token = ctx.header.authorization.split(' ')[0]
    if (token) {
        try {
            let decoded = await jwt.verify(token, secret)
            ctx.body = { statusCode: 200, message: 'token验证成功', Token: user.token };
        } catch (err) {
            if (err) throw err;
        }
    }
    await next()
}