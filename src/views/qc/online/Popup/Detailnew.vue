<template>
  <div>
    <el-table :data="data" style="width: 100%" border v-loading="loading">
      <el-table-column prop="linkedId" label="Call ID">
        <template slot-scope="scope">
          {{ scope.row.details[0].linkedId }}
        </template>
      </el-table-column>
      <el-table-column prop="src" label="Source" />
      <el-table-column prop="dateTimeCallStarted" label="Time Star Call">
        <template slot-scope="scope">
          {{ formatTime(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="dateTimeCallAnswer" label="Time Answer Call">
        <template slot-scope="scope">
          <span v-if="!!scope.row.answerTime">
            {{ formatTime(scope.row.answerTime) }}</span
          >
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column prop="dateTimeEndCall" label="Time End Call">
        <template slot-scope="scope">
          {{ formatTime(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="callStatus" label="Status" />
      <el-table-column prop="hangupBy" label="Hangup By">
        <template slot-scope="scope">
          {{ scope.row.hangupBy }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ComponentTicketPopupDetail",
  props: ["dialogVisibleDetail", "detailnew", "url"],
  data() {
    return {
      processCall: process.env.VUE_APP_BASE_CALL,
      loading: false,
      data: [],
    };
  },
  created() {
    this.loading = true;

    fetch(`${this.url}/restful/accountcall`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((dataUser) => {
        let formData = new FormData();
        Object.entries(this.detailnew).forEach((a) => {
          formData.append(a[0], a[1]);
        });
        fetch(
          `${this.url}/restful/callData?XAccountCode=dmcl_api&XAccessToken=${dataUser.data.data.accessToken}`,
          {
            method: "POST",
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((resinfocall) => {
            this.data = resinfocall.data.data.cdr;
            this.loading = false;
          });
      });
  },
  methods: {
    handleClose() {
      this.$emit("record-status");
    },
    formatTime(seconds) {
      return new Date(seconds).toLocaleString("sv-SE");
    },
  },
};
</script>
