const mongoose = require('mongoose');
const utils = require('../utils')

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  openid: String,
  createAt: {type:Date,default:  () => { return utils.localDate() } },
  updateAt: {type:Date,default:  () => { return utils.localDate() } },
  recordYear: Number,
  recordMonth: Number,
  recordDay: Number,
  price: Number,
  recordType: Number,
  icon: String,
  title: String,
  category: Number,
  bookId: {type: String, default: ''},
  remark: String,
  isDeleted: {type: Number, default: 0}
});

  

mongoose.model('AccList', UserSchema);