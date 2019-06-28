const mongoose = require('mongoose')

const AccList = mongoose.model("AccList");
module.exports = async (ctx, next) => {
    let aggregate = null
    aggregate = await AccList.aggregate([
        {$match: {
            'openid':ctx.state.user.openid,
            '_id': mongoose.Types.ObjectId(ctx.request.body.id),
        }},
        {
            $project : {
                _id: '$_id',
                recordYear: '$recordYear',
                recordMonth: '$recordMonth',
                recordDay: '$recordDay',
                bookId: '$bookId',
                remark: '$remark',
                icon: '$icon',
                title: '$title',
                recordType: '$recordType',
                price: '$price'
            }
        }
        
    ]);

    ctx.body = { statusCode: 200, message: '获取记账详情', code: 1, data: aggregate[0]};
}
