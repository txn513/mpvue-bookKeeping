function login () {
    return new Promise((resolve, reject) => {
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: `${process.env.API_ROOT}/user/login`,
                        data: {
                            code: res.code
                        },
                        success:res=>{
                            console.log(res.data)
                            // self.globalData.Token = res.data.Token
                            // store.commit('AUTH_SUCCESS', res.data.Token)
                            resolve(res)
                        }
                    })
                } else {
                    reject(res)
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    })
}

export default login