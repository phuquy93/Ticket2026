<template>
  <div>
    <div id="printMe" class="detailprint" style="font-size: 16px" />
    <div style="text-align: right; margin-top: 30px">
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-button
            v-print="'#printMe'"
            type="danger"
            icon="el-icon-printer"
          >In</el-button>
        </div>

        <el-button
          icon="el-icon-close"
          @click="closePopupPrint"
        >Đóng</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    closePopupPrint() {
      this.$emit('handlePrint', false)
    }
  }
}
</script>

<style>
.popupprint {
  width: 60% !important;
}
</style>
