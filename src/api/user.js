import { request } from '@/utils/fetch'

export function gettoken() {
  return request({
    url: '/restful/checklogin?get_token=1',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/restful/login',
    method: 'post',
    data
  })
}

export function adduser(data) {
  return request({
    url: '/restful/adduser?',
    method: 'post',
    data
  })
}

export function edituser(data) {
  return request({
    url: '/restful/updateuser?',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/restful/changepassworduser?',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/restful/logout?',
    method: 'get'
  })
}

export function getlists(data) {
  let rule = ""
  if (data.rule) rule = "&rule=" + data.rule

  return request({
    url: '/restful/listuser?username=' + data.username + '&store=' + data.code_store + '&page=' + data.page + rule,
    method: 'get',
    listuseradmin: data?.listuseradmin ?? false
  })
}

