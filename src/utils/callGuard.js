import { getUser } from '@/utils/auth.js'

// Chặn đóng/refresh tab khi cuộc gọi đang xử lý + cứu dữ liệu nếu user vẫn đóng.
//
// Vòng đời trong handleCall():
//   bắt đầu gọi                -> startCallGuard()
//   có callKey, trước update   -> setCallBeacon(formData)
//   updateRecord xong/lỗi      -> clearCallBeacon() + endCallGuard()
//
// 3 lớp bảo vệ:
//   1. beforeunload -> browser hỏi Leave / Cancel (chỉ khi đang pending).
//      Đóng cả cửa sổ trong lúc đứng ở tab khác: Chrome tự nhảy về tab này và hỏi.
//      KHÔNG chặn được việc user đóng 1 tab khác (tab đó là document khác).
//   2. document.title đổi thành "● Đang ghi nhận cuộc gọi..." -> user ở tab khác
//      nhìn thanh tab là biết còn việc chưa xong.
//   3. pagehide -> navigator.sendBeacon đẩy record về server, request không bị
//      hủy khi tab chết (axios/fetch thường bị hủy giữa đường).
//
// Lưu ý: text hộp thoại do browser quyết định, KHÔNG đổi được — Chrome/Firefox
// bỏ qua chuỗi trả về và luôn hiện câu mặc định của họ.

const PENDING_TITLE = '● Đang ghi nhận cuộc gọi...'

function apiBase() {
  return window.location.host === 'dmcltk.stdmcl.com:8099'
    ? process.env.VUE_APP_BASE_API
    : process.env.VUE_APP_BASE_API_DEV
}

// Ghép URL updateticketrecord kèm tham số user như utils/fetch.js đang làm
function recordUrl() {
  let path = ''
  try {
    const user = getUser()
    if (user) path = '&' + JSON.parse(user).join('&')
  } catch (e) {
    path = ''
  }
  return apiBase() + '/restful/updateticketrecord?' + path
}

export default {
  data() {
    return {
      // số cuộc gọi đang chờ updateRecord (đếm để gọi nhiều lần không bị hở)
      callPendingCount: 0,
      // FormData của record chưa lưu xong -> dùng cho sendBeacon
      callBeaconData: null,
      titleBeforeCall: ''
    }
  },
  computed: {
    isCallPending() {
      return this.callPendingCount > 0
    }
  },
  watch: {
    // Đổi title để user đang ở tab khác vẫn thấy còn cuộc gọi chưa ghi nhận xong
    isCallPending(pending) {
      if (pending) {
        if (document.title !== PENDING_TITLE) this.titleBeforeCall = document.title
        document.title = PENDING_TITLE
      } else if (this.titleBeforeCall) {
        document.title = this.titleBeforeCall
        this.titleBeforeCall = ''
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.onBeforeUnloadCall)
    window.addEventListener('pagehide', this.onPageHideCall)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeUnloadCall)
    window.removeEventListener('pagehide', this.onPageHideCall)
    // component chết giữa lúc pending -> trả lại title, tránh treo title lạ
    if (this.titleBeforeCall) {
      document.title = this.titleBeforeCall
      this.titleBeforeCall = ''
    }
  },
  methods: {
    startCallGuard() {
      this.callPendingCount += 1
    },
    endCallGuard() {
      if (this.callPendingCount > 0) this.callPendingCount -= 1
    },
    resetCallGuard() {
      this.callPendingCount = 0
    },
    // giữ payload để nếu user vẫn đóng tab thì bắn beacon
    setCallBeacon(formData) {
      this.callBeaconData = formData
    },
    clearCallBeacon() {
      this.callBeaconData = null
    },
    onBeforeUnloadCall(event) {
      if (!this.isCallPending) return undefined
      // gán cả 2 cách cho tương thích đủ browser
      event.preventDefault()
      event.returnValue =
        'Cuộc gọi đang được ghi nhận, đóng bây giờ sẽ mất dữ liệu ghi âm.'
      return event.returnValue
    },
    // User bấm Leave (hoặc tab bị ẩn hẳn) -> đẩy record đi bằng beacon
    onPageHideCall() {
      if (!this.callBeaconData) return
      if (!navigator.sendBeacon) return
      try {
        navigator.sendBeacon(recordUrl(), this.callBeaconData)
      } catch (e) {
        // im lặng: đang unload, không hiện thông báo được nữa
      }
      this.clearCallBeacon()
    }
  }
}
