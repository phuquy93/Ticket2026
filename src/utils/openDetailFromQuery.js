import { Message } from 'element-ui'

// Mở sẵn popup chi tiết khi URL có id ticket, các kiểu viết đều được:
//   /manage/new?id=187542
//   /manage/qc/online?id=187542#approved=0
//   /manage/qc/online#approved=0&id=187542
//   /manage/qc/online#approved=0?id=187542
//
// Luồng:
//   created            -> gán form.id = id (trước khi trang gọi getLists(1))
//   lists được gán     -> tìm dòng có id tương ứng -> handleDetail(row)
//                      -> đồng bộ ?id trên URL theo ô "Nhập id" (xóa ô thì xóa ?id)
//   đổi id cùng trang  -> AppMain key theo path nên không remount, watch id rồi tìm lại
//
// Yêu cầu trang dùng mixin có: form.id, lists.data, getLists(page), handleDetail(row).

// Đọc tham số từ query (?name=) hoặc từ hash (#a=1&name= / #a=1?name=)
export function routeParam(route, name) {
  if (route.query[name] !== undefined && route.query[name] !== null) {
    return String(route.query[name]).trim()
  }
  const m = (route.hash || '').match(new RegExp('[#&?]' + name + '=([^&?#]*)'))
  return m ? decodeURIComponent(m[1]).trim() : ''
}

// Bỏ 1 tham số khỏi hash: #approved=0&id=1 -> #approved=0
function removeHashParam(hash, name) {
  const parts = (hash || '').replace(/^#/, '').split(/[&?]/)
    .filter(p => p && p.split('=')[0] !== name)
  return parts.length ? '#' + parts.join('&') : ''
}

export default {
  data() {
    return {
      pendingDetailId: null,
      // id vừa được ghi lên URL do tìm kiếm -> watcher bỏ qua, không mở popup
      syncedRouteId: null
    }
  },
  computed: {
    routeDetailId() {
      return routeParam(this.$route, 'id')
    }
  },
  created() {
    this.applyRouteDetailId()
  },
  watch: {
    routeDetailId(id) {
      if (this.syncedRouteId !== null && id === this.syncedRouteId) {
        this.syncedRouteId = null
        return
      }
      if (!id) return
      this.applyRouteDetailId()
      this.page = 1
      this.getLists(1)
    },
    lists() {
      this.syncRouteDetailId()
      this.openPendingDetail()
    }
  },
  methods: {
    routeParam(name) {
      return routeParam(this.$route, name)
    },
    applyRouteDetailId() {
      const id = this.routeDetailId
      if (!id) return
      this.$set(this.form, 'id', id)
      this.pendingDetailId = id
    },
    // Ghi id đang tìm kiếm lên ?id, giữ nguyên hash (#approved=...)
    syncRouteDetailId() {
      const id = String(this.form.id || '').trim()
      const route = this.$route
      const hash = removeHashParam(route.hash, 'id')
      if (route.query.id === (id || undefined) && hash === (route.hash || '')) return

      const query = { ...route.query }
      if (id) query.id = id
      else delete query.id

      // Chỉ đánh dấu khi id thực sự đổi (watcher routeDetailId mới chạy)
      if (id !== this.routeDetailId) this.syncedRouteId = id
      this.$router.replace({ path: route.path, query, hash }, () => {}, () => {
        this.syncedRouteId = null
      })
    },
    openPendingDetail() {
      if (!this.pendingDetailId) return
      const id = this.pendingDetailId
      this.pendingDetailId = null
      const row = ((this.lists && this.lists.data) || []).find(r => String(r.id) === id)
      if (row) {
        this.handleDetail(row)
      } else {
        Message({
          message: `Không tìm thấy ticket #${id} trong danh sách này`,
          type: 'warning',
          duration: 5 * 1000
        })
      }
    }
  }
}
