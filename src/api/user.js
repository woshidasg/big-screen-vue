import request from '@/utils/request'

export function getUserInfo(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
} 