<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="auth-side">
        <div>
          <img
            class="auth-logo"
            src="http://180.16.1.133:8080/js/app_serial_system/img/logo.png"
            alt="Điện Máy Chợ Lớn"
          />
          <span class="portal-pill"><span class="dot" /> Cổng Ticket</span>
          <h2>Hệ thống Ticket<br />Điện Máy Chợ Lớn</h2>
          <p>
            Tiếp nhận, xử lý và theo dõi yêu cầu bảo hành, lắp đặt, khẩn cấp
            trên một cổng duy nhất.
          </p>
          <div class="chips">
            <span>Ticket</span><span>Khẩn cấp</span><span>Lắp đặt</span><span>QC</span>
          </div>
        </div>
        <div class="copyright">
          © {{ year }} Siêu thị Điện Máy — Nội Thất Chợ Lớn
        </div>
      </div>

      <div class="auth-form">
        <h1>Đăng nhập</h1>
        <p class="sub">Dùng tài khoản nhân viên đã được cấp.</p>

        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          @submit.native.prevent="submitForm('ruleForm')"
        >
          <div class="field">
            <label for="username">Tài khoản</label>
            <el-form-item prop="username">
              <el-input
                id="username"
                ref="username"
                v-model="ruleForm.username"
                name="username"
                autocomplete="username"
              />
              <span
                v-if="error != null && error.username && error.username.isEmpty"
                class="error"
                >{{ error.username.isEmpty }}</span
              >
            </el-form-item>
          </div>

          <div class="field">
            <label for="password">Mật khẩu</label>
            <el-form-item prop="password">
              <el-input
                id="password"
                ref="password"
                v-model="ruleForm.password"
                class="has-eye"
                autocomplete="current-password"
                name="password"
                :type="passwordType"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
              <span
                v-if="error != null && error.password && error.password.isEmpty"
                class="error"
                >{{ error.password.isEmpty }}</span
              >
            </el-form-item>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <i
              :class="loading ? 'el-icon-loading' : 'fas fa-sign-in-alt'"
              aria-hidden="true"
            />
            Đăng nhập
          </button>
        </el-form>

        <p class="muted">Quên mật khẩu? Liên hệ quản trị viên hệ thống.</p>
      </div>
    </div>
  </div>
</template>
<script>
import { removeData } from "../../utils/auth";
export default {
  data() {
    return {
      year: new Date().getFullYear(),
      passwordType: "password",
      loading: false,
      error: null,
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "Tên đăng nhập không để trống",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Password không để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    removeData("Admin-Tabs-Ticket");
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    submitForm(formName) {
      if (this.loading) return;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          const formData = new FormData();
          formData.append("username", this.ruleForm.username);
          formData.append("password", this.ruleForm.password);

          this.$store
            .dispatch("user/login", formData)
            .then((res) => {
              if (Number(res.status) === 200) {
                if (this.$route.query.redirect) {
                  window.location.href = this.$route.query.redirect;
                } else {
                  window.location.href = "/";
                }
              } else {
                this.error = res.data;
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* Theo DMCL design kit (dmcl_2026_new: public/kit/tokens.css — .auth-*),
   màu brand lấy từ kit-bridge.css (--adm-brand-surface). */
$brand: #2f6da4;
$brand-dark: mix(#000, $brand, 27%);
$brand-tint: mix($brand, #fff, 9%);
$ink: #181b1f;
$muted: #666e78;
$bg: #f4f5f7;
$border: #e3e6ea;
$danger: #c62828;

.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at 15% 10%, $brand-tint 0%, $bg 45%);
  color: $ink;
  font-family: "Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial,
    sans-serif;
  font-size: 14.5px;
  line-height: 1.55;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

.auth-card {
  width: 100%;
  max-width: 920px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(20, 20, 30, 0.04), 0 8px 20px rgba(20, 20, 30, 0.06);
  display: flex;
  overflow: hidden;
  border: 1px solid $border;
}

.auth-side {
  flex: 1;
  background: linear-gradient(160deg, $brand, $brand-dark);
  color: #fff;
  padding: 40px 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 260px;

  .auth-logo {
    display: block;
    height: 46px;
    width: auto;
    margin-bottom: 22px;
    border-radius: 9px;
    background: #fff;
    padding: 5px 11px;
  }

  .portal-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    padding: 4px 11px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 14px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  }

  h2 {
    font-size: 22px;
    margin: 0 0 10px;
    line-height: 1.35;
    color: #fff;
  }

  p {
    opacity: 0.92;
    font-size: 13.5px;
    margin: 0;
  }

  .chips {
    margin-top: 26px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    span {
      background: rgba(255, 255, 255, 0.18);
      border-radius: 999px;
      padding: 4px 11px;
      font-size: 12px;
    }
  }

  .copyright {
    margin-top: 26px;
    font-size: 11.5px;
    opacity: 0.85;
  }
}

.auth-form {
  flex: 1.15;
  padding: 40px 38px;
  min-width: 300px;

  h1 {
    font-size: 21px;
    font-weight: 600;
    margin: 0 0 4px;
    color: $ink;
  }

  .sub {
    color: $muted;
    font-size: 13.5px;
    margin: 0 0 22px;
  }

  .muted {
    color: $muted;
    font-size: 12.5px;
    margin: 20px 0 0;
  }
}

.field {
  margin-bottom: 16px;

  > label {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: $muted;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 6px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  ::v-deep .el-form-item__content {
    position: relative;
    line-height: normal;
  }

  ::v-deep .el-input__inner {
    height: auto;
    line-height: 1.55;
    padding: 10px 12px;
    border: 1px solid $border;
    border-radius: 9px;
    background: $bg;
    color: $ink;
    font-size: 14.5px;
    transition: border-color 0.15s, background 0.15s;

    &:focus {
      border-color: $brand;
      background: #fff;
    }
  }

  .has-eye ::v-deep .el-input__inner {
    padding-right: 40px;
  }

  ::v-deep .el-form-item.is-error .el-input__inner {
    border-color: $danger;
  }

  ::v-deep .el-form-item__error {
    position: static;
    padding-top: 4px;
    color: $danger;
  }

  .error {
    display: block;
    padding-top: 4px;
    font-size: 12px;
    color: $danger;
  }

  .show-pwd {
    position: absolute;
    top: 11px;
    right: 12px;
    font-size: 16px;
    color: $muted;
    cursor: pointer;
    user-select: none;
  }
}

.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  border: none;
  border-radius: 9px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13.6px;
  font-family: inherit;
  cursor: pointer;
  background: $brand;
  color: #fff;
  transition: transform 0.05s, background 0.15s;

  &:hover {
    background: $brand-dark;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

@media (max-width: 900px) {
  .auth-card {
    flex-direction: column;
  }

  .auth-side {
    padding: 26px;
  }
}

@media (max-width: 480px) {
  .auth-shell {
    padding: 16px;
  }

  .auth-side,
  .auth-form {
    min-width: 0;
  }

  .auth-form {
    padding: 28px 22px;
  }
}
</style>
