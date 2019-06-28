const request = require('request')
const mongoose = require('mongoose')
const config = require('../config.js')
const utils = require('../utils')

const User = mongoose.model("User");
module.exports = async (ctx, next) => {
    let user = ctx.state.userDoc
    
    if (ctx.request.body.recordType == 0) {
        user.payCategoryList = ctx.request.body.list
    } else if (ctx.request.body.recordType == 1){
        user.incomeCategoryList = ctx.request.body.list
    }
    await user.save()
    ctx.body = { statusCode: 200, message: '更新类别成功', code: 1};
}
