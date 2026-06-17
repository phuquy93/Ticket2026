<template>
  <div class="app-container">
    <el-row class="search">
      <el-col :span="5">
        <el-select
          v-model="form.code_store"
          placeholder="Chọn chi nhánh"
          filterable
          multiple
          :loading="loadingStore"
        >
          <el-option
            v-for="rule in stores"
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
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-if="tab === 1"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      border
    >
      <el-table-column label="ID" width="80">
        <template slot-scope="scope"> {{ scope.row.id }} </template>
      </el-table-column>
      <el-table-column label="Mã chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.code_store }}
        </template>
      </el-table-column>
      <el-table-column label="Họ tên">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Phiếu biên nhận">
        <template slot-scope="scope">
          {{ scope.row.pbn }}
        </template>
      </el-table-column>
      <el-table-column label="Nội dung">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column label="Trạng thái">
        <template slot-scope="scope">
          {{ scope.row.approved }}
        </template>
      </el-table-column>
      <el-table-column label="Người xử lý">
        <template slot-scope="scope">
          {{ scope.row.name_user }}
        </template>
      </el-table-column>
      <el-table-column label="Người thẩm định">
        <template slot-scope="scope">
          {{ scope.row.name_user_expertise }}
        </template>
      </el-table-column>
      <el-table-column label="Ngày xử lý">
        <template slot-scope="scope">
          {{ scope.row.time_handle }}
        </template>
      </el-table-column>
      <el-table-column label="Note xử lý">
        <template slot-scope="scope">
          {{ scope.row.note_user }}
        </template>
      </el-table-column>
      <el-table-column label="Note thẩm định">
        <template slot-scope="scope">
          {{ scope.row.note_user_expertise }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 2"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      border
    >
      <el-table-column label="Mã chi nhánh" width="120">
        <template slot-scope="scope">
          {{ scope.row.code_store }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.name_store }}
        </template>
      </el-table-column>
      <el-table-column label="Số lượng ticket">
        <template slot-scope="scope">
          {{ scope.row.count_ticket }}
        </template>
      </el-table-column>
      <el-table-column label="Mới tạo">
        <template slot-scope="scope">
          {{ scope.row.moi_tao }}
        </template>
      </el-table-column>
      <el-table-column label="Cần thẩm định">
        <template slot-scope="scope">
          {{ scope.row.can_tham_dinh }}
        </template>
      </el-table-column>
      <el-table-column label="Yêu cầu xử lý lại">
        <template slot-scope="scope">
          {{ scope.row.yeu_cau_xu_ly_lai }}
        </template>
      </el-table-column>
      <el-table-column label="Đợi ra biên bản">
        <template slot-scope="scope">
          {{ scope.row.doi_ra_bien_ban }}
        </template>
      </el-table-column>
      <el-table-column label="Đã ra biên bản">
        <template slot-scope="scope">
          {{ scope.row.da_ra_bien_ban }}
        </template>
      </el-table-column>
      <el-table-column label="Đã xử lý">
        <template slot-scope="scope">
          {{ scope.row.da_xy_ly }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 3"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      border
    >
      <el-table-column label="Mã chi nhánh" width="120">
        <template slot-scope="scope">
          {{ scope.row.machinhanh }}
        </template>
      </el-table-column>
      <el-table-column label="Mã nhân viên">
        <template slot-scope="scope">
          {{ scope.row.employe }}
        </template>
      </el-table-column>
      <el-table-column label="Tên Nhân Viên">
        <template slot-scope="scope">
          {{
            Object.entries(status(scope.row)).find(
              (a) => a[0] === "Tên Nhân Viên"
            )[1]
          }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh">
        <template slot-scope="scope">
          {{
            Object.entries(status(scope.row)).find(
              (a) => a[0] === "Tên Chi Nhánh"
            )[1]
          }}
        </template>
      </el-table-column>
      <el-table-column label="Đánh giá">
        <template slot-scope="scope">
          <template
            v-for="(a, i) in Object.entries(status(scope.row)).filter(
              (a) =>
                a[0] !== 'Tên Chi Nhánh' &&
                a[0] !== 'Tên Nhân Viên' &&
                a[0] !== 'Tổng Số Lỗi'
            )"
          >
            <span :key="Math.random() + i">{{ a[0] }}</span> :
            <span :key="Math.random() + i">{{ a[1] }}</span
            ><br :key="Math.random() + i" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Số lỗi">
        <template slot-scope="scope">
          {{
            Object.entries(status(scope.row)).find(
              (a) => a[0] === "Tổng Số Lỗi"
            )[1]
          }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 4"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      border
    >
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Mã nhân viên">
        <template slot-scope="scope">
          {{ scope.row.personnel_name }}
        </template>
      </el-table-column>
      <el-table-column label="Mã chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.code_store }}
        </template>
      </el-table-column>
      <el-table-column label="Tiêu chí đánh giá nhân viên" width="280">
        <template slot-scope="scope">
          {{ scope.row.string_rate }}
        </template>
      </el-table-column>

      <el-table-column label="Tiêu đề">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Phiếu biên nhận">
        <template slot-scope="scope">
          {{ scope.row.pbn }}
        </template>
      </el-table-column>

      <el-table-column label="Nội dung xử lý KH" width="280">
        <template slot-scope="scope">
          {{ scope.row.note_user }}
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái">
        <template slot-scope="scope">
          {{ scope.row.approved }}
        </template>
      </el-table-column>
      <el-table-column label="Số sao thẩm định">
        <template slot-scope="scope">
          {{ scope.row.rate }}
        </template>
      </el-table-column>
      <el-table-column label="Note xử lý">
        <template slot-scope="scope">
          {{ scope.row.note_user }}
        </template>
      </el-table-column>
      <el-table-column label="Note thẩm định">
        <template slot-scope="scope">
          {{ scope.row.note_user_expertise }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 5"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      border
    >
      <el-table-column label="Mã chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.machinhanh }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.name_store }}
        </template>
      </el-table-column>
      <el-table-column label="Đánh giá">
        <template slot-scope="scope">
          <template
            v-for="(a, i) in Object.entries(status(scope.row)).filter(
              (a) => a[0] !== 'count_total_ticket' && a[0] !== 'name_store'
            )"
          >
            <span :key="Math.random() + i">{{ a[0] }}</span> :
            <span :key="Math.random() + i">{{ a[1] }}</span
            ><br :key="Math.random() + i" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Tổng số lỗi">
        <template slot-scope="scope">
          {{ scope.row.count_total_ticket }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 6"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      border
    >
      <el-table-column label="Id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Chi nhánh">
        <template slot-scope="scope">
          {{ scope.row["Chi Nhánh"] }}
        </template>
      </el-table-column>
      <el-table-column label="Địa chỉ">
        <template slot-scope="scope">
          {{ scope.row["Địa Chỉ"] }}
        </template>
      </el-table-column>
      <el-table-column label="Số lượng đánh giá">
        <template slot-scope="scope">
          {{ scope.row["Số Lượng Đánh giá"] }}
        </template>
      </el-table-column>
      <el-table-column label="Số sao">
        <template slot-scope="scope">
          {{ scope.row["Số Sao"] }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 7"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      border
    >
      <el-table-column label="Mã chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.machinhanh }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.name_store }}
        </template>
      </el-table-column>
      <el-table-column label="Tổng tiền phạt">
        <template slot-scope="scope">
          {{ formatPrice(scope.row.tienphat) }}
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
    <!-- Excel -->
    <el-row style="margin-top: 30px">
      <el-col :span="24">
        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportExcelOne()"
        >
          Excel xuất đếm số lượng 1 sao chi nhánh
        </el-button>
        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportExcelcriterion()"
        >
          Tổng số lượng tiêu chí nhân viên
        </el-button>
        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportExcelStore()"
        >
          Tổng số lượng tiêu chí lỗi của chi nhánh
        </el-button>
        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportExcel()"
        >
          Excel xuất danh sách
        </el-button>

        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportExcelcriterionOne()"
        >
          Tiêu chí nhân viên theo ticket
        </el-button>
        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportExcelgoogle()"
        >
          Đánh giá của google
        </el-button>
        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportExcelsumhm()"
        >
          Execel xuất tổng số lượng hạng mục
        </el-button>
        <el-button
          style="margin-bottom: 5px"
          type="primary"
          icon="el-icon-download"
          @click="exportTongtienphat()"
        >
          Excel tổng tiền phạt của chi nhánh
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRecord } from "@/api/record";

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
      loadingStore: false,
      form: {
        tienphat: "",
        date_cre_date_start: "",
        date_cre_date_end: "",
        code_store: [],
      },
      process: url,

      tab: 1,

      page: 1,

      lists: [],

      select: 2,
      selects: [
        {
          id: 2,
          label: "Excel xuất đếm số lượng 1 sao chi nhánh",
        },
        {
          id: 3,
          label: "Tổng số lượng tiêu chí nhân viên",
        },
        {
          id: 5,
          label: "Tổng số lượng tiêu chí lỗi của chi nhánh",
        },
        {
          id: 1,
          label: "Excel xuất danh sách",
        },

        {
          id: 4,
          label: "Tiêu chí nhân viên theo ticket",
        },
        {
          id: 6,
          label: "Đánh giá của google",
        },
        {
          id: 7,
          label: "Tổng tiền phạt của chi nhánh",
        },
      ],
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
    if (this.$store.state.store.stores.length === 0) {
      this.loadingStore = true;
      this.$store.dispatch("store/getStores").then((res) => {
        this.loadingStore = false;
      });
    }
  },
  methods: {
    formatPrice(value) {
      if (value) {
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
      return 0;
    },
    handlePage(page) {
      this.paginationslice(this.lists, 10, page);
    },
    handleSearch() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }

      this.page = 1;

      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }

      if (this.select === 1) {
        this.getrecord({
          url:
            "/restful/listexportticket?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=0&tienphat=" +
            this.form.tienphat,
          tab: this.select,
        });
      } else if (this.select === 2) {
        this.getrecord({
          url:
            "/restful/listexportcountticket?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=0",
          tab: this.select,
        });
      } else if (this.select === 3) {
        this.getrecord({
          url:
            "/restful/listexportcountemployeticketrate?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=0",
          tab: this.select,
        });
      } else if (this.select === 4) {
        this.getrecord({
          url:
            "/restful/listexportticketrate?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=0",
          tab: this.select,
        });
      } else if (this.select === 5) {
        this.getrecord({
          url:
            "/restful/listexportcountstoreticketrate?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=0",
          tab: this.select,
        });
      } else if (this.select === 6) {
        this.getrecord({
          url:
            "/restful/listexportgooglerate?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=0",
          tab: this.select,
        });
      } else if (this.select === 7) {
        this.getrecord({
          url:
            "/restful/listexportcounttienphat?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=0",
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
        if (data.tab === 1 || data.tab === 2 || data.tab === 4) {
          this.lists = res.data;
        } else if (data.tab === 5) {
          this.lists = [];

          Object.entries(res.data).forEach((a) => {
            const item = {};
            item.machinhanh = a[1].code_store;
            item.name_store = a[1].name_store;
            item.count_total_ticket = a[1].count_total_ticket;

            Object.entries(a[1])
              .filter(
                (c) =>
                  c[0] !== "code_store" &&
                  c[0] !== "name_store" &&
                  c[0] !== "count_total_ticket"
              )
              .forEach((c) => {
                const find1 = res.data_cell_2.findIndex(
                  (d) => String(d) === String(c[0])
                );
                const find2 = res.data_cell[find1];
                item[find2] = c[1];
              });

            this.lists.push(item);
          });
        } else if (data.tab === 7) {
          this.lists = [];

          Object.entries(res.data).forEach((a) => {
            const item = {};
            item.machinhanh = a[1].code_store;
            item.name_store = a[1].name_store;
            item.tienphat = a[1].tienphat;
            this.lists.push(item);
          });

          console.log(this.lists);
        } else {
          this.lists = [];

          Object.entries(res.data).forEach((a) => {
            const item = {};
            item.machinhanh = a[1].code_store;
            item.name_store = a[1].name_store;
            item.employe = a[1].employe;
            Object.entries(a[1])
              .filter((c) => c[0] !== "code_store" && c[0] !== "employe")
              .forEach((c) => {
                const find1 = res.data_cell_2.findIndex(
                  (d) => String(d) === String(c[0])
                );
                const find2 = res.data_cell[find1];

                item[find2] = c[1];
              });

            this.lists.push(item);
          });

          console.log(this.lists);
        }
      }
      this.loading = false;
    },
    paginationslice(data, pagesize, page) {
      this.page = page;

      return data.filter((value, n) => {
        return n >= pagesize * (page - 1) && n < pagesize * page;
      });
    },
    exportExcelsumhm() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }

      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }

      console.log(
        this.process +
          "/restful/exportcountticket?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=-1" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportcountticket?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=-1" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },
    exportExcel() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }

      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }

      console.log(
        this.process +
          "/restful/exportticket?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportticket?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },
    exportExcelOne() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }

      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }

      console.log(
        this.process +
          "/restful/exportcountticket?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportcountticket?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },
    exportExcelcriterion() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }
      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }
      console.log(
        this.process +
          "/restful/exportcountemployeticketrate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportcountemployeticketrate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },
    exportExcelcriterionOne() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }
      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }
      console.log(
        this.process +
          "/restful/exportticketrate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportticketrate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },
    exportExcelStore() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }
      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }
      console.log(
        this.process +
          "/restful/exportcountstoreticketrate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportcountstoreticketrate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },

    exportExcelgoogle() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }
      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }
      console.log(
        this.process +
          "/restful/exportgooglerate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportgooglerate?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },

    exportTongtienphat() {
      let date_cre_date_start = this.form.date_cre_date_start;

      if (this.form.date_cre_date_start !== "") {
        date_cre_date_start =
          new Date(date_cre_date_start).toLocaleString("sv-SE").split(" ")[0] +
          " 00:00:00";
      }
      let date_cre_date_end = this.form.date_cre_date_end;
      if (this.form.date_cre_date_end !== "") {
        date_cre_date_end =
          new Date(date_cre_date_end).toLocaleString("sv-SE").split(" ")[0] +
          " 23:59:59";
      }
      let store = this.form.code_store.join(",");

      if (this.form.code_store.length === 0) {
        store = this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1]
          .split(",");
      }
      console.log(
        this.process +
          "/restful/exportcounttienphat?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
      window.open(
        this.process +
          "/restful/exportcounttienphat?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=0" +
          "&" +
          this.user.join("&") +
          "&tienphat=" +
          this.form.tienphat
      );
    },
  },
};
</script>

