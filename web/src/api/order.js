import request from './index'

export const orderCheckout = () =>
  request({
    url: '/order/checkout',
    method: 'get'
  })

export const orderList = (data) =>
  request({
    url: '/order/list',
    method: 'post',
    data
  })

export const orderView = (data) =>
  request({
    url: '/order/view',
    method: 'post',
    data
  })
