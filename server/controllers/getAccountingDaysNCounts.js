const mongoose = require('mongoose')
const moment = require('moment')

const AccList = mongoose.model("AccList");

let days = 0;
module.exports = async (ctx, next) => {
    let todayDate = moment()

    let aggregate = await AccList.aggregate([
        {$match: {'openid':ctx.state.user.openid, 'isDeleted': 0}},
        { $sort : { 'createAt': 1} }
    ])
    if (aggregate && aggregate.length > 0) {
       days = todayDate.diff(aggregate[0].createAt, 'days') + 1

       return ctx.body = { statusCode: 200, message: '获取记账天数成功', code: 1, data: {
            days: days,
            counts: aggregate.length
        }};
    }
    
    ctx.body = { statusCode: 200, message: '获取记账天数成功', code: 1, data: {
        days: 0,
        counts: 0
    }};
}
