const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  // 设置为 false 以禁用生产环境的 source map，以加速构建并减小输出文件大小。
  productionSourceMap: false,
  transpileDependencies: [],
  chainWebpack: config => {
    config.resolve.alias
      .set('_c', resolve('src/components')) // key,value自行定义，比如.set('@@', resolve('src/components'))
  },
  devServer: {
    proxy: {
      // 开发服务器代理的配置。
      // 它会将API请求转发到后端服务器，以避免跨域问题。
      [process.env.VUE_APP_BASE_API]: {
        // 后端API的目标URL。
        // 这是从 .env.development 文件中读取的。
        target: process.env.VUE_APP_API_HOST,
        // 对于虚拟主机站点是必需的。
        // 它会将请求头中的'Host'更改为目标URL。
        changeOrigin: true,
        // 代理 websocket。
        ws: true,
        // 重写请求路径。
        pathRewrite: {
          // 从请求路径中移除 /api 前缀。
          // 例如，一个到 /api/users 的请求将被转发到 /users。
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
}