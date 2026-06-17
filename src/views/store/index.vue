<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleAddRole"
      >Thêm mới</el-button
    >

    <el-row style="margin-top: 30px">
      <el-col :span="3">
        <el-input v-model="code" placeholder="Nhập mã" />
      </el-col>
      <el-col :span="3">
        <el-input v-model="name" placeholder="Nhập name" />
      </el-col>
      <el-col :span="4">
        <el-button
          v-loading="loading"
          type="primary"
          icon="el-icon-search"
          @click="
            getLists({
              page: 1,
            })
          "
        >
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="lists.data"
      style="width: 100%; margin-top: 30px"
      border
    >
      <el-table-column label="Mã" width="220">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>

      <el-table-column label="Tên" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="Trạng thái">
        <template slot-scope="scope">
          {{
            String(scope.row.status) === "0" ? "Không kích hoạt" : "Kích hoạt"
          }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Tùy chọn">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="handleEdit(scope.row)"
            >Sửa</el-button
          >
          <!-- <el-button
            type="success"
            size="small"
            icon="el-icon-orange"
            @click="handleDelivery(scope.row)"
            >Khu vực giao hàng</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!-- Popup -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="statusPopup"
      :before-close="closePopup"
    >
      <el-form
        ref="role"
        :model="role"
        :rules="rules"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="Mã" prop="code">
          <el-input v-model="role.code" placeholder="Nhập mã" />
        </el-form-item>
        <el-form-item label="Tên" prop="name">
          <el-input v-model="role.name" placeholder="Nhập tên" />
        </el-form-item>
        <el-form-item label="Id google" prop="idgoogle">
          <el-input v-model="role.idgoogle" placeholder="Nhập id google" />
        </el-form-item>
        <el-form-item label="Diện tích" prop="area">
          <el-input v-model="role.area" placeholder="Nhập diện tích" />
        </el-form-item>
        <el-form-item label="Chiều dài" prop="length">
          <el-input v-model="role.length" placeholder="Nhập chiều dài" />
        </el-form-item>
        <el-form-item label="Chiều rộng" prop="width">
          <el-input v-model="role.width" placeholder="Nhập chiều rộng" />
        </el-form-item>
        <el-form-item label="Kho" prop="is_kho">
          <el-checkbox label="Kho" v-model="role.is_kho" />
        </el-form-item>

        <el-form-item label="Kích hoạt" prop="status">
          <el-select v-model="role.status" placeholder="Select">
            <el-option label="Kích hoạt" value="1" />
            <el-option label="Không kích hoạt" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="Mail">
          <div style="display: flex; align-items: end">
            <div>
              <div v-for="a in mail" :key="a.id" style="margin-bottom: 10px">
                <el-input
                  v-model="a.mail"
                  placeholder="Nhập mail"
                  style="width: 300px"
                />
                <el-button
                  v-if="mail.length > 1"
                  type="danger"
                  :loading="loadingPopup"
                  @click="deleteInputMail(a)"
                  >Delete</el-button
                >
              </div>
            </div>
            <el-button
              type="primary"
              :loading="loadingPopup"
              style="margin-left: 10px; margin-bottom: 10px"
              @click="addInputMail"
              >Add</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="Hình ảnh" prop="imageFiles">
          <span
            style="margin-right: 10px"
            v-for="img in role.multi_picture
              ? JSON.parse(role.multi_picture)
              : []"
            :key="img"
          >
            <img
              :src="
                'http://api.dienmaycholontest.site:8090/uploads/store/' +
                role.id +
                '/' +
                img +
                '.png.webp'
              "
              width="100"
              alt=""
            />
          </span>
          <el-upload
            v-if="is_load_picture"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="10"
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
        <div style="display: flex; justify-content: space-between">
          <el-button
            type="primary"
            icon="el-icon-check"
            :loading="loadingPopup"
            @click="submitForm('role')"
            >Xác nhận</el-button
          >

          <el-button icon="el-icon-close" @click="closePopup">Đóng</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="delivery.dialogDelivery"
      title="Khu vực giao hàng"
      :before-close="closePopup"
    >
      <DeliveryPopup
        :delivery="delivery"
        @closePopup="closePopup"
        v-if="delivery.dialogDelivery"
      />
    </el-dialog>

    <!-- Pagination -->
    <el-pagination
      :page-size="10"
      layout="total, prev, pager, next"
      :total="lists.TotalItem"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getlists, addmail, editmail } from "@/api/mail";
import { Message } from "element-ui";
import { removeData } from "@/utils/auth.js";
import DeliveryPopup from "./delivery.vue";

const defaultRole = {
  name: "",
  status: "1",
};

export default {
  name: "ComponentDepartment",

  data() {
    return {
      name: "",
      code: "",
      mail: [
        {
          mail: "",
          id: 1,
        },
      ],
      role: {
        name: "",
        status: "1",
        code: "",
        idgoogle: "",
        area: 0,
        length: 0,
        width: 0,
        is_kho: true,
      },
      rules: {
        code: [
          {
            required: true,
            message: "Mã không để trống",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "Tên không để trống",
            trigger: "blur",
          },
        ],
      },
      fileList: [],

      dialogVisible: false,

      loading: false,
      loadingPopup: false,
      is_load_picture: true,
      statusPopup: "",

      lists: [],

      page: 1,

      delivery: {
        detail: null,
        dialogDelivery: false,
      },
    };
  },
  created() {
    this.getLists({
      page: 1,
    });
  },
  watch: {
    dialogVisible(newData, oldData) {
      if (newData !== oldData) {
        if (newData) {
          this.is_load_picture = true;
        } else {
          this.is_load_picture = false;
          this.fileList = [];
          this.mail = [
            {
              mail: "",
              id: 1,
            },
          ];
        }
      }
    },
  },
  components: { DeliveryPopup },
  methods: {
    handleDelivery(data) {
      this.delivery.dialogDelivery = true;
      this.delivery.detail = data;
    },
    addInputMail() {
      this.mail.push({ mail: "", id: this.mail.length + 1 });
    },
    deleteInputMail(a) {
      const del = this.mail.splice(
        this.mail.findIndex((b) => b.id === a.id),
        1
      );
    },
    closePopup() {
      this.dialogVisible = false;
      this.delivery.dialogDelivery = false;
    },
    handleExceed() {
      this.$message.warning("Vui lòng up tối đa 10 hình!!");
    },
    handleChange(file, fileList) {
      let arr = [];
      fileList.forEach((a) => {
        arr = [...arr, a.raw];
      });
      this.files = arr;
      this.fileList = fileList;
    },
    getLists(data) {
      this.loading = true;
      this.page = data.page;
      data.code = this.code;
      data.name = this.name;
      getlists(data)
        .then((res) => {
          if (Number(res.status) === 200) {
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
      this.getLists({
        page: e,
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let is_kho = 0;
          if (this.role.is_kho) {
            is_kho = 1;
          }
          this.loadingPopup = true;
          const formdata = new FormData();
          formdata.append("name", this.role.name);
          formdata.append("status", this.role.status);
          formdata.append("code", this.role.code);
          formdata.append("area", this.role.area);
          formdata.append("length", this.role.length);
          formdata.append("width", this.role.width);
          formdata.append("is_kho", is_kho);
          formdata.append("idgoogle", this.role.idgoogle);
          this.mail.forEach((a, i) => {
            formdata.append("mail[" + i + "]", a.mail.trim());
          });
          this.fileList.forEach((a, i) => {
            formdata.append("imageFiles[" + i + "]", a.raw);
          });

          if (this.statusPopup === "Thêm mới") {
            addmail(formdata)
              .then((res) => {
                if (Number(res.status) === 200) {
                  this.getLists({ page: 1 });
                  this.dialogVisible = false;
                  this.$refs[formName].resetFields();
                  this.mail = [
                    {
                      mail: "",
                      id: 1,
                    },
                  ];
                  Message({
                    message: "Tạo mới thành công",
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
            formdata.append("id", this.role.id);
            editmail(formdata)
              .then((res) => {
                if (Number(res.status) === 200) {
                  this.getLists({ page: 1 });
                  Message({
                    message: "Sửa thành công",
                    type: "success",
                    duration: 5 * 1000,
                  });
                  this.dialogVisible = false;
                  this.$refs[formName].resetFields();
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
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
      this.dialogVisible = true;
      this.statusPopup = "Thêm mới";
    },
    handleEdit(data) {
      data.status = String(data.status);
      if (data.idgoogle === "null") data.idgoogle = "";

      this.role = Object.assign({}, data);
      if (data.is_kho === 1) {
        this.role.is_kho = true;
      } else {
        this.role.is_kho = false;
      }
      if (data.flag_content !== null && data.flag_content.mail) {
        const arr = [];
        data.flag_content.mail.forEach((e, i) => {
          arr.push({ mail: e, id: i + 1 });
        });
        this.mail = arr;
      }
      this.dialogVisible = true;
      this.statusPopup = "Sửa";
    },
  },
};
</script>

<style scoped>
.el-dialog__wrapper {
  z-index: 999999 !important;
}
</style>
