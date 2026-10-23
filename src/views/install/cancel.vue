<template>
  <div class="app-container list-page">
    <div class="filter-card">
      <el-row class="search">
        <el-col :span="5">
          <el-input v-model="form.id" placeholder="Nhập id" />
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.pbn" placeholder="Nhập PBN" clearable />
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="form.code_store"
            placeholder="Chọn chi nhánh"
            filterable
            multiple
            collapse-tags
            :loading="loadingStore"
            :disabled="disabledstatus()"
          >
            <el-option
              v-for="rule in stores"
              :key="rule.code"
              :value="rule.code"
              :label="rule.name + ' - ' + rule.code"
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
      </el-row>
      <div class="filter-actions">
        <el-button type="primary" icon="el-icon-search" @click="handleStore">
          Tìm kiếm
        </el-button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-card__head">
        <div
          v-if="listsdata(lists.data) && listsdata(lists.data).length"
          class="table-legend"
        >
          <span class="table-legend__box"></span>
          <span>Yêu cầu xử lý</span>
        </div>
        <div class="table-card__actions">
          <el-button
            v-if="
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 1 ||
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 5
            "
            type="success"
            icon="el-icon-plus"
            @click="handleAdd(true)"
            >Thêm mới</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="exportExcel()"
          >
            Excel xuất danh sách
          </el-button>
        </div>
      </div>

      <el-table
        ref="table"
        v-loading="loading"
        :data="listsdata(lists.data)"
        style="width: 100%"
        border
        max-height="550"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="ID" width="110" fixed="left">
          <template slot-scope="scope">
            <div class="id-cell">
              <span class="id-cell__link" @click="handleDetail(scope.row)">{{
                scope.row.id
              }}</span>
              <div class="id-cell__actions">
                <el-button
                  size="mini"
                  icon="el-icon-view"
                  type="primary"
                  plain
                  circle
                  title="Chi tiết"
                  @click="handleDetail(scope.row)"
                />
                <el-button
                  v-if="
                    (user.find((a) => a.split('=')[0] === 'rule').split('=')[1] ==
                      1 &&
                      scope.row.approved === 0) ||
                    (user.find((a) => a.split('=')[0] === 'rule').split('=')[1] ==
                      5 &&
                      scope.row.approved === 0)
                  "
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  plain
                  circle
                  title="Xóa"
                  @click="handleDelete(scope.row)"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Chi nhánh xử lý"
          width="170"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.code_store_rate }} - {{ scope.row.store_name_rate }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="CN có NV vi phạm"
          width="170"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.code_store }} - {{ scope.row.store_name }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="PBN"
          width="130"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.pbn }}
          </template>
        </el-table-column>
        <el-table-column label="Tiêu đề" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column
          align="header-center"
          label="Nội dung"
          min-width="260"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>

        <el-table-column
          align="header-center"
          label="Ngày tạo"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.created_at | moment("DD/MM/YYYY HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Thời gian xử lý"
          width="130"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.showTime }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="Tiền phạt" width="90">
          <template slot-scope="scope">
            {{ formatPrice(scope.row.tienphat) }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Tình trạng"
          width="140"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tag :type="ruleApprovedType(scope.row.approved)">
              {{ ruleApproved(scope.row.approved) }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <el-pagination
        :page-size="20"
        layout="total, prev, pager, next"
        :total="lists.TotalItem"
        :current-page.sync="page"
        style="margin: 10px 0 0"
        @current-change="handleCurrentChange"
      />
    </div>

    <Add v-if="formAdd" :dialog-visible="formAdd" :form-add="formAdd" />

    <el-drawer
      :visible.sync="dialogVisible"
      title="Chi tiết"
      :before-close="closePopup"
      direction="rtl"
      size="calc(100% - 100px)"
    >
      <Popup
        v-if="detail !== null"
        :detail-parent="detail"
        :page="page"
        @handlePopup="closePopup"
        @getlists="getLists"
      />
    </el-drawer>
  </div>
</template>

<script>
import Popup from "./detail.vue";
import { getLists } from "@/api/ticket";
import openDetailFromQuery from "@/utils/openDetailFromQuery";
import { Message } from "element-ui";
import { removeData, getUser } from "@/utils/auth.js";
import Add from "./add.vue";

let url = "";

if (window.location.host === "dmcltk.stdmcl.com:8099") {
  url = process.env.VUE_APP_BASE_API;
} else {
  url = process.env.VUE_APP_BASE_API_DEV;
}

export default {
  name: "ComponentCompleted",
  components: { Popup, Add },
  mixins: [openDetailFromQuery],
  data() {
    return {
      formAdd: false,
      lists: [],

      loading: false,
      loadingStore: false,

      dialogVisible: false,
      reCordDetail: null,

      detail: null,

      form: {
        approved: "4",
        tienphat: "",
        id: "",
        pbn: "",
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
     tableRowClassName({ row, rowIndex }) {
      if (row.show_color === 1) {
        return "warning-row";
      }
      return "";
    },
    handleAdd(status) {
      this.formAdd = status;
    },
    recordStatus(status, linkedid) {
      this.reCordDetail = linkedid;
      this.dialogVisibleDetail = status;
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
        tienphat: this.form.tienphat,
        page: page,
        approved: this.form.approved,
        code_store: this.form.code_store,
        pbn: this.form.pbn,
        phone: "",
        date_cre_date_start,
        date_cre_date_end,
        type: 7,
        id: this.form.id,
      })
        .then((res) => {
          if (Number(res.status) === 200) {
            if (res.data.TotalItem === 0) {
              res.data.data = [];
            }
            this.lists = res.data;

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
    formatPrice(value) {
      if (value)
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      return 0;
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
          "&approved=" +
          this.form.approved +
          "&phone=" +
          "&pbn=" +
          this.form.pbn +
          "&date_cre_date_start=" +
          date_cre_date_start +
          "&date_cre_date_end=" +
          date_cre_date_end +
          "&type=7" +
          "&" +
          this.user.join("&") +
          "&id=" +
          this.form.id
      );
    },
  },
};
</script>
