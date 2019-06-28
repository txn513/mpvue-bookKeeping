const mongoose = require('mongoose');
const utils = require('../utils')

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    openid:String,
    userInfo: {
      nickName:String,
      avatarUrl:String,
      age: Number,
      gender: String,
      device: String,
      city: String,
      province: String,
      country: String,
      language: String, 
    },
    phoneNum: Number,
    platform: {type: Number, default: 0},   // 平台
    createAt:{type:Date,default: () => { return utils.localDate() } },
    updateAt: {type:Date,default: () => { return utils.localDate() } },
    token:String,
    defaultBook: String,
    bookList: [{
      createAt: {type:Date,default:  () => { return utils.localDate() } },
      updateAt: {type:Date,default:  () => { return utils.localDate() } },
      bookName: String,
      color: String,
      initialDefault: {type:Boolean, default: false},
      type: {type:String, default: 'default'},
    }],
    payCategoryList: [
      {
        createAt: {type:Date,default: () => { return utils.localDate() } },
        updateAt: {type:Date,default: () => { return utils.localDate() } },
        categoryName: String,
        iconClassName: String,
        isDefault: {type: Boolean, default: false}
      }
    ],
    incomeCategoryList: [
      {
        createAt: {type:Date,default: () => { return utils.localDate() } },
        updateAt: {type:Date,default: () => { return utils.localDate() } },
        categoryName: String,
        iconClassName: String,
        isDefault: {type: Boolean, default: false}
      }
    ]
});

UserSchema.statics = {
  
    // check user exists or not
    userCheck: function(openid) {
      if (!openid) return null
      return this.findOne({openid})
        .exec();
    },

    updateToken: function (openid,token) {
      return this.updateOne({openid}, {token})
      .exec()
    },


  };
  

mongoose.model('User', UserSchema);