import { orderCheckout, orderList, orderView } from '@/api/order'

class Order {
  static checkout() {
    return orderCheckout('orderCheckout')
  }

  static list(data) {
    return orderList('orderList', data)
  }

  static view(data) {
    return orderView('orderView', data)
  }
}

export default Order
