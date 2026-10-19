<template>
  <status-dashboard
    title="Ticket lắp đặt"
    icon="fas fa-tools"
    :data="data || []"
    :statuses="statuses"
    all-path="/manage/install"
    :show-all="false"
    :loading="loading"
    guarded
  />
</template>

<script>
import StatusDashboard from "@/components/StatusDashboard/index.vue";
import { makeStatus } from "@/components/StatusDashboard/status";
import { Message } from "element-ui";
import { removeData } from "@/utils/auth.js";

export default {
  components: { StatusDashboard },
  data() {
    return {
      loading: false,
      statuses: [
        makeStatus(0, "Mới tạo", "/manage/installnew"),
        makeStatus(2, "Cần thẩm định", "/manage/installrequest"),
        makeStatus(5, "Yêu cầu xử lý lại", "/manage/installconfirm"),
        makeStatus(3, "Đợi ra biên bản", "/manage/installwaitreport"),
        makeStatus(6, "Đã ra biên bản", "/manage/installreport"),
        makeStatus(4, "Đã xử lý", "/manage/installcancel"),
      ],
    };
  },
  computed: {
    data() {
      return this.$store.state.ticket.data;
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      this.$store
        .dispatch("ticket/getDashboardinstall")
        .then((res) => {
          this.loading = false;
          if (Number(res.status) !== 200) {
            Message({ message: res.message, type: "error", duration: 5000 });
            removeData("jwt");
            removeData("ticket_user");
            this.$router.push({ path: "/login" });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
