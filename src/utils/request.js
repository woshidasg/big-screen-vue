import axios from 'axios'
// 建议引入UI组件库用于消息提示，例如 element-ui 的 Message
// import { Message } from 'element-ui'
// 获取token通常的做法是从cookie中获取
// import { getToken } from '@/utils/auth'

/**
 * 管理待处理的请求，以防止重复提交。
 */
const pendingRequests = new Map()

/**
 * 根据请求方法、URL和数据生成一个唯一的请求key。
 * @param {object} config - Axios的请求配置。
 * @returns {string} 请求的唯一key。
 */
const getRequestKey = (config) => {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 将请求添加到待处理列表。如果发现重复请求，则取消先前的请求。
 * @param {object} config - Axios的请求配置。
 */
const addPendingRequest = (config) => {
  const requestKey = getRequestKey(config)
  // 取消并移除先前的相同请求
  removePendingRequest(requestKey)
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    pendingRequests.set(requestKey, cancel)
  })
}

/**
 * 从待处理列表中移除并取消请求。
 * @param {string} requestKey - 请求的唯一key。
 */
const removePendingRequest = (requestKey) => {
  if (pendingRequests.has(requestKey)) {
    const cancel = pendingRequests.get(requestKey)
    cancel(requestKey)
    pendingRequests.delete(requestKey)
  }
}

/**
 * 清除所有待处理的请求。在页面跳转时此功能非常有用。
 */
export const clearPendingRequests = () => {
  for (const [requestKey, cancel] of pendingRequests.entries()) {
    cancel(`请求 ${requestKey} 因页面跳转而被取消。`)
  }
  pendingRequests.clear()
}

/**
 * 用于GET请求的简单内存缓存。
 */
const requestCache = new Map()

// 创建axios实例
const service = axios.create({
  // VUE_APP_BASE_API 在 .env.development 或 .env.production 中设置
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 检查GET请求的缓存
    if (config.method === 'get' && config.cache) {
      const cacheKey = getRequestKey(config)
      if (requestCache.has(cacheKey)) {
        console.log(`[Cache] 命中缓存 ${cacheKey}`)
        // 如果存在缓存响应，则直接返回并阻止请求
        return Promise.resolve(requestCache.get(cacheKey))
      }
    }

    // 将请求添加到待处理列表，以处理重复请求
    addPendingRequest(config)

    // 这里可以添加token等逻辑，例如从localStorage中读取
    // const token = getToken()
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer ' + token
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const requestKey = getRequestKey(response.config)
    pendingRequests.delete(requestKey)

    // 如果是启用了缓存的GET请求，则缓存响应
    if (response.config.method === 'get' && response.config.cache) {
      const cacheKey = getRequestKey(response.config)
      requestCache.set(cacheKey, response.data)
      console.log(`[Cache] 已缓存响应 ${cacheKey}`)
    }

    const res = response.data

    // 处理来自缓存的响应，这些响应已经是数据了
    if (response.config.cache && requestCache.has(getRequestKey(response.config))) {
      return res
    }

    // 这里可以根据后端返回的状态码进行判断
    // 示例：如果code不为200，则判断为错误。
    // 这需要根据你的后端API规范进行修改。
    if (res.code !== 200) {
      // 可以使用UI库来显示消息
      // Message({ message: res.message || '错误', type: 'error', duration: 5 * 1000 })
      console.error('API错误:', res.message || 'Error')

      // 示例：50008: 非法token; 50012: 其他客户端已登录; 50014: Token过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 处理token过期，例如重定向到登录页
        console.error('Token错误，正在重定向到登录页...')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const requestKey = getRequestKey(error.config || {})
    removePendingRequest(requestKey)

    if (axios.isCancel(error)) {
      console.log('请求已取消:', error.message)
      // 返回一个待定的Promise来阻止.catch被触发
      return new Promise(() => {})
    }

    // 可以使用UI库来显示消息
    // Message({ message: error.message, type: 'error', duration: 5 * 1000 })
    console.error('网络错误: ' + error.message)
    return Promise.reject(error)
  }
)

/**
 * GET 请求
 * @param {string} url - 请求URL
 * @param {object} params - 请求参数
 * @param {object} options - 额外选项, 例如 { cache: true }
 * @returns {Promise}
 */
export const get = (url, params, options = {}) => {
  return service.get(url, { params, ...options })
}

/**
 * POST 请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据
 * @returns {Promise}
 */
export const post = (url, data) => {
  return service.post(url, data)
}

/**
 * PUT 请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据
 * @returns {Promise}
 */
export const put = (url, data) => {
  return service.put(url, data)
}

/**
 * DELETE 请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求体数据 (用于DELETE请求的请求体)
 * @returns {Promise}
 */
export const del = (url, data) => {
  return service.delete(url, { data })
}

export default service 