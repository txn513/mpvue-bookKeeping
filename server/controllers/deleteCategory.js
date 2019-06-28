const mongoose = require('mongoose')

const User = mongoose.model("User");
module.exports = async (ctx, next) => {
    let user = ctx.state.userDoc
    let recordType = ctx.request.body.recordType
    if (recordType == 0) {
        user.payCategoryList.pull({_id: ctx.request.body.id})
    } else if (recordType == 1) {
        user.incomeCategoryList.pull({_id: ctx.request.body.id})
    }
    await user.save()
    ctx.body = { statusCode: 200, message: '删除类别成功', code: 1};
}
