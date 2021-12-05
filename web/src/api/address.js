import request from './index'

export const getAllAddress = () =>
  request({
    url: '/address/all',
    method: 'get'
  })

export const addressList = (data) =>
  request({
    url: '/address/list',
    method: 'post',
    data
  })

export const addressAdd = (data) =>
  request({
    url: '/address/add',
    method: 'post',
    data
  })

export const addressSave = (data) =>
  request({
    url: '/address/save',
    method: 'post',
    data
  })

export const addressDetail = (data) =>
  request({
    url: '/address/detail',
    method: 'post',
    data
  })

export const addressDelete = (data) =>
  request({
    url: '/address/delete',
    method: 'post',
    data
  })

export const addressRegion = (data) =>
  request({
    url: '/address/region',
    method: 'post',
    data
  })

export const estDelivery = (data) =>
  request({
    url: '/product/estDelivery',
    method: 'post',
    data
  })
