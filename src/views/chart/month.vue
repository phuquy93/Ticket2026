<template>
  <div>
    <el-row class="search">
      <el-col :span="4">
        <el-select v-model="form.type" placeholder="Chi nhánh">
          <el-option
            v-for="rule in types"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          /> </el-select
      ></el-col>
      <el-col :span="4">
        <el-select
          v-model="form.code_store"
          filterable
          multiple
          placeholder="Chọn chi nhánh"
        >
          <el-option
            v-for="rule in stores"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="form.month_start" placeholder="Tháng bắt đầu">
          <el-option
            v-for="rule in month"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="form.month_end" placeholder="Tháng kết thúc">
          <el-option
            v-for="rule in month"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
          v-loading="loading"
        >
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>

    <apexchart
      type="line"
      height="500"
      :options="options"
      :series="series"
      v-if="!loading && series.length"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { request } from "@/utils/fetch";
export default {
  components: { apexchart: VueApexCharts },
  data() {
    return {
      series: [],
      options: {
        chart: {
          height: 350,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.5,
          },
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#77B6EA", "#ff4949", "#ffba00"],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        yaxis: {
          min: 0,
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      },
      month: [
        {
          name: "Tháng 1",
          code: 1,
        },
        {
          name: "Tháng 2",
          code: 2,
        },
        {
          name: "Tháng 3",
          code: 3,
        },
        {
          name: "Tháng 4",
          code: 4,
        },
        {
          name: "Tháng 5",
          code: 5,
        },
        {
          name: "Tháng 6",
          code: 6,
        },
        {
          name: "Tháng 7",
          code: 7,
        },
        {
          name: "Tháng 8",
          code: 8,
        },
        {
          name: "Tháng 9",
          code: 9,
        },
        {
          name: "Tháng 10",
          code: 10,
        },
        {
          name: "Tháng 11",
          code: 11,
        },
        {
          name: "Tháng 12",
          code: 12,
        },
      ],
      form: {
        type: -1,
        code_store: "",
        month_start: "",
        month_end: "",
      },
      loading: false,

      types: [
        { code: -1, name: "Tất cả" },
        { code: 0, name: "Ticket khách hàng", color: "#77B6EA" },
        { code: 1, name: "Ticket nhân viên", color: "#ff4949" },
        { code: 10, name: "Ticket đổi trả", color: "#ffba00" },
        { code: 11, name: "Ticket cuộc gọi", color: "#11b95c" },
        { code: 12, name: "Ticket info - google", color: "#b6a2de" },
        { code: 6, name: "Ticket giao hàng", color: "#ffb980" },
        { code: 5, name: "Ticket online", color: "#97b552" },
        { code: 3, name: "Ticket vật tư", color: "#dc69aa" },
        { code: 4, name: "Ticket cuộc gọi khẩn", color: "#1682e6" },
      ],
    };
  },
  computed: {
    stores() {
      return this.$store.state.store.stores;
    },
  },
  created() {
    if (this.$store.state.store.stores.length === 0) {
      this.$store.dispatch("store/getStores");
    }
  },
  methods: {
    async handleSearch() {
      this.loading = true;
      this.series = [];
      let store = !!this.form.code_store ? this.form.code_store.join(",") : "";

      const monthStart = this.form.month_start
        ? String(this.form.month_start).padStart(2, "0")
        : "";
      const monthEnd = this.form.month_end
        ? String(this.form.month_end).padStart(2, "0")
        : "";
      const year = this.$moment().year();

      let month_start = "";
      if (monthStart) {
        month_start = `${year}-${monthStart}-01`;
      }

      let month_end = "";
      if (monthEnd) {
        month_end = this.$moment(`${year}-${monthEnd}-01`)
          .endOf("month")
          .format("YYYY-MM-DD");
      }

      try {
        if (this.form.type === -1) {
          // 1. Gọi API cho từng loại, lưu lại data từng loại
          let allData = [];
          let allTimePoints = new Set();
          let colors = [];

          for (const t of this.types.filter((a) => a.code != -1)) {
            let code = "type=" + t.code;
            if (t.code === 10) {
              code = "type=2&doitra=1";
            } else if (t.code === 11) {
              code = "type=2&doitra=2";
            } else if (t.code === 12) {
              code = "type=2&doitra=3";
            }
            const res = await request({
              url: `/restful/getreportticketbymonth?${code}&store=${store}&date_cre_date_start=${month_start}&date_cre_date_end=${month_end}`,
              method: "get",
            });
            let data = [];
            if (res.status === 200) {
              data = res.data.map((a) => ({
                x: a.month + "/" + a.year,
                y: a.count_ticket,
              }));
              // Gom tất cả mốc thời gian
              data.forEach((d) => allTimePoints.add(d.x));
            }
            allData.push({ name: t.name, color: t.color, data });
            colors.push(t.color);
          }

          // 2. Chuẩn hóa mốc thời gian cho tất cả series
          const timePoints = Array.from(allTimePoints).sort((a, b) => {
            // sort theo năm/tháng tăng dần
            const [ma, ya] = a.split("/").map(Number);
            const [mb, yb] = b.split("/").map(Number);
            return ya !== yb ? ya - yb : ma - mb;
          });

          // 3. Map lại data cho từng loại, nếu thiếu mốc thì y=0
          this.series = allData.map((item) => ({
            name: item.name,
            data: timePoints.map((x) => {
              const found = item.data.find((d) => d.x === x);
              return { x, y: found ? found.y : 0 };
            }),
          }));

          this.options = {
            ...this.options,
            colors: colors,
            xaxis: {
              categories: timePoints,
            },
          };
        } else {
          const t = this.types.find((t) => t.code === this.form.type);
          let code = "type=" + t.code;
          if (this.form.type === 10) {
            code = "type=2&doitra=1";
          } else if (this.form.type === 11) {
            code = "type=2&doitra=2";
          } else if (t.code === 12) {
            code = "type=2&doitra=3";
          }

          const res = await request({
            url: `/restful/getreportticketbymonth?${code}&store=${store}&date_cre_date_start=${month_start}&date_cre_date_end=${month_end}`,
            method: "get",
          });
          if (res.status === 200) {
            const data = res.data
              .map((a) => ({
                x: a.month + "/" + a.year,
                y: a.count_ticket,
              }))
              .sort((a, b) => {
                const [ma, ya] = a.x.split("/").map(Number);
                const [mb, yb] = b.x.split("/").map(Number);
                return ya !== yb ? ya - yb : ma - mb;
              });
            this.series = [
              {
                name: t.name,
                data,
              },
            ];
            this.options = {
              ...this.options,
              colors: [t ? t.color : "#77B6EA"],
              xaxis: {
                categories: data.map((d) => d.x),
              },
            };
          }
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

