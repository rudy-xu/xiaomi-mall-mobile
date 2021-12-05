import request from './index'

export const getCode = (data) =>
  request({
    url: '/getCode',
    method: 'Post',
    data: data
  })

export const login = (data) =>
  request({
    url: '/login',
    method: 'Post',
    data: data
  })

export const logout = (data) =>
  request({
    url: '/logout',
    method: 'post',
    data
  })
