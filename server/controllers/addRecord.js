const mongoose = require('mongoose')

const AccList = mongoose.model("AccList");
module.exports = async (ctx, next) => {
    let _id = ctx.request.body._id
    
    if (_id) {
        let res = await AccList.update(
            {'_id': _id},
            {'$set': {
                'recordYear': ctx.request.body.recordYear,
                'recordMonth': ctx.request.body.recordMonth,
                'recordDay': ctx.request.body.recordDay,
                'price': ctx.request.body.price,
                'title': ctx.request.body.title,
                'icon': ctx.request.body.icon,
                'remark': ctx.request.body.remark,
                'bookId': ctx.request.body.bookId
            }}
        ).exec()
        ctx.body = { statusCode: 200, message: '更新成功', code: 1, data: res};
    } else {
        delete ctx.request.body._id
        ctx.request.body.openid = ctx.state.user.openid
        let acc = new AccList(ctx.request.body)
        await acc.save()
        ctx.body = { statusCode: 200, message: '添加成功', code: 1};
    }
}