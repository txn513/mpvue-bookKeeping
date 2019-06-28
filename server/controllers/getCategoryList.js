module.exports = async (ctx, next) => {
    let user = ctx.state.userDoc
    
    if (ctx.request.body.recordType == 0) {
        ctx.body = { statusCode: 200, message: '获取支出类别成功', data: {
            categoryList: user.payCategoryList
        }};
    } else if (ctx.request.body.recordType == 1){
        ctx.body = { statusCode: 200, message: '获取收入类别成功', data: {
            categoryList: user.incomeCategoryList
        }};
    }
}
