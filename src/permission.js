import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getUser, removeData } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title

  document.title = getPageTitle(to.meta.title)

  const hasToken = getUser()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {

      if (to.meta.roles.find(c => Number(c) === Number(JSON.parse(hasToken).find(a => a.split('=')[0] === 'rule').split('=')[1])) && (to.meta.not_show && to.meta.not_show.find(b => Number(b) === Number(JSON.parse(hasToken).find(a => a.split('=')[0] === 'dataid').split('=')[1]))) === undefined || to?.meta?.showid?.find(a => a == Number(JSON.parse(hasToken).find(a => a.split('=')[0] === 'dataid').split("=")[1]))) {
        next()
      } else {
        removeData('ticket_user')
        removeData('ticket_user_call')
        next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
        NProgress.done()
      }

    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
