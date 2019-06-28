const mongoose = require('mongoose')
const User = mongoose.model("User");
module.exports = async (ctx, next) => {
    console.log(ctx.state.user)
    if (!ctx.state.user || (ctx.state.user && !ctx.state.user.openid)) {
        await next()
    } else {
        let user = await User.userCheck(ctx.state.user.openid)
        if (user) {
            ctx.state.userDoc = user
            await next()
        } else {
            ctx.throw(500,'用户信息查询失败')
        }
    }  
}