import request from './index'

export const getNavList = () =>
  request({
    url: '/navList',
    method: 'get'
  })

export const getTabPageById = (data) =>
  request({
    url: '/tabPage',
    method: 'post',
    data: data
  })
