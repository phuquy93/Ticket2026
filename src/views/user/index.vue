<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleAddRole"
      >Thêm mới</el-button
    >

    <el-row style="margin-top: 30px">
      <el-col :span="3">
        <el-input v-model="username" placeholder="Nhập tên user" />
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="code_store"
          v-loading="loading"
          placeholder="Chọn chi nhánh"
          filterable
        >
          <el-option
            v-for="rule in listsStore"
            :key="rule.code"
            :value="rule.code"
            :label="rule.name"
          /> </el-select
      ></el-col>
      <el-col :span="4">
        <el-button
          v-loading="loading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
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
      <el-table-column label="Tên" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Tên đăng nhập" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Trạng thái">
        <template slot-scope="scope">
          {{ scope.row.status === "0" ? "Không kích hoạt" : "Kích hoạt" }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Phân quyền">
        <template slot-scope="scope">
          {{ ruleStatus(scope.row.rule) }}
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
        <el-form-item label="Tên" prop="name">
          <el-input v-model="role.name" placeholder="Nhập tên" />
          <span v-if="error.name && error.name.isEmpty" class="error">{{
            error.name.isEmpty
          }}</span>
        </el-form-item>
        <el-form-item
          v-if="statusPopup === 'Thêm mới'"
          label="Tên đăng nhập"
          prop="username"
        >
          <el-input v-model="role.username" placeholder="Nhập tên đăng nhập" />
          <span v-if="error.username && error.username.isEmpty" class="error">{{
            error.username.isEmpty
          }}</span>
          <span
            v-if="error.username && error.username.objectNotUnique"
            class="error"
            >{{ error.username.objectNotUnique }}</span
          >
        </el-form-item>
        <el-form-item
          v-if="statusPopup === 'Thêm mới'"
          label="Password"
          prop="password"
        >
          <el-input v-model="role.password" placeholder="Nhập password" />
          <span v-if="error.password && error.password.isEmpty" class="error">{{
            error.password.isEmpty
          }}</span>
        </el-form-item>
        <el-form-item v-else label="Sửa password">
          <el-input v-model="role.password" placeholder="Nhập password" />
          <span v-if="error.password && error.password.isEmpty" class="error">{{
            error.password.isEmpty
          }}</span>
        </el-form-item>
        <el-form-item
          v-if="statusPopup === 'Thêm mới'"
          label="Nhập lại password"
          prop="password2"
        >
          <el-input v-model="role.password2" placeholder="Nhập lại password" />
          <span
            v-if="error.password2 && error.password2.isEmpty"
            class="error"
            >{{ error.password2.isEmpty }}</span
          >
        </el-form-item>
        <el-form-item label="Tài khoản call">
          <el-input
            v-model="role.flag_content.username_call"
            placeholder="Nhập tài khoản call"
          />
        </el-form-item>
        <el-form-item label="Mật khẩu call">
          <el-input
            v-model="role.flag_content.password_call"
            placeholder="Nhập mật khẩu call"
          />
        </el-form-item>
        <el-form-item label="Thời gian kết thúc khi không kết nối được">
          <el-input
            v-model="role.flag_content.timeout_call"
            placeholder="Nhập thời gian"
          />
        </el-form-item>
        <el-form-item label="CaseOut">
          <el-input
            v-model="role.flag_content.caseout_call"
            placeholder="Nhập CaseOut"
          />
        </el-form-item>

        <el-form-item label="Kích hoạt" prop="status">
          <el-select v-model="role.status" placeholder="Select">
            <el-option label="Kích hoạt" value="1" />
            <el-option label="Không kích hoạt" value="0" />
          </el-select>
          <span v-if="error.status && error.status.isEmpty" class="error">{{
            error.status.isEmpty
          }}</span>
        </el-form-item>
        <el-form-item label="Quyền" prop="rule">
          <el-select v-model="role.rule" placeholder="Select">
            <el-option label="Admin" :value="1" />
            <el-option label="User thường" :value="2" />
            <el-option label="Thẩm định" :value="3" />
            <el-option label="Văn bản" :value="4" />
            <el-option label="An ninh" :value="5" />
            <el-option label="Hành chánh nhân sự" :value="6" />
            <el-option label="QC" :value="7" />
            <el-option label="KDOL" :value="8" />
          </el-select>
          <span v-if="error.rule && error.rule.isEmpty" class="error">{{
            error.rule.isEmpty
          }}</span>
        </el-form-item>
        <el-form-item label="Chi nhánh" prop="code_store">
          <div class="blockstore">
            <div class="stores">
              <b>Chi nhánh không áp dụng</b>
              <el-input
                placeholder="Nhập tên chi nhánh"
                v-model="storeNoApply"
              />

              <div class="scroll">
                <a
                  href="#"
                  @click="handleChooseStore(st)"
                  class="store"
                  :style="[
                    { 'justify-content': 'end' },
                    { 'background-color': returnColor(st) },
                  ]"
                  v-for="st in returnStoreNoApply"
                  :key="st.id"
                >
                  {{ st.name }}
                  <svg
                    style="margin-left: 10px"
                    fill="#000000"
                    height="20px"
                    width="20px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xml:space="preserve"
                  >
                    <g>
                      <g>
                        <path
                          d="M256,0C114.62,0,0,114.62,0,256s114.62,256,256,256s256-114.62,256-256S397.38,0,256,0z M256,486.4
			C128.956,486.4,25.6,383.044,25.6,256S128.956,25.6,256,25.6S486.4,128.956,486.4,256S383.044,486.4,256,486.4z"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path
                          d="M341.854,246.955l-128-128.009c-5.001-5.001-13.099-5.001-18.099,0c-5.001,5-5.001,13.099,0,18.099L314.701,256
			L195.746,374.946c-5.001,5-5.001,13.099,0,18.099c2.5,2.509,5.777,3.755,9.054,3.755c3.277,0,6.554-1.246,9.054-3.746l128-128
			C346.854,260.053,346.854,251.955,341.854,246.955z"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
            </div>
            <div class="stores">
              <b>Chi nhánh áp dụng</b>
              <el-input placeholder="Nhập tên chi nhánh" v-model="storeApply" />
              <div class="scroll">
                <a
                  href="#"
                  @click.prevent="handleChooseStore(st)"
                  class="store"
                  v-for="st in returnStoreApply"
                  :key="st.id"
                >
                  <svg
                    style="margin-right: 10px"
                    height="21px"
                    width="21px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 489.6 489.6"
                    xml:space="preserve"
                  >
                    <g>
                      <g>
                        <path
                          d="M244.8,489.6c135,0,244.8-109.8,244.8-244.8S379.8,0,244.8,0S0,109.8,0,244.8
			S109.8,489.6,244.8,489.6z M244.8,19.8c124.1,0,225,100.9,225,225s-100.9,225-225,225s-225-100.9-225-225S120.7,19.8,244.8,19.8z"
                        />
                        <path
                          d="M265.5,326.1c1.9,1.9,4.5,2.9,7,2.9s5.1-1,7-2.9c3.9-3.9,3.9-10.1,0-14l-67.3-67.3l67.3-67.3
			c3.9-3.9,3.9-10.1,0-14s-10.1-3.9-14,0l-74.3,74.3c-3.9,3.9-3.9,10.1,0,14L265.5,326.1z"
                        />
                      </g>
                    </g>
                  </svg>
                  {{ st.name }}
                </a>
              </div>
            </div>
          </div>
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

    <!-- Pagination -->
    <el-pagination
      :page-size="20"
      layout="total, prev, pager, next"
      :total="lists.TotalItem"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getlists, adduser, edituser } from "@/api/user";
import { Message } from "element-ui";
import { getstores } from "@/api/all";
import { removeData } from "@/utils/auth.js";
import { request } from "@/utils/fetch";

const defaultRole = {
  name: "",
  username: "",
  password: "",
  status: "1",
  rule: 2,
  code_store: [],
  flag_content: {
    username_call: "",
    password_call: "",
    timeout_call: "",
    caseout_call: "",
  },
};

export default {
  name: "ComponentUser",

  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Mật khẩu nhập lại không để trống."));
      } else if (value !== this.role.password) {
        callback(new Error("Mật khẩu nhập lại không đúng"));
      } else {
        callback();
      }
    };

    // var validateCode_store = (rule, value, callback) => {
    //   if (this.role.code_store.length > 1 && this.role.rule === 2) {
    //     callback(new Error("Quyền user thường tối đa chọn 1 chi nhánh"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      username: "",
      role: {
        name: "",

        password: "",
        password2: "",
        status: 1,
        rule: 2,
        code_store: [],
        flag_content: {
          username_call: "",
          password_call: "",
          timeout_call: "",
          caseout_call: "",
        },
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên không để trống",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không để trống",
            trigger: "blur",
          },
          {
            min: 4,
            message: "Ký tự phải lớn hơn 3",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Mật khẩu không để trống",
            trigger: "blur",
          },
          {
            min: 4,
            message: "Ký tự phải lớn hơn 3",
            trigger: "blur",
          },
        ],
        password2: [
          { validator: validatePass2, trigger: "blur" },
          {
            required: true,
            message: "Mật khẩu không để trống",
            trigger: "blur",
          },
        ],
        // code_store: [{ validator: validateCode_store, trigger: "blur" }],
      },
      dialogVisible: false,
      loading: false,
      loadingPopup: false,
      listsStore: [],
      statusPopup: "",

      lists: [],
      error: {
        password: "",
        password2: "",
        rule: "",
        status: "",
        username: "",
      },

      page: 1,
      code_store: "",

      storeNoApply: "",
      storeApply: "",

      storeAdded: [],
    };
  },
  computed: {
    stores() {
      return this.$store.state.store.stores;
    },
    returnStoreNoApply() {
      return this.listsStore
        .filter((a) => !this.role.code_store.includes(a.code))
        .filter((item) =>
          item.name.toLowerCase().includes(this.storeNoApply.toLowerCase())
        );
    },
    returnStoreApply() {
      return this.listsStore
        .filter((a) => this.role.code_store.includes(a.code))
        .filter((item) =>
          item.name.toLowerCase().includes(this.storeApply.toLowerCase())
        );
    },
  },
  watch: {
    dialogVisible(newData, oldData) {
      if (!newData) this.storeAdded = [];
    },
    "role.rule"(newData, oldData) {
      if (newData === 3 || newData === 7) {
        this.handleChooseRole();
      }
    },
  },
  created() {
    this.getStore();
    this.getLists({
      username: this.username,
      code_store: this.code_store,
      page: 1,
    });
  },
  methods: {
    returnColor(st) {
      if (this.storeAdded.find((a) => a === st.code)) {
        return "#e6a700";
      }
      return "";
    },
    closePopup() {
      this.dialogVisible = false;
    },
    handleSearch() {
      this.getLists({
        username: this.username,
        code_store: this.code_store,
        page: 1,
      });
    },
    getStore() {
      getstores().then((res) => {
        if (Number(res.status) === 200) {
          this.listsStore = res.data.data;
        }
      });
    },
    getLists(data) {
      this.loading = true;
      this.page = data.page;
      data.listuseradmin = true;
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
        username: this.username,
        code_store: this.code_store,
        page: e,
      });
    },
    ruleStatus(rule) {
      if (rule === 1) {
        return "Admin";
      } else if (rule === 2) {
        return "User thường";
      } else if (rule === 3) {
        return "Thẩm định";
      } else if (rule === 5) {
        return "An ninh";
      } else if (rule === 6) {
        return "Hành chánh nhân sự";
      } else if (rule === 7) {
        return "QC";
      } else if (rule === 8) {
        return "KDOL";
      } else {
        return "Văn bản";
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.role.code_store.length > 1 && this.role.rule === 2) {
            Message({
              message: "Quyền user thường tối đa chọn 1 chi nhánh",
              type: "error",
              duration: 5 * 1000,
            });
            return;
          }

          const code_store = this.role.code_store.toString();

          this.loadingPopup = true;
          const formdata = new FormData();
          Object.entries(this.role).forEach((a) => {
            if (a[0] !== "flag_content") {
              if (a[0] !== "code_store") {
                formdata.append(a[0], a[1]);
              } else {
                formdata.append("code_store", code_store);
              }
            } else {
              formdata.append("caseout_call", a[1].caseout_call);
              formdata.append("password_call", a[1].password_call);
              formdata.append("timeout_call", a[1].timeout_call);
              formdata.append("username_call", a[1].username_call);
            }
          });
          if (this.statusPopup === "Thêm mới") {
            adduser(formdata)
              .then((res) => {
                if (Number(res.status) === 200) {
                  this.getLists({
                    username: this.username,
                    code_store: this.code_store,
                    page: 1,
                  });
                  this.dialogVisible = false;
                  this.$refs[formName].resetFields();
                  Message({
                    message: "Tạo user thành công",
                    type: "success",
                    duration: 5 * 1000,
                  });
                } else {
                  this.error = res.data;
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
            edituser(formdata)
              .then((res) => {
                if (Number(res.status) === 200) {
                  this.getLists({
                    username: this.username,
                    code_store: this.code_store,
                    page: 1,
                  });
                  Message({
                    message: "Sửa user thành công",
                    type: "success",
                    duration: 5 * 1000,
                  });
                  this.dialogVisible = false;
                  this.$refs[formName].resetFields();
                } else {
                  this.error = res.data;
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
    async handleEdit(data) {
      this.loading = true;
      let res = await request({
        url: "/restful/checkliststore?role=" + this.role.rule,
        method: "get",
      });

      if (res.status === 200) {
        data.password = "";

        if (!data.code_store) data.code_store = [];

        this.role = Object.assign({}, data);

        this.dialogVisible = true;

        this.loading = false;

        this.statusPopup = "Sửa";

        this.storeAdded = Object.keys(res.data);
      }
    },
    async handleChooseRole() {
      this.loading = true;
      let res = await request({
        url: "/restful/checkliststore?role=" + this.role.rule,
        method: "get",
      });

      if (res.status === 200) {
        this.loading = false;
        this.storeAdded = Object.keys(res.data);
      }
    },
    handleChooseStore(item) {
      let index = this.role.code_store.findIndex((a) => a === item.code);
      if (index === -1) {
        if (this.role.code_store.length > 0 && this.role.rule === 2) {
          Message({
            message: "Quyền user thường tối đa chọn 1 chi nhánh",
            type: "error",
            duration: 5 * 1000,
          });
          return;
        }
        this.role.code_store.push(item.code);
      } else {
        let del = this.role.code_store.splice(index, 1);
      }
    },
  },
};
</script>

