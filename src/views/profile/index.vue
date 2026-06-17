<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <el-card>
            <div class="user-profile">
              <div class="box-center">
                <img
                  src="./f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
                  alt="infouser"
                  style="width: 100px; border-radius: 50%"
                >
              </div>
              <div class="box-center">
                <div class="user-name text-center">
                  {{
                    user.find((a) => a.split("=")[0] === "data").split("=")[1]
                  }}
                </div>
                <div
                  v-if="
                    user
                      .find((a) => a.split('=')[0] === 'code_store')
                      .split('=')[1] !== ''
                  "
                  class="user-role text-center text-muted"
                >
                  Chi nhánh:
                  {{
                    user
                      .find((a) => a.split("=")[0] === "code_store")
                      .split("=")[1]
                  }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-form
              ref="ruleForm"
              v-loading="loading"
              :model="ruleForm"
              status-icon
              :rules="rules"
              label-width="180px"
              class="demo-ruleForm"
            >
              <el-form-item label="Mật khẩu cũ" prop="oldpassword">
                <el-input
                  v-model="ruleForm.oldpassword"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="Mật khẩu mới" prop="password">
                <el-input
                  v-model="ruleForm.password"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="Nhập lại mật khẩu" prop="password2">
                <el-input
                  v-model="ruleForm.password2"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm('ruleForm')"
                >Cập nhật</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'
import { changePassword } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Profile',
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập password cũ'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập password mới'))
      } else {
        if (this.ruleForm.password2 !== '') {
          this.$refs.ruleForm.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập lại password mới'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('Password nhập lại không đúng!'))
      } else {
        callback()
      }
    }
    return {
      user: JSON.parse(getUser()),
      loading: false,
      ruleForm: {
        oldpassword: '',
        password: '',
        password2: ''
      },
      rules: {
        oldpassword: [{ validator: validatePass1, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        password2: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          formData.append('oldpassword', this.ruleForm.oldpassword)
          formData.append('password', this.ruleForm.password)
          formData.append('password2', this.ruleForm.password2)
          this.loading = true
          changePassword(formData).then((res) => {
            Message({
              message: res.message,
              type: 'success',
              duration: 5 * 1000
            })
            if (Number(res.status) === 200) {
              this.ruleForm.oldpassword = ''
              this.ruleForm.password = ''
              this.ruleForm.password2 = ''
            }
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
