<template>
  <div class="app-container list-page">
    <div class="filter-card">
    <el-row class="search">
      <el-col :span="5">
        <el-select
          v-model="form.code_store"
          placeholder="Chọn chi nhánh"
          filterable
          multiple
          collapse-tags
          :loading="loadingStore"
        >
          <el-option
            v-for="rule in stores"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          /> </el-select
      ></el-col>
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
        <el-select
          v-model="form.type_chat_luong_cuoc_goi"
          placeholder="Tùy chọn"
        >
          <el-option
            v-for="item in [
              { label: 'Tất cả', id: '' },
              { label: 'Online', id: 'ONLINE' },
              { label: 'Bảo hành', id: 'BAOHANH' },
              { label: 'Giao hàng', id: 'GIAOHANG' },
              { label: 'Nghiệm thu', id: 'NGHIEMTHU' },
              { label: 'Delivery', id: 'DELIVERY' },
              { label: 'Giao hàng gọi trực tiếp', id: 'GIAOHANG-GTT' },
            ]"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-col>
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
            Excel xuất số lượng cuộc gọi
          </el-button>
          <!-- <el-button
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
          </el-button> -->
          <!-- <el-button
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
          </el-button> -->
          <el-button
            style="margin-bottom: 5px"
            type="primary"
            icon="el-icon-download"
            @click="exportreportcuocgoi()"
          >
            Chất lượng cuộc gọi
          </el-button>
          <el-button
            style="margin-bottom: 5px"
            type="primary"
            icon="el-icon-download"
            @click="exportTongtienphat()"
          >
            Excel tổng tiền phạt của chi nhánh
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
      <el-table-column label="ID" width="80" show-overflow-tooltip>
        <template slot-scope="scope"> {{ scope.row.id }} </template>
      </el-table-column>
      <el-table-column label="Mã chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.code_store }}
        </template>
      </el-table-column>
      <el-table-column label="Họ tên" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Phiếu biên nhận" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.pbn }}
        </template>
      </el-table-column>
      <el-table-column label="Nội dung" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.approved }}
        </template>
      </el-table-column>
      <el-table-column label="Người xử lý" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name_user }}
        </template>
      </el-table-column>
      <el-table-column label="Người thẩm định" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name_user_expertise }}
        </template>
      </el-table-column>
      <el-table-column label="Ngày xử lý" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.time_handle }}
        </template>
      </el-table-column>
      <el-table-column label="Note xử lý" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.note_user }}
        </template>
      </el-table-column>
      <el-table-column label="Note thẩm định" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.note_user_expertise }}
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
          {{ scope.row.code_store }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name_store }}
        </template>
      </el-table-column>
      <el-table-column label="Số lượng ticket" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.count_ticket }}
        </template>
      </el-table-column>
      <el-table-column label="Mới tạo" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.moi_tao }}
        </template>
      </el-table-column>
      <el-table-column label="Cần thẩm định" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.can_tham_dinh }}
        </template>
      </el-table-column>
      <el-table-column label="Yêu cầu xử lý lại" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.yeu_cau_xu_ly_lai }}
        </template>
      </el-table-column>
      <el-table-column label="Đợi ra biên bản" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.doi_ra_bien_ban }}
        </template>
      </el-table-column>
      <el-table-column label="Đã ra biên bản" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.da_ra_bien_ban }}
        </template>
      </el-table-column>
      <el-table-column label="Đã xử lý" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.da_xy_ly }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 3"
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
      <el-table-column label="Mã nhân viên" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.manv }}
        </template>
      </el-table-column>
      <el-table-column label="Tên Nhân Viên" show-overflow-tooltip>
        <template slot-scope="scope">
          {{
            Object.entries(status(scope.row)).find(
              (a) => a[0] === "Tên Nhân Viên"
            )[1]
          }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh" show-overflow-tooltip>
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
      <el-table-column label="Số lỗi" show-overflow-tooltip>
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
      style="width: 100%"
      border
    >
      <el-table-column label="ID" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Mã nhân viên" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.personnel_name }}
        </template>
      </el-table-column>
      <el-table-column label="Mã chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.code_store }}
        </template>
      </el-table-column>
      <el-table-column label="Tiêu chí đánh giá nhân viên" width="280" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.string_rate }}
        </template>
      </el-table-column>

      <el-table-column label="Tiêu đề" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Phiếu biên nhận" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.pbn }}
        </template>
      </el-table-column>

      <el-table-column label="Nội dung xử lý KH" min-width="280" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.note_user }}
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.approved }}
        </template>
      </el-table-column>
      <el-table-column label="Số sao thẩm định" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.rate }}
        </template>
      </el-table-column>
      <el-table-column label="Note xử lý" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.note_user }}
        </template>
      </el-table-column>
      <el-table-column label="Note thẩm định" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.note_user_expertise }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 5"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%"
      border
    >
      <el-table-column label="Mã chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.machinhanh }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh" show-overflow-tooltip>
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
      <el-table-column label="Tổng số lỗi" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.count_total_ticket }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 6"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%"
      border
    >
      <el-table-column label="Id" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Chi Nhánh"] }}
        </template>
      </el-table-column>
      <el-table-column label="Địa chỉ" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Địa Chỉ"] }}
        </template>
      </el-table-column>
      <el-table-column label="Số lượng đánh giá" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Số Lượng Đánh giá"] }}
        </template>
      </el-table-column>
      <el-table-column label="Số sao" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Số Sao"] }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 7"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%"
      border
    >
      <el-table-column label="Mã nhân viên" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Mã Nhân Viên"] }}
        </template>
      </el-table-column>
      <el-table-column label="Tên Nhân viên" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Tên Nhân viên"] }}
        </template>
      </el-table-column>
      <el-table-column label="Mã Chi Nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Mã Chi Nhánh"] }}
        </template>
      </el-table-column>
      <el-table-column label="Tên Chi Nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["Tên Chi Nhánh"] }}
        </template>
      </el-table-column>
      <el-table-column label="1 sao" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["1 sao"] }}
        </template>
      </el-table-column>
      <el-table-column label="2 sao" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["2 sao"] }}
        </template>
      </el-table-column>
      <el-table-column label="3 sao" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["3 sao"] }}
        </template>
      </el-table-column>
      <el-table-column label="4 sao" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["4 sao"] }}
        </template>
      </el-table-column>
      <el-table-column label="5 sao" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row["5 sao"] }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tab === 8"
      v-loading="loading"
      :data="paginationslice(lists, 10, page)"
      style="width: 100%"
      border
    >
      <el-table-column label="Mã chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.machinhanh }}
        </template>
      </el-table-column>
      <el-table-column label="Tên chi nhánh" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name_store }}
        </template>
      </el-table-column>
      <el-table-column label="Tổng tiền phạt" show-overflow-tooltip>
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
    </div>
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
        type_chat_luong_cuoc_goi: "",
        date_cre_date_start: "",
        date_cre_date_end: "",
        code_store: [],
        doitra: 2,
      },
      process: url,

      tab: 1,

      page: 1,

      lists: [],

      select: 2,
      selects: [
        {
          id: 2,
          label: "Excel xuất số lượng cuộc gọi",
        },
        // {
        //   id: 3,
        //   label: "Tổng số lượng tiêu chí nhân viên",
        // },
        // {
        //   id: 5,
        //   label: "Tổng số lượng tiêu chí lỗi của chi nhánh",
        // },
        // {
        //   id: 1,
        //   label: "Excel xuất danh sách",
        // },

        // {
        //   id: 4,
        //   label: "Tiêu chí nhân viên theo ticket",
        // },
        // {
        //   id: 6,
        //   label: "Đánh giá của google",
        // },
        {
          id: 7,
          label: "Chất lượng cuộc gọi",
        },
        {
          id: 8,
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
    tableRowClassName({ row }) {
      return row.show_color === 1 ? "warning-row" : "";
    },
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
            "&doitra=" +
            this.form.doitra +
            "&type=2" +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
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
            "&type=2" +
            "&doitra=" +
            this.form.doitra +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
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
            "&type=2" +
            "&doitra=" +
            this.form.doitra +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
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
            "&type=2" +
            "&doitra=" +
            this.form.doitra +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
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
            "&type=2" +
            "&doitra=" +
            this.form.doitra +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
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
            "&type=2" +
            "&doitra=" +
            this.form.doitra +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
          tab: this.select,
        });
      } else if (this.select === 7) {
        this.getrecord({
          url:
            "/restful/listreportcuocgoi?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=2" +
            "&doitra=" +
            this.form.doitra +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
          tab: this.select,
        });
      } else if (this.select === 8) {
        this.getrecord({
          url:
            "/restful/listexportcounttienphat?" +
            "store=" +
            store +
            "&date_cre_date_start=" +
            date_cre_date_start +
            "&date_cre_date_end=" +
            date_cre_date_end +
            "&type=2" +
            "&doitra=" +
            this.form.doitra +
            "&type_chat_luong_cuoc_goi=" +
            this.form.type_chat_luong_cuoc_goi,
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
        } else if (data.tab === 8) {
          this.lists = [];

          Object.entries(res.data).forEach((a) => {
            const item = {};
            item.machinhanh = a[1].code_store;
            item.name_store = a[1].name_store;
            item.tienphat = a[1].tienphat;
            this.lists.push(item);
          });
        } else {
          this.lists = [];

          Object.entries(res.data).forEach((a) => {
            const item = {};

            if (data.tab === 7) {
              Object.entries(a[1])
                .filter((c) => c[0] !== "employe")
                .forEach((c) => {
                  const find1 = res.data_cell_2.findIndex(
                    (d) => String(d) === String(c[0])
                  );
                  const find2 = res.data_cell[find1];

                  item[find2] = c[1];
                });
            } else {
              Object.entries(a[1])
                .filter((c) => c[0] !== "code_store" && c[0] !== "employe")
                .forEach((c) => {
                  const find1 = res.data_cell_2.findIndex(
                    (d) => String(d) === String(c[0])
                  );
                  const find2 = res.data_cell[find1];

                  item[find2] = c[1];
                });
            }

            this.lists.push(item);
          });
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
          "&tienphat=" +
          this.form.tienphat
      );
    },
    exportreportcuocgoi() {
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
          "/restful/exportreportcuocgoi?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
          "&tienphat=" +
          this.form.tienphat
      );

      window.open(
        this.process +
          "/restful/exportreportcuocgoi?" +
          "store=" +
          store +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
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
          "&type=2" +
          "&doitra=" +
          this.form.doitra +
          "&" +
          this.user.join("&") +
          "&type_chat_luong_cuoc_goi=" +
          this.form.type_chat_luong_cuoc_goi +
          "&tienphat=" +
          this.form.tienphat
      );
    },
  },
};
</script>

