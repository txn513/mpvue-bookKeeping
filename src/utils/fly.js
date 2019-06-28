import Fly from "flyio/dist/npm/wx"
import store from '@/store'
import login from '@/utils/login'

const fly = new Fly
const timeThreshold = 1000

//定义公共headers
// fly.config.headers={xx:5,bb:6,dd:7}
//设置超时
fly.config.timeout=10000;
//设置请求基地址
fly.config.baseURL=process.env.API_ROOT;




//添加请求拦截器
fly.interceptors.request.use((request)=>{
	// console.log(store.state.status)
		wx.showLoading({
			title: '加载中...',
			mask: true,
		})
		let token = store.state.token
		if (!token  || store.state.status == 'error') {
			console.log('走这')
			fly.lock();

			store.commit('AUTH_REQUEST')
			return login().then(res => {
				store.commit('AUTH_SUCCESS', res.data.Token)
				request.headers["Authorization"]=`Bearer ${res.data.Token}`
				return request
			}).finally(() => fly.unlock())
			.catch(err => {
				store.commit('AUTH_ERROR')
			})
			
		// return new Promise((resolve, reject) => {
		// 	store.commit('AUTH_REQUEST')
        // wx.login({
        //     success: function (res) {
        //         if (res.code) {
        //             //发起网络请求
        //             wx.request({
        //                 url: `${process.env.API_ROOT}/user/login`,
        //                 data: {
        //                     code: res.code
        //                 },
        //                 success:res=>{
        //                     // console.log(res.data)
		// 					store.commit('AUTH_SUCCESS', res.data.Token)
		// 					request.headers["Authorization"]=`Bearer ${res.data.Token}`
		// 					fly.unlock();
		// 					resolve(request)
							
        //                 }
        //             })
        //         } else {
		// 			fly.unlock();
		// 			reject(res)
		// 			store.commit('AUTH_ERROR')
        //             console.log('登录失败！' + res.errMsg)
        //         }
        //     }
        // });
    	// })
		} else {
			//给所有请求添加自定义header
			request.headers["Authorization"]=`Bearer ${token}`
			return request;
		}
    
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(function (response) {
		wx.hideLoading();

		//只将请求结果的data字段返回
		return response.data
	},function (err) {
		wx.hideLoading();
		console.log(err)
		//
		if (err.status == 401 && err.response.data.code == 'TokenExpiredError') {
			console.log(this.lastResTime)
			// console.log((new Date() - this.lastResTime ))
			if (this.lastResTime && ((new Date() - this.lastResTime) < timeThreshold )) {
				return fly.request(err.request)
			}
			this.lock();
			store.commit('AUTH_REQUEST')
			return login().then(res => {
				store.commit('AUTH_SUCCESS', res.data.Token)
				this.lastResTime = new Date()
			}).finally(() => this.unlock())
			.then(() => {
				return fly.request(err.request);
			})
			.catch(res => {
				store.commit('AUTH_ERROR')
				console.log('登录失败！' + res.errMsg)
			})
		} else {
			// return fly.request(err.request);
			// wx.switchTab({
			// 	url: "/pages/index/main"
			// })
		}
			// console.log(err)
			// return Promise.resolve('sssssss')
	}
)

export default fly