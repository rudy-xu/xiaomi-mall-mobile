import request from './index'

const getCartList = () =>
  request({
    url: '/cart/list',
    method: 'get'
  })

const selectGoods = (data) =>
  request({
    url: '/cart/selectGoods',
    method: 'post',
    data
  })

const selectServices = (data) =>
  request({
    url: '/cart/selectService',
    method: 'post',
    data
  })

const editCart = (data) =>
  request({
    url: '/cart/edit',
    method: 'put',
    data
  })

const addGoods = (data) =>
  request({
    url: '/cart/add',
    method: 'post',
    data
  })

const deleteGoods = (data) =>
  request({
    url: '/cart/delete',
    method: 'delete',
    data
  })

const carCount = () =>
  request({
    url: '/cart/count',
    method: 'get'
  })

export {
  getCartList,
  selectGoods,
  selectServices,
  editCart,
  addGoods,
  deleteGoods,
  carCount
}
