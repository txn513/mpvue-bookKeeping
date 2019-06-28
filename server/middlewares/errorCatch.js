module.exports = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // console.log('error top---------------', err)
      ctx.status = err.status || 500;
      // console.log(err.originalError.name)
      if (err.originalError && err.originalError.name == 'TokenExpiredError') {
        ctx.body = {code: err.originalError.name, message: err.originalError ? err.originalError.message : err.message}
      } else {
        ctx.body = err.originalError ? err.originalError.message : err.message
      }
      ctx.app.emit('error', err, ctx);
    }
  }