import request from './index'

export const getCategory = () =>
  request({
    url: '/category',
    method: 'get'
  })

export const getCommodityById = (data) =>
  request({
    url: 'commodity',
    method: 'post',
    data
  })

export const getRecommendBlank = () =>
  request({
    url: 'recommendBlank',
    method: 'get'
  })

export const getProductView = (data) =>
  request({
    url: 'productView',
    method: 'post',
    data
  })

export const getRecommend = (data) =>
  request({
    url: 'recommend',
    method: 'post',
    data
  })
