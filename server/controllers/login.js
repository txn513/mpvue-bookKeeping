const request = require('request')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken') //创建token
const secret = 'appIdSessionId' //生成Token 的秘钥
const config = require('../config.js')
const utils = require('../utils')

let expiresIn = 60 * 60 * 24
if(process.env.NODE_ENV == 'local'){
    expiresIn = 60
}
module.exports = async (ctx, next) => {
    let resultData = ''
    function getAppId(appid, secret, js_code) {
        return new Promise((resolve, reject) => {
        request.get(
            {
            url: "https://api.weixin.qq.com/sns/jscode2session",
            json: true,
            qs: {
                grant_type: "authorization_code",
                appid: appid,
                secret: secret,
                js_code: js_code
            }
            },
            (error, response, body) => {
            if (!error && response.statusCode == 200) {
                if (body.errcode) {
                    return reject(body.errmsg)
                }
                // console.log("小程序端返回的结果")
                // console.log("[openid]", body.openid)
                // console.log("[session_key]", body.session_key)
                resolve(body);
            } else {
                reject(error);
            }
            }
        );
        });
    }
    try {
        resultData = await getAppId(config.appId, config.appSecret, ctx.query.code)
    } catch (err) {
        ctx.throw(500, err)
    }
   
    const User = mongoose.model("User");

        let user = await User.userCheck(resultData.openid)
        if (user) {
            console.log("开始对比数据");
            let token = user.token

            try {
                let decoded = await jwt.verify(token, secret)
                ctx.body = { statusCode: 200, message: '校验成功', Token: user.token };
                console.log("token校验成功",decoded);
            } catch (err) {
                if (err && err.name == 'TokenExpiredError') {
                    let userToken={
                        openid: resultData.openid
                    }
                    
                    const token = jwt.sign(userToken,secret,{expiresIn: expiresIn }) //token签名
                    User.updateToken(resultData.openid, token)
                    console.log("token更新成功");
                    
                    ctx.body = { statusCode: 200 , message: '更新token成功', Token:token};
                } 
                else if (err) throw err;
            }
            
        } else {
            let userToken={
                openid: resultData.openid
            }
            const token = jwt.sign(userToken,secret,{expiresIn: expiresIn }) //token签名 有效期为24小时

            // 添加默认支出类型
            let payCategoryList=  [
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: 'icon-canju',
                    categoryName: '饮食',
                    key: 0,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: 'icon-youxi',
                    categoryName: '娱乐',
                    key: 1,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: 'icon-lvyou',
                    categoryName: '旅游',
                    key: 2,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: 'icon-jiaotong',
                    categoryName: '交通',
                    key: 3,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: 'icon-gouwu',
                    categoryName: '购物',
                    key: 4,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: 'icon-huaban',
                    categoryName: '医疗',
                    key: 5,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: 'icon-xuexi-',
                    categoryName: '学习',
                    key: 6,
                    isDefault: true
                }
              ]

            let incomeCategoryList = [
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: "icon-yuangonggongzi",
                    categoryName: "工资",
                    key: 0,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: "icon-lijin",
                    categoryName: "礼金",
                    key: 1,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: "icon-licai",
                    categoryName: "理财",
                    key: 2,
                    isDefault: true
                },
                {
                    createAt: utils.localDate(),
                    updateAt: utils.localDate(),
                    iconClassName: "icon-jianzhi",
                    categoryName: "兼职",
                    key: 3,
                    isDefault: true
                },
              ]


            let newUser = new User({
                openid: resultData.openid,
                token: token,
                payCategoryList,
                incomeCategoryList
            });

            try {
                await newUser.save()
                console.log("注册成功");
                ctx.body = { statusCode: 200 , message: '获取token成功',Token:token};
            } catch (error) {
                console.log(error);
                ctx.throw(500, error)
            }
            
        }

        next()
    
    // User.userCheck(resultData.openid).then(async user => {
    //     console.log(user)
        
    // })
}