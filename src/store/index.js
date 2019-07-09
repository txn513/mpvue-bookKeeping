const Vue = require('vue')
const Vuex = require('vuex')

Vue.use(Vuex)
import { getCategoryList, getAccountingList } from '@/utils/api'
export default new Vuex.Store({
    state: {
        status: '',
        token:  wx.getStorageSync('token') || '',
        user : {},
        systemInfo: null,
        pList: null,
        iList: null,
        cateListNeedRefresh: false,
        accListNeedRefresh: false,
        accList: null,
		rootUrl: wx.getStorageSync('API_ROOT'),
		indexListCount: 0,
        // plist: null
    },
    mutations: {
        ['AUTH_REQUEST'](state) {
            state.status = 'loading';
        },
        ['AUTH_SUCCESS'](state, token) {
            state.status = 'success';
            state.token = token;
		    wx.setStorageSync('token', token)
        },
        ['AUTH_ERROR'](state) {
            state.status = 'error';
        },
        ['GET_SYSTEMINFO_SUCCESS'](state, systemInfo) {
            state.systemInfo = systemInfo; 
        },
        ['GET_PAYLIST'](state, payList){
            state.pList = payList
        },
        ['GET_INCOMELIST'](state, incomeList){
            state.iList = incomeList
        },
        ['CATELIST_NEED_REFRESH'](state){
            state.cateListNeedRefresh = true
        },
        ['CATELIST_REFRESH_DONE'](state){
            state.cateListNeedRefresh = false
        },
        ['GET_ACCLIST'](state, accList){
            state.accList = accList
        },
        ['ACCLIST_NEED_REFRESH'](state){
            state.accListNeedRefresh = true
        },
        ['ACCLIST_REFRESH_DONE'](state){
            state.accListNeedRefresh = false
        },
		['INDEX_LIST_COUNT'](state, count){
			state.indexListCount = count
		}
    },
    actions: {
		login({commit, state}){
			return new Promise((resolve, reject) => {
				wx.login({
					success: function (res) {
						if (res.code) {
							//发起网络请求
							wx.request({
								url: `${state.rootUrl}/user/login`,
								data: {
									code: res.code
								},
								success:res=>{
									console.log(res.data)
									// self.globalData.Token = res.data.Token
									commit('AUTH_SUCCESS', res.data.Token)
									resolve(res)
								},
								fail: err => {
									reject(err)
								}
							})
						} else {
							reject(res)
							console.log('登录失败！' + res.errMsg)
						}
					}
				});
			})
		},
        getSystemInfo({commit, state}){
            return new Promise((resolve, reject) => {
                if (state.systemInfo) {
                    resolve(state.systemInfo)
                } else {
                    wx.getSystemInfo({
                        success(res) {
                            commit('GET_SYSTEMINFO_SUCCESS', res)
                            resolve(res)
                        },
                        fail(err){
                            reject(err)
                        }
                    });
                }
                
            })
        },
        getCategoryList({commit, state}, recordType){
            return new Promise((resolve, reject)=> {
                getCategoryList({recordType}).then(res => {
                    
                    if (recordType == 0) {
                        commit('GET_PAYLIST', res.data.categoryList)
                    } else if (recordType == 1) {
                        commit('GET_INCOMELIST', res.data.categoryList)
                    }
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getAccountingList({commit, state}, params){

            new Promise ((resolve, reject)=> {
                getAccountingList(params).then(res => {
                    console.log(res)
                    commit('GET_ACCLIST', res.data.categoryList)//
					commit('INDEX_LIST_COUNT', res.data.count)//INDEX_LIST_COUNT
                    commit("ACCLIST_REFRESH_DONE")

                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
            
        },
	},
    getters: {
        isIphoneX: state => {
            console.log(state.systemInfo)
            return state.systemInfo ? state.systemInfo.model.includes("iPhone X") : false
        },
        incomeList: state => {
            return state.incomeCategoryList
        },
        pList: state=> state.pList,
        iList: state=> state.iList,
        accList: state => state.accList,
		
        
    }
})