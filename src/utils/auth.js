import Cookies from 'js-cookie'

const TokenKey = 'jwt'

const Datauser = 'ticket_user'

const Usercall = 'ticket_user_call'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getUser() {
  return Cookies.get(Datauser)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUser(data) {
  return Cookies.set(Datauser, data)
}

export function removeData(data) {
  return Cookies.remove(data)
}

export function setUserCall(data) {
  return Cookies.set(Usercall, data)
}

export function getUserCall() {
  return Cookies.get(Usercall)
}
