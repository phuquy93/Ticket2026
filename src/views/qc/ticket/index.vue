<template>
  <div class="app-container">
    <div
      style="display: flex"
      v-if="
        Number(user.find((a) => a.split('=')[0] === 'rule').split('=')[1]) ===
          1 ||
        Number(user.find((a) => a.split('=')[0] === 'rule').split('=')[1]) === 7
      "
    >
      <!-- <el-button
        v-loading="loading"
        style="margin-right: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd(true)"
        >Thêm mới</el-button
      > -->
      <!-- <el-upload
        v-loading="loading"
        ref="uploadRef"
        class="upload-demo"
        action="#"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        accept=".xlsx,.xls"
      >
        <template #trigger>
          <el-button type="danger" style="margin-right: 10px"
            >Select file</el-button
          >
        </template>
        <el-button class="ml-3" type="warning" @click="handleGetTemplate"
          >Tải template mẫu</el-button
        >
        <el-button
          class="ml-3"
          type="success"
          icon="el-icon-upload"
          @click="handleUpload"
        >
          Upload
        </el-button>
      </el-upload> -->
    </div>
    <el-row class="search">
      <el-col :span="5">
        <el-input v-model="form.id" placeholder="Nhập id" />
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="form.code_store"
          filterable
          multiple
          placeholder="Chọn chi nhánh"
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
        <el-select
          v-model="form.approved"
          placeholder="Chọn tình trạng"
          filterable
        >
          <el-option value="" label="Tất cả" />
          <el-option value="0" label="Mới tạo" />
          <el-option value="2" label="Cần thẩm định" />
          <el-option value="3" label="Đợi ra biên bản" />
          <el-option value="6" label="Đã ra biên bản" />
          <el-option value="4" label="Đã xử lý" />
          <el-option value="5" label="Yêu cầu xử lý lại" />
          <el-option value="9" label="Đã trả hàng" />
          <el-option value="10" label="Hợp lệ" />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="form.rate_customer" placeholder="Chọn số điểm">
          <el-option value="0" label="Tất cả" />
          <el-option value="1" label="1" />
          <el-option value="2" label="2" />
          <el-option value="3" label="3" />
          <el-option value="4" label="4" />
          <el-option value="5" label="5" />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input v-model="form.pbn" placeholder="Nhập phiếu biên nhận" />
      </el-col>
      <el-col :span="5">
        <el-input v-model="form.phone" placeholder="Nhập số điện thoại" />
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
    <!-- Pagination -->
    <el-pagination
      :page-size="20"
      layout="total, prev, pager, next"
      :total="lists.TotalItem"
      :current-page.sync="page"
      style="margin: 10px 0"
      @current-change="handleCurrentChange"
    />
    <el-table
      v-loading="loading"
      :data="listsdata(lists.data)"
      style="width: 100%"
      border
      height="550"
      ref="table"
       :row-class-name="tableRowClassName"
    >
      <el-table-column label="ID" width="120" fixed="left">
        <template slot-scope="scope">
          <span
            @click="handleDetail(scope.row)"
            style="cursor: pointer; color: #409eff"
            >{{ scope.row.id }}</span
          >
          <el-button
            size="small"
            icon="el-icon-view"
            type="primary"
            @click="handleDetail(scope.row)"
            >Chi tiết</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="Phiếu biên nhận" width="128">
        <template slot-scope="scope">
          {{ scope.row.pbn }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Tiêu chí" width="130">
        <template slot-scope="scope">
          {{ scope.row.phieudoitra }}
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="Chi nhánh xử lý"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.code_store }} - {{ scope.row.store_name }}
        </template>
      </el-table-column>
      <el-table-column label="Tên KH - Số điện thoại" width="280">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column
        align="header-center"
        label="Lý do trả hàng - nội dung"
        width="280"
      >
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="Ngày tạo" width="160">
        <template slot-scope="scope">
          {{ scope.row.created_at | moment("DD/MM/YYYY HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="Thời gian xử lý"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.showTime }}
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="Số điểm đánh giá chất lượng"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.rate_customer }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Tiền phạt" width="85">
        <template slot-scope="scope">
          {{ formatPrice(scope.row.tienphat) }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Tình trạng" width="120">
        <template slot-scope="scope">
          <el-tag
            v-if="
              scope.row.phieudoitra === 'Chất lượng cuộc gọi' &&
              scope.row.approved == 9
            "
          >
            Cuộc gọi
          </el-tag>
          <el-tag :type="ruleApprovedType(scope.row.approved)" v-else>
            {{ ruleApproved(scope.row.approved) }}</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
    <Popup
      v-if="detail !== null"
      :dialog-visible="dialogVisible"
      :lists="lists"
      :detail="detail"
      :stores="stores"
      :page="page"
    />
    <Detail
      v-if="dialogVisibleDetail"
      :dialog-visible="dialogVisibleDetail"
      :dialog-visible-detail="dialogVisibleDetail"
      :re-cord-detail="reCordDetail"
      :detail="detail"
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
    <Add v-if="formAdd" :dialog-visible="formAdd" :form-add="formAdd" />
  </div>
</template>

<script>
import Popup from "../Popup/Popup_bk.vue";
import Add from "./add.vue";
import Detail from "../Popup/Detail.vue";
import { getLists, postExcelqc } from "@/api/ticket";
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
  components: { Popup, Detail, Add },
  data() {
    return {
      formAdd: false,
      lists: [],

      loading: false,
      loadingStore: false,

      dialogVisible: false,
      dialogVisibleDetail: false,
      reCordDetail: null,

      detail: null,

      form: {
        tienphat: "",
        id: "",
        rate_customer: "",
        doitra: 1,
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
        approved: "",
        phone: "",
        pbn: "",
      },

      page: 1,

      process: url,

      file: null,
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
    if (!!window.location.hash && window.location.hash.split("=")[1]) {
      this.form.approved = window.location.hash.split("=")[1];
    }
    this.getLists(1);
  },
  methods: {
      tableRowClassName({ row, rowIndex }) {
      if (row.show_color === 1) {
        return "warning-row";
      }
      return "";
    },
    handleAdd(status) {
      this.formAdd = status;
    },
    handleFileChange(file, fileList) {
      this.file = file;
    },
    handleFileRemove(file, fileList) {
      this.file = null;
    },
    handleGetTemplate() {
      let data = getUser() ? "&" + JSON.parse(getUser()).join("&") : "";
      window.open(
        process.env.VUE_APP_BASE_API + "/restful/importaddticket3?" + data,
        "_blank"
      );
    },
    handleUpload() {
      if (this.file !== null) {
        this.loading = true;
        let formData = new FormData();
        formData.append("file_input_csv", this.file.raw);
        postExcelqc(formData)
          .then((res) => {
            if (res.status === 200) {
              Message({
                message: "Lưu thành công",
                type: "success",
                duration: 5 * 1000,
              });
              this.file = null;
              this.$refs.uploadRef.clearFiles();
            } else {
              Message({
                message: res.message,
                type: "error",
                duration: 5 * 1000,
              });
            }
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    recordStatus(status, linkedid) {
      this.reCordDetail = linkedid;
      this.dialogVisibleDetail = status;
    },
    formatPrice(value) {
      if (value)
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      return 0;
    },
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
        if (
          this.user.find((a) => a.split("=")[0] === "dataid").split("=")[1] ===
            "125" ||
          this.user.find((a) => a.split("=")[0] === "dataid").split("=")[1] ===
            "121"
        ) {
          return false;
        }
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
        return "Đã xử lý";
      } else if (rule === 5) {
        return "Yêu cầu xử lý lại";
      } else if (rule === 6) {
        return "Đã ra biên bản";
      } else if (rule === 9) {
        return "Đã trả hàng";
      } else if (rule === 10) {
        return "Hợp lệ";
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
      } else if (rule === 10) {
        return "danger";
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
        tienphat: this.form.tienphat,
        id: this.form.id,
        page: page,
        doitra: this.form.doitra,
        approved: this.form.approved,
        code_store: this.form.code_store,
        rate_customer: this.form.rate_customer,
        pbn: this.form.pbn,
        phone: this.form.phone,
        date_cre_date_start,
        date_cre_date_end,
        type: 2,
      })
        .then((res) => {
          if (Number(res.status) === 200) {
            if (res.data.TotalItem === 0) {
              res.data.data = [];
            }
            this.lists = res.data;
            this.page = page;
            this.$nextTick(() => {
              this.$refs.table.doLayout();
            });
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
      console.log(
        this.process +
          "/restful/exportticket?" +
          "store=" +
          this.form.code_store +
          "&approved=" +
          this.form.approved +
          "&phone=" +
          this.form.phone +
          "&pbn=" +
          this.form.pbn +
          "&doitra=" +
          this.form.doitra +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=2" +
          "&" +
          this.user.join("&") +
          "&id=" +
          this.form.id
      );
      window.open(
        this.process +
          "/restful/exportticket?" +
          "store=" +
          this.form.code_store +
          "&approved=" +
          this.form.approved +
          "&phone=" +
          this.form.phone +
          "&pbn=" +
          this.form.pbn +
          "&doitra=" +
          this.form.doitra +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=2" +
          "&" +
          this.user.join("&") +
          "&id=" +
          this.form.id
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
          "&approved=" +
          this.form.approved +
          "&phone=" +
          this.form.phone +
          "&pbn=" +
          this.form.pbn +
          "&doitra=" +
          this.form.doitra +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=2" +
          "&" +
          this.user.join("&") +
          "&id=" +
          this.form.id
      );
    },
  },
};
</script>
