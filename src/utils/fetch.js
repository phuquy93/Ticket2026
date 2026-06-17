
import { Message } from 'element-ui'

import { getUser } from '@/utils/auth.js'

let url = ''

if (window.location.host === 'dmcltk.stdmcl.com:8099') {
  url = process.env.VUE_APP_BASE_API
} else {
  // url = process.env.VUE_APP_BASE_API_DEV
  url = process.env.VUE_APP_BASE_API
}

async function request(data) {


  try {
    const headers = new Headers()

    let path = ""
    if (getUser()) {

      if (data.url.search("&rule=") !== -1) {
        path = "&" + JSON.parse(getUser()).filter(a => a.split("=")[0] !== 'rule').join('&')
      } else {
        if (data.listuseradmin) {
          path = "&" + JSON.parse(getUser()).filter(a => a.split("=")[0] !== 'rule').join('&')
        } else {
          path = "&" + JSON.parse(getUser()).join('&')
        }

      }
    }

    if (data.method === 'GET') {
      headers.append('Content-Type', 'application/json')
    }

    let body = data.data
    if (body && !(body instanceof FormData) && typeof body === 'object') {
      body = JSON.stringify(body)
      headers.append('Content-Type', 'application/json')
    }

    const param = path
    const response = await fetch(url + data.url + param, {
      method: data.method,
      body: body,
      headers: headers
    })
    return response.json()
  } catch (error) {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
}

export { request }
