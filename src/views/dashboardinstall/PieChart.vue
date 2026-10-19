<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { constantRoutes } from "@/router";

export default {
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "400px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    data() {
      return this.$store.state.ticket.data;
    },
    user() {
      return this.$store.state.user.user;
    },
  },
  watch: {
    data(newData, oldData) {
      if (newData !== oldData) {
        this.initChart();
      }
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    disabledRule(path) {
      function findRouteByPath(routes, targetPath) {
        for (const route of routes) {
          if (route.path === targetPath) {
            return route;
          }
          if (route.children && route.children.length) {
            const found = findRouteByPath(route.children, targetPath);
            if (found) return found;
          }
        }
        return null;
      }

      const route = findRouteByPath(constantRoutes, path);
      let roles = route?.meta?.roles ?? [];
      let find = roles.find(
        (a) =>
          Number(a) ===
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          )
      );
      if (find) return false;
      return true;
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          bottom: "10",
          data: [
            "Mới",
            // 'Đang xử lý',
            "Cần thẩm định",
            "Yêu cầu xử lý lại",
            "Đợi ra biên bản",
            "Đã ra biên bản",
            "Đã xử lý",
          ],
        },
        series: [
          {
            name: "WEEKLY WRITE ARTICLES",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: [
              {
                value: this.data.find((a) => a.approved === 0)
                  ? this.data.find((a) => a.approved === 0).count_ticket
                  : 0,
                name: "Mới",
              },
              // {
              //   value: this.data.find((a) => a.approved === 1)
              //     ? this.data.find((a) => a.approved === 1).count_ticket
              //     : 0,
              //   name: "Đang xử lý",
              // },
              {
                value: this.data.find((a) => a.approved === 2)
                  ? this.data.find((a) => a.approved === 2).count_ticket
                  : 0,
                name: "Cần thẩm định",
              },

              {
                value: this.data.find((a) => a.approved === 5)
                  ? this.data.find((a) => a.approved === 5).count_ticket
                  : 0,
                name: "Yêu cầu xử lý lại",
              },
              {
                value: this.data.find((a) => a.approved === 3)
                  ? this.data.find((a) => a.approved === 3).count_ticket
                  : 0,
                name: "Đợi ra biên bản",
              },
              {
                value: this.data.find((a) => a.approved === 6)
                  ? this.data.find((a) => a.approved === 6).count_ticket
                  : 0,
                name: "Đã ra biên bản",
              },
              {
                value: this.data.find((a) => a.approved === 4)
                  ? this.data.find((a) => a.approved === 4).count_ticket
                  : 0,
                name: "Đã xử lý",
              },
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });

      this.chart.on("click", (params) => {
        if (params.dataIndex == 0) {
          if (!this.disabledRule("/manage/installnew")) {
            this.$router.push({
              name: "Ticketinstallnew",
              params: { type: "installnew" },
            });
          }
        } else if (params.dataIndex == 1) {
          if (!this.disabledRule("/manage/installrequest")) {
            this.$router.push({
              name: "Requestinstall",
              params: { type: "requestinstall" },
            });
          }
        } else if (params.dataIndex == 2) {
          if (!this.disabledRule("/manage/installconfirm")) {
            this.$router.push({
              name: "Confirminstall",
              params: { type: "confirminstall" },
            });
          }
        } else if (params.dataIndex == 3) {
          if (!this.disabledRule("/manage/installwaitreport")) {
            this.$router.push({
              name: "Waitreportinstall",
              params: { type: "waitreportinstall" },
            });
          }
        } else if (params.dataIndex == 4) {
          if (!this.disabledRule("/manage/installreport")) {
            this.$router.push({
              name: "Reportinstall",
              params: { type: "reportinstall" },
            });
          }
        } else {
          if (!this.disabledRule("/manage/installcancel")) {
            this.$router.push({
              name: "Cancelinstall",
              params: { type: "cancelinstall" },
            });
          }
        }
      });
    },
  },
};
</script>
