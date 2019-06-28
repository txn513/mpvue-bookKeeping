const request = require('request')
const mongoose = require('mongoose')
const config = require('../config.js')

const User = mongoose.model("User");
const AccList = mongoose.model("AccList");
module.exports = async (ctx, next) => {
    let recordYear = ctx.request.body.recordYear
    let recordMonth = ctx.request.body.recordMonth
    let bookId = ctx.request.body.bookId || ''
    
    let aggregate = null
    
    if (recordMonth) {
        aggregate = AccList.aggregate([
            { $match:
                { 
                    'openid':ctx.state.user.openid,
                    'recordYear': recordYear,
                    'recordMonth': recordMonth,
                    'isDeleted': 0
                } 
            }, 
            {
                $addFields: {
                    "payAmount" : {$cond: { if: { $eq: [ "$recordType", 0 ] }, then: "$price", else: 0 }},
                    "incomeAmount" : {$cond: { if: { $eq: [ "$recordType", 1 ] }, then: "$price", else: 0 }}
                }
            }
        ])
        if (bookId !== 'all') {
            aggregate = aggregate.match({ 'bookId': bookId})
        } 

        aggregate = await aggregate.group({
            '_id': null,
            'payAmount': { $sum: "$payAmount" },
            'incomeAmount': { $sum: "$incomeAmount" },
        })
    } else {
        aggregate = AccList.aggregate([
            { $match:
                { 
                    'openid':ctx.state.user.openid,
                    'recordYear': recordYear,
                    'isDeleted': 0
                } 
            }, 
            {
                $addFields: {
                    "payAmount" : {$cond: { if: { $eq: [ "$recordType", 0 ] }, then: "$price", else: 0 }},
                    "incomeAmount" : {$cond: { if: { $eq: [ "$recordType", 1 ] }, then: "$price", else: 0 }}
                }
            }
        ])

        if (bookId !== 'all') {
            aggregate = aggregate.match({ 'bookId': bookId})
        } 

        aggregate = await aggregate.group({
            '_id': null,
            'payAmount': { $sum: "$payAmount" },
            'incomeAmount': { $sum: "$incomeAmount" },
        })
    }

    ctx.body = { statusCode: 200, message: '获取记账总和成功', data: aggregate[0]};
}
