/**
 * Encapsulate url
 */
// // The host is in development
// const host = process.env.VUE_APP_BASE_API

// // The host is null after online
// // const host = ''

// const url = {
//   getCode: '/getCode',
//   login: '/login'
// }

// Object.keys(url).forEach(key => {
//   url[key] = host + url[key]
// })

// export default url

/**
 * Import related api function where needed
 */
import axios from 'axios'
// import mock from '@/mock'    // it will be packaged when project package

let baseURL = ''
const { NODE_ENV, VUE_APP_API } = process.env
if(NODE_ENV == 'development' || (NODE_ENV === 'production' && VUE_APP_API == 'rap')) {
  baseURL = process.env.VUE_APP_BASE_API
}

const axiosInstance = axios.create({
  baseURL: baseURL
  // timeout: 5000,
  // headers: {'X-Custom-Header': 'foobar'},
  // withCredentials: true // send cookies when cross-domain requests
})

// Do something before sending request
axiosInstance.interceptors.request.use(
  function (config) {
    // // Add Authorization Bearer Token header to every request
    // if(token) {
    //   config.headers['Authorization'] = 'Beaer' + token
    // }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Do something after receiving reponse
axiosInstance.interceptors.response.use(

  function (response) {
    return response.data
  },
  function (err) {
    if(process.env.NODE_ENV === 'production') {
      // package status
      return Promise.reject(err)
    } else {
      // development status
      // take CommonJs
      let mock = require('@/mock')
      console.error(err)
      return mock.getCode
    }
  }
)

export default axiosInstance
