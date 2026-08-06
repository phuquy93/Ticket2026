<template>
  <el-dialog
    :visible.sync="formAdd"
    title="Thêm mới"
    :before-close="handleClose"
  >
    <el-form
      ref="role"
      :model="role"
      :rules="rules"
      label-width="170px"
      label-position="left"
    >
      <el-form-item label="Loại PBN" prop="phieubiennhan">
        <el-input v-model="role.phieubiennhan" placeholder="Nhập tiêu đề" />
      </el-form-item>
      <el-form-item label="Tên khách hàng" prop="name">
        <el-input v-model="role.name" placeholder="Nhập tiêu đề" />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone">
        <el-input v-model="role.phone" placeholder="Nhập SĐT" />
      </el-form-item>

      <el-form-item label="Nội dung" prop="description">
        <el-input
          v-model="role.description"
          type="textarea"
          placeholder="Nhập nội dung"
        />
      </el-form-item>

      <el-form-item label="Chi nhánh" prop="code_store">
        <div style="display: flex">
          <el-select
            v-model="role.code_store"
            filterable
            placeholder="Chọn chi nhánh"
          >
            <el-option
              v-for="rule in getStores"
              :key="rule.code"
              :value="rule.code"
              :label="rule.name + ' - ' + rule.code"
            />
          </el-select>
          <el-input
            v-model="personnel_name"
            v-if="role.code_store == 'H001'"
            placeholder="Nhập mã nhân viên"
            style="width: 200px; margin-left: 20px"
          />
          <el-button
            v-loading="is_loading"
            type="primary"
            style="width: 100px"
            v-if="role.code_store == 'H001'"
            @click="loadMnv(personnel_name.trim())"
            >Load</el-button
          >
        </div>
        <strong
          style="font-size: 14px"
          v-if="role.code_store == 'H001' && !!personnel_data"
          >(Tên: {{ personnel_data.FullName }}, Phòng ban:
          {{ personnel_data.SiteName }}, Chức vụ:
          {{ personnel_data.TenChucDanh }}, Chi nhánh:
          {{ personnel_data.SiteName }} - {{ personnel_data.SiteId }})</strong
        >
      </el-form-item>

      <el-form-item label="Ngày tạo" prop="date_cre">
        <el-date-picker
          v-model="role.date_cre"
          type="datetime"
          placeholder="Chọn ngày vi phạm"
        />
      </el-form-item>
    </el-form>

    <div style="text-align: right">
      <div style="display: flex; justify-content: end">
        <el-button
          type="primary"
          icon="el-icon-check"
          :loading="loadingPopup"
          @click="submitForm('role')"
          >Xác nhận</el-button
        >

        <el-button icon="el-icon-close" @click="handleClose">Đóng</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { addTicketOnline } from "@/api/ticket";
import { getstores } from "@/api/all";
import { Message } from "element-ui";
import { getUser } from "@/utils/auth.js";

let url = "";

if (window.location.host === "dmcltk.stdmcl.com:8099") {
  url = process.env.VUE_APP_BASE_API;
} else {
  url = process.env.VUE_APP_BASE_API_DEV;
}

export default {
  props: ["formAdd"],
  data() {
    return {
      role: {
        date_cre: new Date().toLocaleString("sv-SE"),
        name: "",
        code_store: "",
        description: "",
        phieubiennhan: "",
        status: 1,
        phone: "",
        approved: 0,
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tiêu đề không để trống",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "Nội dung không để trống",
            trigger: "blur",
          },
        ],
        phieubiennhan: [
          {
            required: true,
            message: "Phiếu biên nhận không để trống",
            trigger: "blur",
          },
        ],
      },
      loadingPopup: false,
      fileList: [],
      files: [],

      personnel_name: "",
      personnel_data: null,
      is_loading: false,
    };
  },
  watch: {
    "role.code_store"() {
      this.personnel_name = "";
      this.personnel_data = null;
    },
  },
  computed: {
    getStores() {
      return this.$store.state.store.stores;
    },
  },
  methods: {
    async loadMnv(data) {
      if (data === "") {
        this.$notify({
          title: "Warning",
          message: "Mã NV không để trống",
          type: "warning",
        });

        return false;
      }

      this.is_loading = true;

      const response = await fetch(
        url +
          "/restful/getinfonhanvien?&username=" +
          data +
          "&" +
          JSON.parse(getUser()).find((a) => a.split("=")[0] === "token")
      );
      const datares = await response.json();

      if (datares.status === 200) {
        if (datares.code === 0) {
          this.personnel_data = datares.data;
        } else {
          this.$notify.error({
            title: "Error",
            message: datares.message,
          });
        }
      }
      this.is_loading = false;
    },
    handleExceed() {
      this.$message.warning("Vui lòng up tối đa 30 hình!!");
    },
    handleChange(file, fileList) {
      let arr = [];
      fileList.forEach((a) => {
        arr = [...arr, a.raw];
      });
      this.files = arr;
      this.fileList = fileList;
    },
    handleClose() {
      this.$parent.handleAdd(false);
    },
    getStore() {
      getstores().then((res) => {
        if (Number(res.status) === 200) {
          this.listsStore = res.data.data;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingPopup = true;

          let code_store = this.role.code_store;

          if (
            code_store === "H001" &&
            this.personnel_data?.SiteName === "Phòng Kinh Doanh Online"
          ) {
            code_store = "KDOL";
          }

          const formdata = new FormData();
          formdata.append("name", this.role.name);
          formdata.append("description", this.role.description);
          formdata.append("status", this.role.status);
          formdata.append("approved", this.role.approved);
          formdata.append("code_store", code_store);
          formdata.append("phieubiennhan", this.role.phieubiennhan);
          formdata.append("phone", this.role.phone);

          formdata.append(
            "date_cre",
            new Date(this.role.date_cre).toLocaleString("sv-SE")
          );

          addTicketOnline(formdata)
            .then((res) => {
              if (Number(res.status) === 200) {
                this.$parent.getLists(1);
                this.handleClose();
                Message({
                  message: "Tạo ticket thành công",
                  type: "success",
                  duration: 5 * 1000,
                });
              }
              this.loadingPopup = false;
            })
            .catch((err) => {
              Message({
                message: err,
                type: "error",
                duration: 5 * 1000,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
