<template>
  <div class="app-wrapper" :class="{ hideMenu: isCollapse }">
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <!-- Chỉ hiện trên mobile (nút ☰ mở menu); tài khoản/Profile/Thoát nằm ở cuối sidebar -->
      <div class="navbar">
        <Breadcrumb />
      </div>
      <Tabview />
      <AppMain />
    </div>
  </div>
</template>

<script >
import { AppMain, Breadcrumb, Sidebar, Tabview } from './components'

export default {
  name: 'Layout',
  components: { Sidebar, Breadcrumb, AppMain, Tabview },
  computed: {
    isCollapse() {
      return this.$store.state.settings.sidebar.opened
    }
  }
}
</script>
