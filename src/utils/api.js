import http from  './fly'

// export const getIndex = params => { return http.get('/index/', params)};

// 新增记账记录
export const addRecord = params => { return http.post('/accounting/addRecord', params)};

// 新增记账类别
export const addCategory = params => { return http.post('/accounting/addCategory', params)};

// 获取类别列表
export const getCategoryList = params => { return http.post('/accounting/getCategoryList', params)};

// 获取记账列表
export const getAccountingList = params => {return http.post('/accounting/getAccountingList', params)};

// 更新类别
export const updateCategoryList = params => { return http.post('/accounting/updateCategoryList', params)};

// 删除类别
export const deleteCategory = params => { return http.post('/accounting/deleteCategory', params)};

// 获取记账总和 （月度和年度）
export const getAmount = params => { return http.post('/accounting/getAmount', params)};

export const deleteAccounting = params => { return http.post('/accounting/deleteAccounting', params)};

//deleteAccounting