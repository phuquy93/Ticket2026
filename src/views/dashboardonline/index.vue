<template>
  <div class="app-container" style="background-color: #f0f2f5">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=0" class="card-panel">
          <div class="card-panel-icon-wrapper icon-new">
            <i class="fa fa-list-alt" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Mới tạo</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 0)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 0).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-loading">
            <i class="fa fa-cubes" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Ticket đang xử lý</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 1)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 1).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </div>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=2" class="card-panel">
          <div class="card-panel-icon-wrapper icon-completed">
            <i class="fa fa-users" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Cần thẩm định</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 2)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 2).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=5" class="card-panel">
          <div class="card-panel-icon-wrapper icon-requestcancle">
            <i class="fa fa-retweet" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Yêu cầu xử lý lại</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 5)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 5).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=3" class="card-panel">
          <div class="card-panel-icon-wrapper icon-waitreport">
            <i class="fa fa-paper-plane" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Đợi ra biên bản</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 3)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 3).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=6" class="card-panel">
          <div class="card-panel-icon-wrapper icon-report">
            <i class="fa fa-building" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Đã ra biên bản</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 6)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 6).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=4" class="card-panel">
          <div class="card-panel-icon-wrapper icon-cancle">
            <i class="fa fa-window-close" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Ticket đã xử lý</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 4)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 4).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=9" class="card-panel">
          <div class="card-panel-icon-wrapper icon-qc">
            <i class="fa fa-flag-checkered" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Ticket đã trả hàng</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 9)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 9).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="6" class="card-panel-col">
        <router-link to="/manage/qc/online#approved=10" class="card-panel">
          <div class="card-panel-icon-wrapper icon-loading">
            <i class="fa fa-server" aria-hidden="true" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Ticket hợp lệ</div>
            <template v-if="loading">
              <template v-if="data.find((a) => a.approved == 10)">
                <count-to
                  :start-val="0"
                  :end-val="data.find((a) => a.approved == 10).count_ticket"
                  :duration="3600"
                  class="card-panel-num"
                />
              </template>
              <span v-else class="card-panel-num">0</span>
            </template>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <div style="background: #fff">
          <h3
            style="padding: 10px"
            v-if="data && Array.isArray(data)"
          >
            Tổng:
            <span style="color: red">{{
              data.reduce((total, item) => total + item.count_ticket, 0)
            }}</span>
          </h3>
          <pie-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CountTo from "vue-count-to";
import PieChart from "./PieChart";
import { Message } from "element-ui";
import { removeData } from "@/utils/auth.js";

export default {
  components: {
    CountTo,
    PieChart,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    data() {
      return this.$store.state.ticket.data;
    },
  },
  created() {
    this.$store.dispatch("ticket/getDashboardonline").then((res) => {
      this.loading = true;
      if (Number(res.status) !== 200) {
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
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    display: flex;

    .icon-new {
      color: #2ec7c9;
    }

    .icon-loading {
      color: #b6a2de;
    }

    .icon-completed {
      color: #b6a2de;
    }

    .icon-cancle {
      color: #8d98b3;
    }
    .icon-requestcancle {
      color: #5ab1ef;
    }
    .icon-waitreport {
      color: #ffb980;
    }
    .icon-report {
      color: #d87a80;
    }
    .icon-qc {
      color: #e5cf0d;
    }
    .icon-hl {
      color: #97b552;
    }
    .card-panel-icon-wrapper {
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon-wrapper i {
      font-size: 50px;
    }
    .card-panel-description {
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-icon-wrapper {
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
