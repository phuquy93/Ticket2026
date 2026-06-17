
import { Message } from 'element-ui'

async function request(data) {
  try {
    let headers = new Headers();

    headers.append('Authorization', 'Bearer ' + localStorage.getItem("jwt"));
    const response = await fetch(process.env.VUE_APP_BASE_API + data.url, {
      method: data.method,
      body: data.data,
      headers: headers,
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
