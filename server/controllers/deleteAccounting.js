const mongoose = require('mongoose')
const AccList = mongoose.model("AccList");

module.exports = async (ctx, next) => {
    let res = await AccList.update(
        {'_id': ctx.request.body.id},
        {$set: {'isDeleted' : 1}}
    )
    if (res.nModified == 1) {
        ctx.body = { statusCode: 200, message: '删除成功', code: 1};
    } else {
        ctx.body = { statusCode: 200, message: '删除失败', code: 2};
    }
}
