import { request } from '@/utils/fetch'

export function addmail(data) {
  return request({
    url: '/restful/addstore?',
    method: 'post',
    data
  })
}

export function editmail(data) {
  return request({
    url: '/restful/updatestore?',
    method: 'post',
    data
  })
}

export function getlists(data) {
  const page = data ? 'page=' + data.page : ''
  return request({
    url: '/restful/liststore?' + page + '&limit=10' + '&code=' + data.code + '&name=' + data.name,
    method: 'get'
  })
}
