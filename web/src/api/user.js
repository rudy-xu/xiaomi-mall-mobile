import request from './index'

export const fetchUserInfo = () =>
  request({
    url: '/userInfo',
    method: 'get'
  })
