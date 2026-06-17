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
          :disabled="disabledstatus()"
        >
          <el-option
            v-for="rule in stores"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          /> </el-select
      ></el-col>

      <el-col :span="5">
        <el-input v-model="form.pbn" placeholder="Nhập phiếu biên nhận" />
      </el-col>
      <el-col :span="5">
        <el-input v-model="form.phone" placeholder="Nhập số điện thoại" />
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="form.date_cre_date_start"
          type="date"
          placeholder="Ngày bắt đầu"
        />
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="form.date_cre_date_end"
          type="date"
          placeholder="Ngày kết thúc"
        />
      </el-col>
      <el-col :span="5">
        <el-button type="primary" icon="el-icon-search" @click="handleStore">
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="listsdata(lists.data)"
      style="width: 100%; margin-top: 30px"
      border
    >
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Phiếu biên nhận" width="150">
        <template slot-scope="scope">
          {{ scope.row.pbn }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Chi nhánh" width="220">
        <template slot-scope="scope">
          {{ scope.row.code_store }} - {{ scope.row.store_name }}
        </template>
      </el-table-column>
      <el-table-column label="Tên">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="Nội dung" width="150">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Ngày tạo" width="150">
        <template slot-scope="scope">
          {{ scope.row.created_at | moment("DD/MM/YYYY HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Thời gian xử lý">
        <template slot-scope="scope">
          {{ scope.row.showTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Tình trạng">
        <template slot-scope="scope">
          <el-tag :type="ruleApprovedType(scope.row.approved)">
            {{ ruleApproved(scope.row.approved) }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="Tùy chọn">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-tickets"
            type="primary"
            size="small"
            @click="handleDetail(scope.row)"
            >Chi tiết</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Popup
      v-if="detail !== null"
      :dialog-visible="dialogVisible"
      :lists="lists"
      :detail="detail"
      :page="page"
    />
    <!-- Pagination -->
    <el-pagination
      :page-size="20"
      layout="total, prev, pager, next"
      :total="lists.TotalItem"
      :current-page.sync="page"
      style="margin: 10px 0"
      @current-change="handleCurrentChange"
    />

    <!-- Excel -->
    <el-row>
      <el-col :span="24">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="exportExcel()"
        >
          Excel xuất danh sách
        </el-button>
        <el-button
          type="success"
          icon="el-icon-download"
          @click="exportExcelOne()"
        >
          Excel xuất đếm số lượng 1 sao chi nhánh
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Popup from "../Popup/Popup.vue";
import { getLists } from "@/api/ticket";
import { Message } from "element-ui";
import { removeData, getUser } from "@/utils/auth.js";

let url = "";

if (window.location.host === "dmcltk.stdmcl.com:8099") {
  url = process.env.VUE_APP_BASE_API;
} else {
  url = process.env.VUE_APP_BASE_API_DEV;
}

export default {
  name: "ComponentCompleted",
  components: { Popup },
  data() {
    return {
      lists: [],

      loading: false,
      loadingStore: false,

      dialogVisible: false,

      detail: null,

      form: {
        date_cre_date_start: "",
        date_cre_date_end: "",
        code_store:
          JSON.parse(getUser())
            .find((a) => a.split("=")[0] === "code_store")
            .split("=")[1] !== ""
            ? JSON.parse(getUser())
                .find((a) => a.split("=")[0] === "code_store")
                .split("=")[1]
                .split(",")
            : [],
        pbn: "",
        phone: "",
      },

      page: 1,

      process: url,
    };
  },
  computed: {
    stores() {
      return this.$store.state.store.stores;
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
    this.getLists(1);
  },
  methods: {
    disabledstatus() {
      if (
        Number(
          this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
        ) === 3
      ) {
        return false;
      }
      if (
        this.user
          .find((a) => a.split("=")[0] === "code_store")
          .split("=")[1] !== ""
      ) {
        return true;
      }
      return false;
    },
    listsdata(data) {
      return data;
    },
    handleDetail(detail) {
      this.detail = detail;
      this.dialogVisible = true;
    },
    closePopup() {
      this.dialogVisible = false;
      this.detail = null;
    },
    handleStore() {
      this.getLists(1);
    },
    ruleApproved(rule) {
      if (rule === 0) {
        return "Mới tạo";
      } else if (rule === 1) {
        return "Đang xử lý";
      } else if (rule === 2) {
        return "Cần thẩm định";
      } else if (rule === 3) {
        return "Đợi ra biên bản";
      } else if (rule === 4) {
        return "Hủy";
      } else if (rule === 5) {
        return "Yêu cầu xử lý lại";
      } else if (rule === 6) {
        return "Đã ra biên bản";
      }
    },
    ruleApprovedType(rule) {
      if (rule === 0) {
        return "info";
      } else if (rule === 1) {
        return "";
      } else if (rule === 2) {
        return "success";
      } else if (rule === 3) {
        return "warning";
      } else if (rule === 4) {
        return "danger";
      } else if (rule === 5) {
        return "primary";
      } else if (rule === 6) {
        return "success";
      }
    },
    getLists(page) {
      this.loading = true;
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

      getLists({
        page: page,
        approved: 1,
        code_store: this.form.code_store,
        pbn: this.form.pbn,
        phone: this.form.phone,
        date_cre_date_start,
        date_cre_date_end,
      })
        .then((res) => {
          if (Number(res.status) === 200) {
            if (res.data.TotalItem === 0) {
              res.data.data = [];
            }
            this.lists = res.data;
          } else {
            Message({
              message: res.message,
              type: "error",
              duration: 5 * 1000,
            });
            removeData("jwt");
            removeData("ticket_user");
            this.$router.push({
              path: "/login",
            });
          }
          this.loading = false;
        })
        .catch((err) => {
          Message({
            message: err,
            type: "error",
            duration: 5 * 1000,
          });
        });
    },
    handleCurrentChange(e) {
      this.getLists(e);
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

      window.open(
        this.process +
          "/restful/exportticket?" +
          "store=" +
          this.form.code_store +
          "&approved=1" +
          "&phone=" +
          this.form.phone +
          "&pbn=" +
          this.form.pbn +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&" +
          this.user.join("&")
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

      window.open(
        this.process +
          "/restful/exportcountticket?" +
          "store=" +
          this.form.code_store +
          "&approved=1" +
          "&phone=" +
          this.form.phone +
          "&pbn=" +
          this.form.pbn +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&" +
          this.user.join("&")
      );
    },
  },
};
</script>

