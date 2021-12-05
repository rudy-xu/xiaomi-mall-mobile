import {
  getAllAddress,
  addressList,
  addressAdd,
  addressSave,
  addressDetail,
  addressDelete,
  addressRegion
} from './address'

// Es6
class Address {
  static list() {
    return addressList()
  }

  static add(data) {
    return addressAdd(data)
  }

  static save(data) {
    return addressSave(data)
  }

  static detail(id) {
    return addressDetail({
      address_id: id
    })
  }

  static romve(id) {
    return addressDelete({
      address_id: id
    })
  }

  static all() {
    return getAllAddress()
  }

  static region(id) {
    return addressRegion({
      parent_id: id
    })
  }
}

// JavaScript
// const Address = {
//   list() {
//     return addressList()
//   }
// }

export default Address
