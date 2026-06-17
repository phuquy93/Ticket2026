<template>
  <div class="left-menu">
    <a href="/" class="hamburger-container" @click.prevent="handleMenu">
      <i v-if="isMobi" class="fa fa-outdent" aria-hidden="true" />

      <i
        v-else
        :class="[
          { 'fa fa-indent': isCollapse },
          { 'fa fa-outdent': !isCollapse },
        ]"
        aria-hidden="true"
      />
    </a>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    isMobi() {
      return screen.width < 767
    },
    isCollapse() {
      return this.$store.state.settings.sidebar.opened && screen.width
    }
  },

  methods: {
    handleMenu() {
      this.$store.dispatch('settings/changeIscollapse', !this.isCollapse)
    }
  }
}
</script>
