const Router = require('koa-router')
const addRecordController = require('../controllers/addRecord.js')
const addCategoryController = require('../controllers/addCategory.js')
const getCategoryListController = require('../controllers/getCategoryList.js')
const getAccountingListController = require('../controllers/getAccountingList.js')
const updateCategoryListController = require('../controllers/updateCategoryList.js')
const deleteCategoryController = require('../controllers/deleteCategory.js')
const getAmountController = require('../controllers/getAmount.js')
const deleteAccountingController = require('../controllers/deleteAccounting.js')
const getAccountingDetailsController = require('../controllers/getAccountingDetails.js')
const getAccountingDaysNCountsController = require('../controllers/getAccountingDaysNCounts.js')

let router = new Router()
// 添加记账
router.post('/addRecord', addRecordController)

// 新增类别
router.post('/addCategory', addCategoryController)

// 获取类别列表
router.post('/getCategoryList', getCategoryListController)

// 获取记账列表（支出+收入）
router.post('/getAccountingList', getAccountingListController)

// 更新类别
router.post('/updateCategoryList', updateCategoryListController)

// 删除类别
router.post('/deleteCategory', deleteCategoryController)

// 获取记账总和（支出+收入）
router.post('/getAmount', getAmountController)

// 删除一条记账
router.post('/deleteAccounting', deleteAccountingController)

// 查询记账详情
router.post('/getAccountingDetails', getAccountingDetailsController)

// 查询记账天数
router.get('/getAccountingDaysNCounts', getAccountingDaysNCountsController)




module.exports = router