const mongoose = require('mongoose')
const AccList = mongoose.model("AccList");

module.exports = async (ctx, next) => {
    let recordYear = ctx.request.body.recordYear
    let recordMonth = ctx.request.body.recordMonth
    let bookId = ctx.request.body.bookId || ''
    
    let aggregate = null
    if (recordMonth) {
        aggregate = AccList.aggregate([
            {   $match: { 
                    'openid':ctx.state.user.openid,
                    'recordYear': recordYear,
                    'recordMonth': recordMonth,
                    'isDeleted': 0
                } 
            }, 
            {   $sort : { 'recordDay': 1} },
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
        aggregate = aggregate.group({
            '_id': '$recordDay', 
            'payAmount': { $sum: "$payAmount" },
            'incomeAmount': { $sum: "$incomeAmount" },
            "content": { 
                $push: { 
                    _id: "$_id",
                    icon: "$icon", 
                    title: "$title" , 
                    price: '$price',
                    recordType: '$recordType',
                    bookId: '$bookId',
                    remark: '$remark'
                }
            }
        }).sort({'_id': -1})

        let data = await aggregate.exec()

        ctx.body = { statusCode: 200, message: '获取记账列表成功', data: {
            categoryList: data
        }};
    } else {
        // aggregate = await AccList.aggregate([
        //     {$match: {'openid':ctx.state.user.openid}},
        //     // {$unwind: '$accountingList'},
        //     { $match:
        //         { 
        //             'recordYear': recordYear,
        //         } 
        //     }, 
        //     {
        //         $group: {
        //             '_id': '$recordMonth', 
        //             "content": { 
        //                 // $push: '$accountingList'
        //             }
        //         }
        //     }
        // ])
    }
}
