<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="handleAddRole"
    >Thêm mới</el-button>
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
          >Sửa</el-button>
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
        </el-form-item>
        <el-form-item label="Kích hoạt" prop="status">
          <el-select v-model="role.status" placeholder="Select">
            <el-option label="Kích hoạt" value="1" />
            <el-option label="Không kích hoạt" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <div style="display: flex; justify-content: space-between">
          <el-button
            type="primary"
            icon="el-icon-check"
            :loading="loadingPopup"
            @click="submitForm('role')"
          >Xác nhận</el-button>

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
import { getlists, adddepartment, editdepartment } from '@/api/department'
import { Message } from 'element-ui'
import { removeData } from '@/utils/auth.js'
const defaultRole = {
  name: '',
  status: '1'
}

export default {
  name: 'ComponentDepartment',

  data() {
    return {
      role: {
        name: '',
        status: '1'
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Tên không để trống',
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      loading: false,
      loadingPopup: false,

      statusPopup: '',

      lists: [],

      page: 1
    }
  },
  created() {
    this.getLists({
      page: 1
    })
  },
  methods: {
    closePopup() {
      this.dialogVisible = false
    },

    getLists(data) {
      this.loading = true
      this.page = data.page
      getlists(data)
        .then((res) => {
          if (Number(res.status) === 200) {
            this.lists = res.data
          } else {
            Message({
              message: res.message,
              type: 'error',
              duration: 5 * 1000
            })
            removeData('jwt')
            removeData('ticket_user')
            this.$router.push({
              path: '/login'
            })
          }
          this.loading = false
        })
        .catch((err) => {
          Message({
            message: err,
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    handleCurrentChange(e) {
      this.getLists({
        page: e
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingPopup = true
          const formdata = new FormData()
          formdata.append('name', this.role.name)
          formdata.append('status', this.role.status)
          if (this.statusPopup === 'Thêm mới') {
            adddepartment(formdata)
              .then((res) => {
                if (Number(res.status) === 200) {
                  this.getLists({ page: 1 })
                  this.dialogVisible = false
                  this.$refs[formName].resetFields()
                  Message({
                    message: 'Tạo mới thành công',
                    type: 'success',
                    duration: 5 * 1000
                  })
                }
                this.loadingPopup = false
              })
              .catch((err) => {
                Message({
                  message: err,
                  type: 'error',
                  duration: 5 * 1000
                })
              })
          } else {
            formdata.append('id', this.role.id)
            editdepartment(formdata)
              .then((res) => {
                if (Number(res.status) === 200) {
                  this.getLists({ page: 1 })
                  Message({
                    message: 'Sửa thành công',
                    type: 'success',
                    duration: 5 * 1000
                  })
                  this.dialogVisible = false
                  this.$refs[formName].resetFields()
                }
                this.loadingPopup = false
              })
              .catch((err) => {
                Message({
                  message: err,
                  type: 'error',
                  duration: 5 * 1000
                })
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.dialogVisible = true
      this.statusPopup = 'Thêm mới'
    },
    handleEdit(data) {
      data.status = String(data.status)
      this.role = Object.assign({}, data)
      this.dialogVisible = true
      this.statusPopup = 'Sửa'
    }
  }
}
</script>

