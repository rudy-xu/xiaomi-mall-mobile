/**
 * =====================================
 * Function component
 * =====================================
 * 1 create instance
 * 2 mount
 * 3 deal v-model
 * 4 transform parameter
 * 5 listen events (promise + callback)
 */

/**
 * Vue 2 中，函数式组件主要有两个应用场景：
 *  作为性能优化，因为它们的初始化速度比有状态组件快得多
 *  返回多个根节点
 *
 * 然而，在 Vue 3 中，有状态组件的性能已经提高到它们之间的区别可以忽略不计的程度
 * 此外，有状态组件现在也支持返回多个根节点。
 * 因此，函数式组件剩下的唯一应用场景就是简单组件，
 * 比如创建动态标题的组件。否则，建议你像平常一样使用有状态组件
 */

// ---------------------- vue2.x
// import Vue from 'vue'
// import MiDialog from './MiDialog.vue'

// let instance

// const initInstance = () => {
//   // Vue.extend() -> 构造器创建组件 (参数为一个组件) -> 创建一个基于 MiDialog 的子类
//   instance = new (Vue.extend(MiDialog))({
//     el: document.createElement('div')
//   })

//   // mount
//   document.body.appendChild(instance.$el)

//   // listen
//   // v-model
//   /**
//    * 我们从实例中完全移除了 $on、$off 和 $once 方法
//    * '$emit' 仍然包含于现有的 API 中，因为它用于触发由父组件声明式添加的事件处理函数
//    *
//    * 在 Vue 3 中，借助这些 API 从一个组件内部监听其自身触发的事件已经不再可能了。该用例没有办法迁移
//    */
//   instance.$on('input', value => {
//     instance.value = value
//   })
// }

// const Dialog = options => {
//   // return Promise object
//   // transform resolve and reject to dialog instance
//   return new Promise((resolve, reject) => {
//     if(!instance) {
//       // instance dose not exist
//       initInstance()
//     }

//     // instance 是一个基于 MiDialog 的子类
//     Object.assign(instance, {
//       resolve,
//       reject,
//       ...options
//     })
//   })
// }

// Dialog.defaultOptions = {
//   // default parameter
//   value: false,
//   title: '',
//   message: '',
//   showConfirmButton: true,
//   showCancelButton: false,
//   callback: action => {
//     instance[action === 'confirm' ? 'resolve' : 'reject'](action)
//   }
// }

// Dialog.alert = options => Dialog({
//   ...Dialog.defaultOptions,
//   value: true,
//   ...options
// })

// Dialog.confirm = options => Dialog({
//   ...Dialog.defaultOptions,
//   showCancelButton: true,
//   value: true,
//   ...options
// })

// -------------------- vue 3.x
import { createApp } from 'vue'
import MiDialog from './MiDialog.vue'

// let Dialog = {}
// let instance

// Dialog.confirm = options => {
//   console.log(options)
//   let el = document.createElement('div')
//   document.body.appendChild(el)
//   instance = createApp(MiDialog, {
//     ...options
//   })
//   instance.mount(el)
// }

// Define
let instance

const Dialog = options => {
  // return Promise object
  // transform resolve and reject to dialog instance
  return new Promise((resolve, reject) => {
    let el = document.createElement('div')
    document.body.appendChild(el)
    instance = createApp(MiDialog, {
      onClose: (action) => {
        console.log(action)
        action === 'confirm' ? resolve(action) : reject(action)
        instance.unmount(el)
      },
      ...options
    })

    instance.mount(el)
  })
}

Dialog.defaultOptions = {
  // default parameter
  value: false,
  title: '',
  message: '',
  showConfirmButton: true,
  showCancelButton: false
}

Dialog.confirm = options => Dialog({
  ...Dialog.defaultOptions,
  showCancelButton: true,
  value: true,
  ...options
})

Dialog.alert = options => Dialog({
  ...Dialog.defaultOptions,
  value: true,
  ...options
})

// Usage
// ***.vue
// Dialog.confirm({
//   message: '确定删除当前地址?'
// }).then((action) => {
//   console.log('+++++++++++')
//   console.log(action)
//   addressDelete({
//     address_id: list.address_id
//   }).then(res => {
//     if(res.status === 200) {
//       this.lists.splice(index, 1)
//     }
//   })
// }).catch(err => {
//   console.log(err)
// })

export default Dialog

/**
 * ================================================
 * component use as plugin  -> plugin component
 * ================================================
 * */
// // ---------- vue 2.x
// // Define
// // xxx.js
// import Vue from 'vue'
// import MiDialog from './MiDialog.vue'

// const Dialog = {}

// Dialog.install = () => {
//   Vue.component('MiDialog', MiDialog)
// }

// export default Dialog

// // Usage
// // xxx.vue
// import Vue from 'vue'
// import MiDialog from '@/components/dialog'
// Vue.use(MiDialog)

// <mi-dialog />

// ------------ vue 3.x
// Define
// xxx.js
// import MiDialog from './MiDialog.vue'
// export default {
//   install: (app, options) => {
//     app.component('MiDialog', MiDialog)
//   }
// }

// // main.js
// import MiDialog from '@/components/dialog'
// app.use(MiDialog /** , options use as second parameter */)

// // Useage
// // xxx.vue
// <MiDialog />
