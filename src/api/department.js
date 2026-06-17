import { request } from '@/utils/fetch'

export function adddepartment(data) {
  return request({
    url: '/restful/adddepartment?',
    method: 'post',
    data
  })
}

export function editdepartment(data) {
  return request({
    url: '/restful/updatedepartment?',
    method: 'post',
    data
  })
}

export function getlists(data) {
  const page = data ? 'page=' + data.page : ''
  return request({
    url: '/restful/listdepartment?' + page + '&limit=1000',
    method: 'get'
  })
}
