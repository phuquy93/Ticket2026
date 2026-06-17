<template>
  <el-dialog
    :visible.sync="dialogVisibleDetail"
    title="Chi tiết Record"
    :before-close="handleClose"
  >
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
      <el-table-column prop="linkedId" label="Call ID" />
      <el-table-column prop="callFrom" label="Source" />
      <el-table-column prop="dateTimeCallStarted" label="Time Star Call" />
      <el-table-column prop="dateTimeCallAnswer" label="Time Answer Call" />
      <el-table-column prop="dateTimeEndCall" label="Time End Call" />
      <el-table-column label="Talk Time">
        <template slot-scope="scope">
          {{ returnTime(scope.row.answerSeconds) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="hangupBy" label="Hangup By" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'ComponentTicketPopupDetail',
  props: ['dialogVisibleDetail', 'detail', 'reCordDetail'],
  data() {
    return {
      loading: false,

      processCall: process.env.VUE_APP_BASE_CALL,

      tableData: []
    }
  },
  created() {
    this.loading = true
    fetch(
      this.processCall + '/webservice/getCallLog?linkedId=' + this.reCordDetail,
      {
        method: 'POST'
      }
    )
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        if (res.code === '200' && res.lines) {
          this.tableData = res.lines
        } else {
          this.tableData = []
        }
        this.loading = false
      })
  },
  methods: {
    handleClose() {
      this.$parent.recordStatus(false)
    },
    returnTime(seconds) {
      if (seconds !== '0') {
        let minutes = Math.floor(seconds / 60)
        let extraSeconds = seconds % 60
        minutes = minutes < 10 ? '0' + minutes : minutes
        extraSeconds = extraSeconds < 10 ? '0' + extraSeconds : extraSeconds
        return '00:' + minutes + ':' + extraSeconds
      }
      return
    }
  }
}
</script>

<style>
.box .hide {
  display: none;
}
.full .el-table__row td:last-child .cell {
  display: block;
  max-height: none;
}
</style>
