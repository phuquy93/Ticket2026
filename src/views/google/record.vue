<template>
  <div class="app-container list-page">
    <div class="filter-card">
    <el-row class="search">
      <el-col :span="5">
        <el-select v-model="select" placeholder="Select">
          <el-option
            v-for="item in selects"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="form.tienphat" placeholder="Tiền phạt">
          <el-option
            v-for="rule in [
              { code: '', name: 'Tùy chọn phạt' },
              { code: 0, name: 'Không phạt' },
              { code: 1, name: 'Có phạt' },
            ]"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          /> </el-select
      ></el-col>
      <el-col :span="5" v-if="select === 1">
        <el-select
          v-model="form.date"
          placeholder="Chọn ngày"
          :loading="loading"
        >
          <el-option
            v-for="d in dates"
            :key="d.date"
            :value="d.date"
            :label="d.date"
          /> </el-select
      ></el-col>
      <el-col :span="5" v-if="select === 2">
        <el-select
          v-model="form.date_start"
          placeholder="Chọn ngày"
          :loading="loading"
        >
          <el-option
            v-for="d in dates"
            :key="d.date"
            :value="d.date"
            :label="d.date"
          /> </el-select
      ></el-col>
      <el-col :span="5" v-if="select === 2">
        <el-select
          v-model="form.date_end"
          placeholder="Chọn ngày"
          :loading="loading"
        >
          <el-option
            v-for="d in dates"
            :key="d.date"
            :value="d.date"
            :label="d.date"
          /> </el-select
      ></el-col>
    </el-row>
      <div class="filter-actions">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          Tìm kiếm
        </el-button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-card__head">
        <div class="table-legend" v-if="lists && lists.length">
          <span class="table-legend__box"></span>
          <span>Yêu cầu xử lý</span>
        </div>
        <div class="table-card__actions">
          <el-button
            style="margin-bottom: 5px"
            type="primary"
            icon="el-icon-download"
            @click="exportExcelOne()"
          >
            Excel xuất đếm số sao google
          </el-button>
          <el-button
            style="margin-bottom: 5px"
            type="primary"
            icon="el-icon-download"
            @click="exportExcelcriterion()"
          >
            Excel xuất đếm sao sánh google
          </el-button>
        </div>
      </div>
    <el-table
      v-if="tab === 1"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="Mã chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.machinhanh }}
        </template>
      </el-table-column>
      <el-table-column label="Tên Chi Nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name_store }}
        </template>
      </el-table-column>
      <el-table-column label="Số Sao Ngày bắt đầu" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.avg_rate_date_start }}
        </template>
      </el-table-column>
      <el-table-column label="Tổng Số Lượt Vote" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.total_rate_date_start }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 2"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%"
      border
    >
      <el-table-column label="Mã chi nhánh" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.machinhanh }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name_store }}
        </template>
      </el-table-column>
      <el-table-column label="Số Sao Ngày bắt đầu" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.avg_rate_date_start }}
        </template>
      </el-table-column>
      <el-table-column label="Tổng Số Lượt Vote bắt đầu" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.total_rate_date_start }}
        </template>
      </el-table-column>
      <el-table-column label="Số Sao Ngày kết thúc" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.avg_rate_date_end }}
        </template>
      </el-table-column>
      <el-table-column label="Tổng Số Lượt Vote ngày kết thúc" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.total_rate_date_end }}
        </template>
      </el-table-column>
      <el-table-column label="Chênh lực số sao" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.avg_rate_compare }}
        </template>
      </el-table-column>
      <el-table-column label="Chênh lực số vote" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.total_rate_compare }}
        </template>
      </el-table-column>
    </el-table>

      <el-pagination
        :current-page.sync="page"
        :page-size="10"
        :pager-count="11"
        layout="total,prev, pager, next"
        :total="lists.length"
        @current-change="handlePage"
      />
    </div>
  </div>
</template>

<script>
import { getRecord } from "@/api/record";
import { request } from "@/utils/fetch";

let url = "";

if (window.location.host === "dmcltk.stdmcl.com:8099") {
  url = process.env.VUE_APP_BASE_API;
} else {
  url = process.env.VUE_APP_BASE_API_DEV;
}

export default {
  name: "ComponentCompleted",
  data() {
    return {
      loading: false,

      form: {
        tienphat: "",
        date: "",
        date_start: "",
        date_end: "",
      },
      process: url,

      tab: 1,

      page: 1,

      lists: [],

      select: 1,
      selects: [
        {
          id: 1,
          label: "Báo cáo số sao google",
        },
        {
          id: 2,
          label: "Báo cáo so sánh google",
        },
      ],

      dates: [],
    };
  },
  computed: {
    stores() {
      const arr = [];
      const store = this.user
        .find((a) => a.split("=")[0] === "code_store")
        .split("=")[1];
      if (store !== "") {
        store.split(",").forEach((a) => {
          this.$store.state.store.stores.forEach((b) => {
            if (b.code === a) {
              arr.push(b);
            }
          });
        });
        return arr;
      } else {
        return this.$store.state.store.stores;
      }
    },
    user() {
      return this.$store.state.user.user;
    },
  },

  created() {
    this.loading = true;
    request({
      url: "/restful/listdategoogle?",
      method: "get",
    }).then((res) => {
      this.dates = res.data;
      this.loading = false;
    });
  },
  methods: {
    tableRowClassName({ row }) {
      return row.show_color === 1 ? "warning-row" : "";
    },
    handlePage(page) {
      this.paginationslice(this.lists, 10, page);
    },
    handleSearch() {
      this.page = 1;

      if (this.select === 1) {
        this.getrecord({
          url: `/restful/listexportrategoogle?date=${this.form.date}`,
          tab: this.select,
        });
      } else if (this.select === 2) {
        this.getrecord({
          url: `/restful/listexportcomparegoogle?date_start=${this.form.date_start}&date_end=${this.form.date_end}`,
          tab: this.select,
        });
      }
    },
    status(data) {
      delete data.machinhanh;
      delete data.manv;
      return data;
    },
    async getrecord(data) {
      this.loading = true;
      this.tab = data.tab;
      data.url = data.url + "&tienphat=" + this.form.tienphat;

      const res = await getRecord({ url: data.url });

      if (res.status === 200) {
        this.lists = [];

        Object.entries(res.data).forEach((a) => {
          const item = {};
          item.machinhanh = a[1].code_store;
          item.name_store = a[1].name_store;
          if (this.select == 1) {
            item.avg_rate_date_start = a[1].avg_rate_date_start;
            item.total_rate_date_start = a[1].total_rate_date_start;
          } else {
            item.avg_rate_date_start = a[1].avg_rate_date_start;
            item.total_rate_date_start = a[1].total_rate_date_start;
            item.avg_rate_date_end = a[1].avg_rate_date_end;
            item.total_rate_date_end = a[1].total_rate_date_end;
            item.avg_rate_compare = a[1].avg_rate_compare;
            item.total_rate_compare = a[1].total_rate_compare;
          }

          this.lists.push(item);
        });
      }
      this.loading = false;
    },
    paginationslice(data, pagesize, page) {
      this.page = page;

      return data.filter((value, n) => {
        return n >= pagesize * (page - 1) && n < pagesize * page;
      });
    },
    exportExcelOne() {
      console.log(
        `${this.process}/restful/exportrategoogle?date=${
          this.form.date
        }&${this.user.join("&")}&tienphat=${this.form.tienphat}`
      );

      window.open(
        `${this.process}/restful/exportrategoogle?date=${
          this.form.date
        }&${this.user.join("&")}&tienphat=${this.form.tienphat}`
      );
    },

    exportExcelcriterion() {
      console.log(
        `${this.process}/restful/exportcomparegoogle?date_start=${
          this.form.date_start
        }&date_end=${this.form.date_end}&${this.user.join("&")}&tienphat=${
          this.form.tienphat
        }`
      );

      window.open(
        `${this.process}/restful/exportcomparegoogle?date_start=${
          this.form.date_start
        }&date_end=${this.form.date_end}&${this.user.join("&")}&tienphat=${
          this.form.tienphat
        }`
      );
    },
  },
};
</script>
