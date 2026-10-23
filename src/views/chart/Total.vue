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
        <el-select v-model="form.device" placeholder="Chi nhánh">
          <el-option
            v-for="rule in [{code:1,name:'Tất cả'},{code:2,name:'App'},{code:3,name:'Delivery'}]"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          /> </el-select
      ></el-col>
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
      ref="mainTable"
      :data="paginationslice(tableData, 10, page)"
      border
      stripe
      row-key="code_store_rate"
      row-class-name="clickable-row"
      style="width: 100%; margin-top: 8px"
      @expand-change="handleExpand"
      @row-click="handleRowClick"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div
            v-loading="!!detailLoading[props.row.code_store_rate]"
          >
            <el-table
              v-if="
                detailCache[props.row.code_store_rate] &&
                detailCache[props.row.code_store_rate].length
              "
              :data="detailCache[props.row.code_store_rate]"
              border
              stripe
              size="mini"
              style="width: 100%;"
            >
              <el-table-column
                prop="code_store"
                label="Mã CN xử lý"
                width="120"
              />
              <el-table-column
                prop="name_store"
                label="Tên CN xử lý"
                min-width="160"
              />
              <el-table-column
                prop="count_ticket"
                label="Số ticket"
                align="right"
                width="120"
              />
              <el-table-column
                prop="percent_ticket"
                label="% trên CN nhận"
                align="right"
                width="140"
              >
                <template slot-scope="{ row }">
                  {{ row.percent_ticket }}%
                </template>
              </el-table-column>
            </el-table>
            <div
              v-else-if="!detailLoading[props.row.code_store_rate]"
              style="text-align: center; color: #999; padding: 12px"
            >
              Không có chi nhánh xử lý giùm
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="code_store_rate"
        label="Mã CN Nhận"
        width="120"
      >
        <template slot-scope="{ row }">
          <span style="color: #409eff; font-weight: 600; text-decoration: underline">
            {{ row.code_store_rate }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name_store"
        label="Tên CN Nhận"
        min-width="160"
      />
      <el-table-column
        prop="count_code_store_rate"
        label="Tự xử lý"
        align="right"
        width="110"
      />

      <el-table-column
        prop="count_code_store"
        label="Xử lý giùm CN khác"
        align="right"
        width="170"
      />

      <el-table-column
        prop="count_total_ticket"
        label="Tổng ticket"
        align="right"
        width="120"
      />
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
      type="donut"
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
      form: {
        type: 5,
        code_store: "",
        date_cre_date_start: "",
        date_cre_date_end: "",
        device:3,
        approved:1
      },
      page:1,
      loading: false,
      tableData: [],
      detailCache: {},
      detailLoading: {},
      series: [],
      options: {
        chart: {
          type: "donut",
        },
        labels: ["Xử lý dùm", "Tự xử lý"],
        colors: ["#1682e6", "#11b95c"],
        legend: {
          position: "bottom",
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex] + " (" + val.toFixed(1) + "%)";
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Tổng ticket",
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  },
                },
              },
            },
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { width: 300 },
              legend: { position: "bottom" },
            },
          },
        ],
      },

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
    handleRowClick(row, column) {
      if (column && column.type === "expand") return;
      this.$refs.mainTable.toggleRowExpansion(row);
    },
    handlePage(page) {
      this.paginationslice(this.tableData, 10, page);
    },
    paginationslice(data, pagesize, page) {
      this.page = page;

      return data.filter((value, n) => {
        return n >= pagesize * (page - 1) && n < pagesize * page;
      });
    },
    async handleExpand(row, expandedRows) {
      const isExpanded = expandedRows.some(
        (r) => r.code_store_rate === row.code_store_rate
      );
      if (!isExpanded) return;
      if (this.detailCache[row.code_store_rate]) return;

      this.$set(this.detailLoading, row.code_store_rate, true);
      try {
        const params = new URLSearchParams({
          code_store_rate: row.code_store_rate,
        });

        const { data, status } = await request({
          url: `/restful/listcrosshandlerbranch?${params.toString()}`,
          method: "get",
        });
        if (status === 200) {
          this.$set(
            this.detailCache,
            row.code_store_rate,
            Array.isArray(data) ? data : []
          );
        }
      } finally {
        this.$set(this.detailLoading, row.code_store_rate, false);
      }
    },
    async handleSearch() {
      this.loading = true;
      this.detailCache = {};
      this.detailLoading = {};
      const store = this.form.code_store ? this.form.code_store.join(",") : "";

      const month_start = this.form.date_cre_date_start
        ? this.$moment(this.form.date_cre_date_start).format("YYYY-MM-DD")
        : "";
      const month_end = this.form.date_cre_date_end
        ? this.$moment(this.form.date_cre_date_end).format("YYYY-MM-DD")
        : "";

      const item = {
        type: this.form.type,
        store: store,
        date_cre_date_start: month_start,
        date_cre_date_end: month_end,
      };
      if (this.form.device === 2) {
        item.device = "app";
      } else if (this.form.device === 3) {
        item.device = "deli";
      }

      if(this.form.approved != 1){
        item.approved = this.form.approved;
      }

      const queryString = new URLSearchParams(item).toString();

      try {
        const { data, status } = await request({
          url: `/restful/liststoreratematch?${queryString}`,
          method: "get",
        });
        if (status === 200 && Array.isArray(data)) {
          this.tableData = data;
          const totalXuLyDum = data.reduce(
            (sum, item) => sum + (Number(item.count_code_store) || 0),
            0
          );
          const totalTuXuLy = data.reduce(
            (sum, item) => sum + (Number(item.count_code_store_rate) || 0),
            0
          );
          this.series = [totalXuLyDum, totalTuXuLy];
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
::v-deep .clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
::v-deep .clickable-row:hover > td {
  background-color: #ecf5ff !important;
}
</style>

