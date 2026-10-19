<template>
  <el-drawer
    :visible.sync="formAdd"
    title="Thêm mới"
    :before-close="handleClose"
    direction="rtl"
    size="540px"
    custom-class="ticket-add-drawer"
  >
    <div class="ticket-add">
      <div class="ticket-add__body">
        <el-form
          ref="role"
          :model="role"
          :rules="rules"
          label-width="160px"
          label-position="left"
          class="ticket-add-form"
        >
          <div class="ticket-add-form__header">
            <h3>THÔNG TIN TICKET LẮP ĐẶT</h3>
          </div>
          <el-form-item label="Tiêu đề" prop="name" class="is-full">
            <el-input v-model="role.name" placeholder="Nhập tiêu đề" />
          </el-form-item>
          <el-form-item label="Nội dung" prop="description" class="is-full">
            <el-input
              v-model="role.description"
              type="textarea"
              :autosize="{ minRows: 3 }"
              placeholder="Nhập nội dung"
            />
          </el-form-item>
          <el-form-item label="Nội dung vi phạm" prop="vipham" class="is-full">
            <el-input
              v-model="role.vipham"
              type="textarea"
              :autosize="{ minRows: 3 }"
              placeholder="Nhập nội dung vi phạm"
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
          <el-form-item label="Ngày vi phạm" prop="ngayvipham">
            <el-date-picker
              v-model="role.ngayvipham"
              type="datetime"
              placeholder="Chọn ngày vi phạm"
            />
          </el-form-item>

          <div class="ticket-add-form__header">
            <h3>HÌNH ẢNH VI PHẠM</h3>
          </div>
          <el-form-item label="Hình ảnh vi phạm" class="is-full">
            <el-upload
              class="blockupload"
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
      </div>

      <div class="ticket-add__foot">
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
  </el-drawer>
</template>

<script>
import { addTicketStaff } from "@/api/ticket";
import { getstores } from "@/api/all";
import { Message } from "element-ui";
export default {
  props: ["formAdd"],
  data() {
    return {
      role: {
        name: "",
        code_store: "",
        description: "",
        vipham: "",
        status: 1,
        approved: 0,
        date_cre: new Date().toLocaleString("sv-SE"),
        ngayvipham: "",
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
        vipham: [
          {
            required: true,
            message: "Nội dung vi phạm không để trống",
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
        ngayvipham: [
          {
            type: "date",
            required: true,
            message: "Vui lòng chọn ngày vi phạm",
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
          formdata.append("date_cre", this.role.date_cre);
          formdata.append(
            "ngayvipham",
            new Date(this.role.ngayvipham).toLocaleString("sv-SE")
          );
          formdata.append("vipham", this.role.vipham);
          formdata.append("type", 7);
          this.files.forEach((a, i) => {
            formdata.append("imageFiles[" + i + "]", a);
          });
          addTicketStaff(formdata)
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

<style lang="scss">
/* Drawer "Thêm mới" — cùng kiểu với drawer xem chi tiết (bảng nhãn | giá trị) */
.ticket-add-drawer {
  display: flex;
  flex-direction: column;
  max-width: 100vw; // màn hình hẹp hơn 540px thì chiếm vừa màn hình

  .el-drawer__header {
    padding: 10px !important;
    margin: 0 !important;
  }

  .el-drawer__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.ticket-add {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  // Chỉ phần form cuộn, nút luôn nằm dưới đáy
  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 20px;
  }

  &__foot {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 12px 20px;
    background: #fff;
    border-top: 1px solid #ebeef5;

    .el-button + .el-button {
      margin-left: 0;
    }
  }
}

.ticket-add-form {
  display: grid;
  grid-template-columns: 1fr; // mỗi trường 1 hàng
  border: 1px solid #ebeef5;
  border-bottom: none;
  background: #fff;

  &__header {
    grid-column: 1 / -1;
    background: #ddd;
    padding: 12px;
    border-bottom: 1px solid #ebeef5;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #1f2d3d;
    }
  }

  // Mỗi el-form-item = 1 ô: nhãn (nền nhạt) | giá trị
  .el-form-item {
    display: flex;
    margin: 0;
    border-bottom: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;

    &.is-full {
      grid-column: 1 / -1;
    }
  }

  .el-form-item__label {
    flex-shrink: 0;
    width: 160px !important;
    padding: 10px 12px;
    background: #f7f8fa;
    border-right: 1px solid #ebeef5;
    color: #606266;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.5;
    text-align: left;
    float: none;
  }

  .el-form-item__content {
    flex: 1;
    min-width: 0;
    margin-left: 0 !important;
    padding: 10px 12px;
    line-height: normal;
  }

  .el-form-item__error {
    position: static;
    padding-top: 4px;
  }

  .el-select,
  .el-date-editor.el-input {
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  .ticket-add-form {
    .el-form-item__label {
      width: 120px !important;
    }
  }
}
</style>
