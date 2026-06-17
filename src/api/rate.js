import { request } from '@/utils/fetch'

export function addRate(data) {
  return request({
    url: '/restful/addrate?',
    method: 'post',
    data
  })
}

export function editRate(data) {
  return request({
    url: '/restful/updaterate?',
    method: 'post',
    data
  })
}

export function getlistsRate(data) {
  const page = data ? 'page=' + data.page : ''
  return request({
    url: '/restful/listrate?' + page + '&limit=1000',
    method: 'get'
  })
}
