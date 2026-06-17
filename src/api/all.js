import { request } from '@/utils/fetch'

export function getstores(data) {
  return request({
    url: '/restful/liststore?limit=999',
    method: 'post',
    data
  })
}
