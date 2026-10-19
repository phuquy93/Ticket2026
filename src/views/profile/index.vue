<template>
  <div class="app-container list-page profile-page">
    <div class="profile-wrap">
      <!-- Thẻ thông tin tài khoản -->
      <div class="profile-card">
        <div class="profile-card__banner" />
        <div class="profile-card__avatar">
          <img
            src="./f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            alt="infouser"
          >
        </div>
        <div class="profile-card__name">{{ fullname }}</div>
        <span class="profile-card__role">{{ roleLabel }}</span>

        <ul class="profile-card__info">
          <li>
            <span class="label"><i class="fas fa-user" /> Tài khoản</span>
            <span class="value">{{ fullname }}</span>
          </li>
          <li v-if="codeStore !== ''">
            <span class="label"><i class="fas fa-store" /> Chi nhánh</span>
            <span class="value">{{ codeStore }}</span>
          </li>
        </ul>
      </div>

      <!-- Đổi mật khẩu -->
      <div class="password-card">
        <div class="password-card__head">
          <div class="password-card__icon">
            <i class="fas fa-key" />
          </div>
          <div>
            <h2>Đổi mật khẩu</h2>
            <p>Mật khẩu mới sẽ dùng cho lần đăng nhập tiếp theo.</p>
          </div>
        </div>

        <el-form
          ref="ruleForm"
          v-loading="loading"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-position="top"
          class="password-form"
        >
          <el-form-item label="Mật khẩu cũ" prop="oldpassword">
            <el-input
              v-model="ruleForm.oldpassword"
              type="password"
              autocomplete="off"
              show-password
              placeholder="Nhập mật khẩu hiện tại"
            />
          </el-form-item>
          <div class="password-form__row">
            <el-form-item label="Mật khẩu mới" prop="password">
              <el-input
                v-model="ruleForm.password"
                type="password"
                autocomplete="off"
                show-password
                placeholder="Nhập mật khẩu mới"
              />
            </el-form-item>
            <el-form-item label="Nhập lại mật khẩu" prop="password2">
              <el-input
                v-model="ruleForm.password2"
                type="password"
                autocomplete="off"
                show-password
                placeholder="Nhập lại mật khẩu mới"
              />
            </el-form-item>
          </div>

          <div class="password-form__actions">
            <el-button
              type="primary"
              icon="el-icon-check"
              :loading="loading"
              @click="submitForm('ruleForm')"
            >Cập nhật</el-button>
          </div>
        </el-form>
      </div>
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
  computed: {
    // Chỉ dùng để hiển thị
    fullname() {
      return this.userField('data')
    },
    codeStore() {
      return this.userField('code_store')
    },
    roleLabel() {
      return Number(this.userField('rule')) === 1 ? 'Quản trị viên' : 'Nhân viên'
    }
  },
  methods: {
    userField(key) {
      const found = (this.user || []).find((a) => a.split('=')[0] === key)
      return found ? found.split('=')[1] : ''
    },
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
$brand: #2f6da4;
$brand-dark: mix(#000, $brand, 27%);
$accent: #ffe400;
$border: #ebeef5;
$muted: #8a919c;

.profile-wrap {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

/* ---- Thẻ tài khoản ---- */
.profile-card {
  background: #fff;
  border: 1px solid $border;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  text-align: center;
  padding-bottom: 8px;

  &__banner {
    height: 84px;
    background: linear-gradient(135deg, $brand, $brand-dark);
  }

  &__avatar {
    width: 96px;
    height: 96px;
    margin: -48px auto 0;
    border-radius: 50%;
    border: 4px solid #fff;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    margin-top: 12px;
    font-size: 18px;
    font-weight: 700;
    color: #1f2d3d;
  }

  &__role {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 12px;
    border-radius: 999px;
    background: $accent;
    color: $brand-dark;
    font-size: 12px;
    font-weight: 700;
  }

  &__info {
    list-style: none;
    margin: 18px 0 0;
    padding: 0 20px;
    text-align: left;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid $border;
      font-size: 14px;
    }

    .label {
      color: $muted;
      white-space: nowrap;

      i {
        width: 16px;
        margin-right: 6px;
        text-align: center;
        color: $brand;
      }
    }

    .value {
      color: #1f2d3d;
      font-weight: 600;
      text-align: right;
      word-break: break-word;
    }
  }
}

/* ---- Đổi mật khẩu ---- */
.password-card {
  background: #fff;
  border: 1px solid $border;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 24px;

  &__head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 18px;
    margin-bottom: 20px;
    border-bottom: 1px solid $border;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1f2d3d;
    }

    p {
      margin: 4px 0 0;
      font-size: 13px;
      color: $muted;
    }
  }

  &__icon {
    width: 44px;
    height: 44px;
    flex: none;
    border-radius: 10px;
    background: mix($brand, #fff, 12%);
    color: $brand;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
}

.password-form {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  ::v-deep .el-form-item__label {
    padding: 0 0 6px;
    line-height: 1.4;
    font-weight: 600;
    color: #606266;
  }

  ::v-deep .el-input__inner {
    height: 40px;
    border-radius: 8px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
  }
}
</style>
