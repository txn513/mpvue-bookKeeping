var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"http://192.168.31.133:5000"'
  API_ROOT: '"https://bkdemo.juheworld.cn"'
})
