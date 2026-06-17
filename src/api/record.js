import { request } from '@/utils/fetch'

export function getRecord(data) {
  return request({
    url: data.url,
    method: 'get'
  })
}
