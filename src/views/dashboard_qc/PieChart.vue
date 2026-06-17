<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme

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
            "Đổi trả",
            "Hợp lệ",
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
              {
                value: this.data.find((a) => a.approved === 9)
                  ? this.data.find((a) => a.approved === 9).count_ticket
                  : 0,
                name: "Đổi trả",
              },
              {
                value: this.data.find((a) => a.approved === 10)
                  ? this.data.find((a) => a.approved === 10).count_ticket
                  : 0,
                name: "Hợp lệ",
              },
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });

      this.chart.on("click", (params) => {
        if (params.dataIndex == 0) {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=0",
          });
        } else if (params.dataIndex == 1) {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=2",
          });
        } else if (params.dataIndex == 2) {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=5",
          });
        } else if (params.dataIndex == 3) {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=3",
          });
        } else if (params.dataIndex == 4) {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=6",
          });
        } else if (params.dataIndex == 5) {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=4",
          });
        } else if (params.dataIndex == 6) {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=9",
          });
        } else {
          this.$router.push({
            name: "Ticketqcticket",
            params: { type: "ticketqcticket" },
            hash: "#approved=10",
          });
        }
      });
    },
  },
};
</script>
