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
      label-width="150px"
      label-position="left"
    >
      <el-form-item label="PBN" prop="phieubiennhan">
        <el-input v-model="role.phieubiennhan" placeholder="Nhập PBN" />
      </el-form-item>
      <el-form-item label="Tên khách hàng" prop="name">
        <el-input v-model="role.name" placeholder="Nhập tiêu đề" />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone">
        <el-input v-model="role.phone" placeholder="Nhập SĐT" />
      </el-form-item>
      <el-form-item label="Nội dung QC đánh giá" prop="personnel_note">
        <el-input
          v-model="role.personnel_note"
          type="textarea"
          placeholder="Nhập nội dung QC đánh giá"
        />
      </el-form-item>
      <el-form-item label="Nội dung" prop="description">
        <el-input
          v-model="role.description"
          type="textarea"
          placeholder="Nhập nội dung"
        />
      </el-form-item>

      <el-form-item label="Chi nhánh" prop="code_store">
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
      </el-form-item>

      <el-form-item label="Ngày tạo" prop="date_cre">
        <el-date-picker
          v-model="role.date_cre"
          type="datetime"
          placeholder="Chọn ngày vi phạm"
        />
      </el-form-item>
      <el-form-item label="Hình ảnh vi phạm">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :limit="30"
          multiple
          :on-exceed="handleExceed"
          :on-change="handleChange"
          accept=".jpg, .png, .jpeg"
        >
          <i slot="default" class="el-icon-plus" />
          <div slot="fileList" slot-scope="{ fileList }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="fileList.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
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
import { addTicketSupplies } from "@/api/ticket";
import { getstores } from "@/api/all";
import { Message } from "element-ui";
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
        personnel_note: "",
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
        code_store: [
          {
            required: true,
            message: "Vui lòng chọn chi nhánh",
            trigger: "change",
          },
        ],
      },
      loadingPopup: false,
      fileList: [],
      files: [],
    };
  },
  computed: {
    getStores() {
      return this.$store.state.store.stores;
    },
  },
  methods: {
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
          const formdata = new FormData();
          formdata.append("name", this.role.name);
          formdata.append("description", this.role.description);
          formdata.append("status", this.role.status);
          formdata.append("approved", this.role.approved);
          formdata.append("code_store", this.role.code_store);
          formdata.append("phieubiennhan", this.role.phieubiennhan);
          formdata.append("phone", this.role.phone);
          formdata.append("personnel_note", this.role.personnel_note);
          formdata.append(
            "date_cre",
            new Date(this.role.date_cre).toLocaleString("sv-SE")
          );
          this.files.forEach((a, i) => {
            formdata.append("imageFiles[" + i + "]", a);
          });
          addTicketSupplies(formdata)
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

