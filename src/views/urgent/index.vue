<template>
  <div class="app-container">
    <div
      style="display: flex"
      v-if="
        Number(user.find((a) => a.split('=')[0] === 'rule').split('=')[1]) ===
          1 ||
        Number(user.find((a) => a.split('=')[0] === 'rule').split('=')[1]) === 7
      "
    ></div>
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
          <el-option value="9" label="Cuộc gọi khẩn" />
          <el-option value="10" label="Hợp lệ" />
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
        <el-select v-model="form.device" placeholder="Chọn thiết bị" filterable>
          <el-option value="" label="Tất cả" />
          <el-option value="app" label="App" />
          <el-option value="deli" label="Delivery" />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" icon="el-icon-search" @click="handleStore">
          Tìm kiếm
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          v-if="!cuocgoikhan"
          type="error"
          style="background: #fff8bc; color: #000"
          @click="handlecuocgoikhan(1, true,1)"
        >
          Cuộc gọi khẩn
        </el-button>
        <el-button
          v-else
          type="error"
          style="background: #fff8bc; color: #000"
          @click="handlecuocgoikhan(1, false,1)"
        >
          Cuộc gọi khẩn
        </el-button>
      </el-col>
      <el-col :span="5">
  <el-button
          type="error"
          style="background: #acd3df; color: #000"  @click="handlecuocgoikhan(1, false,2)"
        >
          Thời gian giao hàng hợp lệ
        </el-button>
      </el-col>
       <el-col :span="5">
   <el-button
          type="error"
          style="background: #d8d3aa; color: #000"
           @click="handlecuocgoikhan(1, false,3)"
        >
          Thời gian hoặc hẹn hơn 1 lần
        </el-button>
      </el-col>
       <el-col :span="5">

         <el-button
          type="error"
          style="background: #d9bcdc; color: #000"
            @click="handlecuocgoikhan(1, false,4)"
        >
          Khách không nhận hàng
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
    <div
      class="table-legend"
      v-if="listsdata(lists.data) && listsdata(lists.data).length"
    >
      <span class="table-legend__box"></span>
      <span>Yêu cầu xử lý</span>
    </div>
    <el-table
      v-loading="loading"
      :data="listsdata(lists.data)"
      style="width: 100%"
      border
      :row-class-name="tableRowClassName"
      height="550"
      ref="table"

    >
      <el-table-column label="ID" width="120" fixed="left">
        <template slot="header">
          <span style="color: red; font-weight: bold"
            >Mã ID
            <i
              class="el-icon-top"
              style="color: #999; cursor: pointer"
              v-if="!sort"
              @click="handleSort(true, 1)"
            ></i>
            <i
              class="el-icon-bottom"
              style="color: #999; cursor: pointer"
              v-else
              @click="handleSort(false, 1)"
            ></i
          ></span>
        </template>
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

      <el-table-column align="header-center" label="Thời gian hẹn" width="170">
        <template slot-scope="scope">
          {{ scope.row.thoi_gian_hen }}
        </template>
      </el-table-column>
            <el-table-column
        align="header-center"
        label="Chi nhánh xử lý"
        width="170"
      >
        <template slot-scope="scope">
          {{ scope.row.code_store_rate }} - {{ scope.row.store_name_rate }}
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="CN có NV vi phạm"
        width="170"
      >
        <template slot-scope="scope">
          {{ scope.row.code_store }} - {{ scope.row.store_name }}
        </template>
      </el-table-column>

      <el-table-column label="Tên KH" width="280">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại KH" width="280">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="Nội dung QC đánh giá" width="280">
        <template slot-scope="scope">
          {{ scope.row.flag_content.personnel_note }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Ngày tạo" width="160">
        <template slot-scope="scope">
          {{ scope.row.created_at | moment("DD/MM/YYYY HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Ngày giao hàng" width="160">
        <template slot-scope="scope">
          {{ scope.row.ngay_giao_hang }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Khung giờ giao" width="160">
        <template slot-scope="scope">
          {{ scope.row.khung_gio }}
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

      <el-table-column align="header-center" label="Tiền phạt" width="85">
        <template slot-scope="scope">
          {{ formatPrice(scope.row.tienphat) }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Tình trạng" width="130">
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
      <el-table-column label="Số lần gửi ticket" width="150">
        <template slot="header" slot-scope="scope">
          <span style="color: red; font-weight: bold"
            >Số lần gửi ticket
            <i
              class="el-icon-top"
              style="color: #999; cursor: pointer"
              v-if="!sort_so_lan_gui_ticket"
              @click="handleSort(true, 2)"
            ></i>
            <i
              class="el-icon-bottom"
              style="color: #999; cursor: pointer"
              v-else
              @click="handleSort(false, 2)"
            ></i
          ></span>
        </template>
        <template slot-scope="scope">
          {{ scope.row.so_lan_gui_ticket }}
        </template>
      </el-table-column>
      <el-table-column label="Số lần hẹn" width="110">
        <template slot="header" slot-scope="scope">
          <span style="color: red; font-weight: bold"
            >Số lần hẹn
            <i
              class="el-icon-top"
              style="color: #999; cursor: pointer"
              v-if="!sort_so_lan_hen_ticket"
              @click="handleSort(true, 3)"
            ></i>
            <i
              class="el-icon-bottom"
              style="color: #999; cursor: pointer"
              v-else
              @click="handleSort(false, 3)"
            ></i
          ></span>
        </template>
        <template slot-scope="scope">
          {{ scope.row.so_lan_hen_ticket }}
        </template>
      </el-table-column>
      <el-table-column label="Thiết bị" width="110">
        <template slot="header" slot-scope="scope">
          <span>Thiết bị</span>
        </template>
        <template slot-scope="scope">
          {{ scope.row.device }}
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
import Popup from "./Popup.vue";

import { getLists, postExcelqc } from "@/api/ticket";
import openDetailFromQuery from "@/utils/openDetailFromQuery";
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
  mixins: [openDetailFromQuery],
  data() {
    return {
      lists: [],

      loading: false,
      loadingStore: false,

      dialogVisible: false,

      detail: null,

      form: {
        tienphat: "",
        id: "",
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
        status_cuoc_goi_den_hen: 0,
        device: "",
      },

      page: 1,

      process: url,

      file: null,

      cuocgoikhan: false,

      sort: false,
      sort_so_lan_gui_ticket: false,
      sort_so_lan_hen_ticket: false,
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
    if (this.routeParam("approved")) {
      this.form.approved = this.routeParam("approved");
    }
    this.getLists(1);
  },
  methods: {
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
    tableRowClassName({ row, rowIndex }) {
      if (row.status_cuoc_goi_den_hen === 1) {
        return "bgred";
      }else if (row.status_cuoc_goi_den_hen === 2){
 return "bgred1";
      }else if (row.status_cuoc_goi_den_hen === 3){
 return "bgred2";
      }else if (row.status_cuoc_goi_den_hen === 4){
 return "bgred3";
      }

      return "";
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
        return "Cuộc gọi khẩn";
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
    handleSort(status, type) {
      if (type === 1) {
        this.sort = status;
      } else if (type === 2) {
        this.sort_so_lan_gui_ticket = status;
      } else {
        this.sort_so_lan_hen_ticket = status;
      }
      this.getLists(1, type);
    },
    getLists(page, type) {
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

      let item = {
        tienphat: this.form.tienphat,
        id: this.form.id,
        page: page,
        approved: this.form.approved,
        code_store: this.form.code_store,
        pbn: this.form.pbn,
        phone: this.form.phone,
        date_cre_date_start,
        date_cre_date_end,
        type: 4,
        device: this.form.device,
      };

      if (type) {
        if (type === 1) item.sort = this.sort;
        else if (type === 2)
          item.so_lan_gui_ticket = this.sort_so_lan_gui_ticket;
        else item.so_lan_hen_ticket = this.sort_so_lan_hen_ticket;
      }

      getLists(item)
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
    handlecuocgoikhan(page, status,data) {
      this.cuocgoikhan = status;
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

      let item = {
        tienphat: this.form.tienphat,
        id: this.form.id,
        page: page,
        approved: this.form.approved,
        code_store: this.form.code_store,
        pbn: this.form.pbn,
        phone: this.form.phone,
        date_cre_date_start,
        date_cre_date_end,
        type: 4,
        device: this.form.device,
      };

      if (data) item.status_cuoc_goi_den_hen = data;

      getLists(item)
        .then((res) => {
          if (Number(res.status) === 200) {
            if (res.data.TotalItem === 0) {
              res.data.data = [];
            }
            this.lists = res.data;
            this.page = page;
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
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=4" +
          "&" +
          this.user.join("&") +
          "&id=" +
          this.form.id +
          "&device=" +
          this.form.device
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
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=4" +
          "&" +
          this.user.join("&") +
          "&id=" +
          this.form.id +
          "&device=" +
          this.form.device
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
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=4" +
          "&" +
          this.user.join("&") +
          "&id=" +
          this.form.id +
          "&device=" +
          this.form.device
      );
    },
  },
};
</script>

<style>
.bgred {
  background-color: #fff8bc !important;
}
.bgred1 {
  background-color: #acd3df !important;
}
.bgred2 {
  background-color: #d8d3aa !important;
}
.bgred3 {
  background-color: #d9bcdc !important;
}
</style>
