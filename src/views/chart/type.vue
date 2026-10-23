<template>
  <div>
    <el-row class="search">
      <el-col :span="4">
        <el-select v-model="form.type" placeholder="Loại ticket">
          <el-option
            v-for="rule in types"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="form.device" placeholder="Kênh">
          <el-option
            v-for="rule in [{code:1,name:'Tất cả'},{code:2,name:'App'},{code:3,name:'Delivery'}]"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="form.code_store"
          filterable
          multiple
          collapse-tags
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
        <el-select v-model="form.approved" placeholder="Trạng thái">
          <el-option
            v-for="rule in [{code:1,name:'Tất cả'},{code:0,name:'Mới tạo'},{code:10,name:'Hợp lệ'}]"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          /> </el-select
      ></el-col>
      <el-col :span="4">
        <el-date-picker
          v-model="form.date_cre_date_start"
          type="date"
          placeholder="Ngày bắt đầu"
        />
      </el-col>
      <el-col :span="4">
        <el-date-picker
          v-model="form.date_cre_date_end"
          type="date"
          placeholder="Ngày kết thúc"
        />
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

    <el-table
      v-if="tableData.length"
      :data="paginationslice(tableData, 10, page)"
      border
      stripe
      size="mini"
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column
        prop="code_store_rate"
        label="Mã CN"
        width="90"
        fixed
      />
      <el-table-column
        prop="name_store"
        label="Tên CN Nhận"
        min-width="130"
        fixed
      />
      <el-table-column
        v-for="typeName in typesList"
        :key="typeName"
        :label="typeName"
        align="left"
        min-width="120"
      >
        <template slot-scope="{ row }">
          <div style="line-height: 1.4; font-size: 12px">
            <div style="color: #11b95c">
              Tự xử lý: {{ getTypeMetric(row, typeName, "count_code_store_rate") }}
            </div>
            <div style="color: #1682e6">
              Xử lý giùm: {{ getTypeMetric(row, typeName, "count_code_store") }}
            </div>
            <div style="color: #303133; font-weight: 600">
              Tổng: {{ getTypeMetric(row, typeName, "count_total_ticket") }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="Tổng theo CN"
        align="left"
        width="120"
      >
        <template slot-scope="{ row }">
          <div style="line-height: 1.4; font-size: 12px">
            <div style="color: #11b95c">
              Tự XL: {{ row.count_code_store_rate || 0 }}
            </div>
            <div style="color: #1682e6">
              Giùm: {{ row.count_code_store || 0 }}
            </div>
            <div style="color: #303133; font-weight: 600">
              Tổng: {{ row.count_total_ticket || 0 }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="!!tableData.length"
      :current-page.sync="page"
      :page-size="10"
      :pager-count="11"
      layout="total,prev, pager, next"
      :total="tableData.length"
      @current-change="handlePage"
    />

    <apexchart
      v-if="!loading && chartCategories.length"
      type="bar"
      height="500"
      :options="chartOptions"
      :series="chartSeries"
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
      form: {
        type: 5,
        code_store: "",
        date_cre_date_start: "",
        date_cre_date_end: "",
        device: 3,
        approved: 1
      },
      page: 1,
      loading: false,
      tableData: [],
      typesList: [],
      chartCategories: [],
      chartSeries: [],
      types: [
        { code: -1, name: "Tất cả" },
        { code: 0, name: "Ticket khách hàng" },
        { code: 1, name: "Ticket nhân viên" },
        { code: 10, name: "Ticket đổi trả" },
        { code: 11, name: "Ticket cuộc gọi" },
        { code: 12, name: "Ticket info - google" },
        { code: 6, name: "Ticket giao hàng" },
        { code: 5, name: "Ticket online" },
        { code: 3, name: "Ticket vật tư" },
        { code: 4, name: "Ticket cuộc gọi khẩn" },
      ],
    };
  },
  computed: {
    stores() {
      return this.$store.state.store.stores;
    },
    chartOptions() {
      return {
        chart: {
          type: "bar",
          stacked: true,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            dataLabels: { total: { enabled: true, style: { fontWeight: 700 } } },
          },
        },
        colors: ["#11b95c", "#1682e6"],
        dataLabels: { enabled: true },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
          categories: this.chartCategories,
          labels: { rotate: -25, trim: true, style: { fontSize: "12px" } },
        },
        yaxis: { title: { text: "Số ticket" } },
        fill: { opacity: 1 },
        legend: { position: "top" },
        tooltip: {
          y: { formatter: (val) => `${val} ticket` },
        },
      };
    },
  },
  created() {
    if (this.$store.state.store.stores.length === 0) {
      this.$store.dispatch("store/getStores");
    }
  },
  methods: {
    handlePage(page) {
      this.paginationslice(this.tableData, 10, page);
    },
    paginationslice(data, pagesize, page) {
      this.page = page;
      return data.slice(pagesize * (page - 1), pagesize * page);
    },
    getTypeMetric(row, typeName, key) {
      if (row && row.types && row.types[typeName]) {
        return row.types[typeName][key] || 0;
      }
      return 0;
    },
    async handleSearch() {
      this.loading = true;
      this.page = 1;
      const store = this.form.code_store ? this.form.code_store.join(",") : "";
      const month_start = this.form.date_cre_date_start
        ? this.$moment(this.form.date_cre_date_start).format("YYYY-MM-DD")
        : "";
      const month_end = this.form.date_cre_date_end
        ? this.$moment(this.form.date_cre_date_end).format("YYYY-MM-DD")
        : "";

      const params = new URLSearchParams({
        page: 1,
        approved: "",
        store: store,
        date_cre_date_start: month_start,
        date_cre_date_end: month_end,
        phone: "",
        type: this.form.type,
        tienphat: "",
        code_store: "",
      });
      if (this.form.device === 2) params.append("device", "app");
      else if (this.form.device === 3) params.append("device", "deli");
      if (this.form.approved !== 1) {
        params.append("approved", this.form.approved);
      }

      try {
        const res = await request({
          url: `/restful/liststoreratetype?${params.toString()}`,
          method: "get",
        });
        if (res.status === 200 && Array.isArray(res.data)) {
          this.tableData = res.data;
          this.typesList = Array.isArray(res.types_list)
            ? res.types_list
            : this.extractTypesList(res.data);
          this.buildChart(res.data);
        }
      } finally {
        this.loading = false;
      }
    },
    extractTypesList(data) {
      const set = new Set();
      data.forEach((store) => {
        if (store.types && typeof store.types === "object") {
          Object.keys(store.types).forEach((t) => set.add(t));
        }
      });
      return Array.from(set);
    },
    buildChart(data) {
      const agg = {};
      data.forEach((store) => {
        if (!store.types || typeof store.types !== "object") return;
        Object.entries(store.types).forEach(([typeName, vals]) => {
          if (!agg[typeName]) {
            agg[typeName] = { count_code_store_rate: 0, count_code_store: 0 };
          }
          agg[typeName].count_code_store_rate +=
            Number(vals.count_code_store_rate) || 0;
          agg[typeName].count_code_store +=
            Number(vals.count_code_store) || 0;
        });
      });

      const entries = Object.entries(agg)
        .map(([name, v]) => ({
          name,
          rate: v.count_code_store_rate,
          store: v.count_code_store,
          total: v.count_code_store_rate + v.count_code_store,
        }))
        .sort((a, b) => b.total - a.total);

      this.chartCategories = entries.map((e) => e.name);
      this.chartSeries = [
        { name: "Tự xử lý", data: entries.map((e) => e.rate) },
        { name: "Xử lý giùm CN khác", data: entries.map((e) => e.store) },
      ];
    },
  },
};
</script>
