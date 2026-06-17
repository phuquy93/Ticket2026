<template>
  <div class="app-container full">
    <el-row class="search">
      <el-col :span="4">
        <el-input v-model="cid_ticket" placeholder="Nhập id ticket" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="pbn" placeholder="Nhập phiếu biên nhận" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="handleStore">
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="log.data" border>
      <el-table-column label="Id ticket">
        <template slot-scope="scope">
          {{ scope.row.cid_ticket }}
        </template>
      </el-table-column>
      <el-table-column label="Tên">
        <template slot-scope="scope">
          {{ scope.row.content.name }}
        </template>
      </el-table-column>

      <el-table-column label="Phiếu biên nhận">
        <template slot-scope="scope">
          {{ scope.row.content.pbn }}
        </template>
      </el-table-column>
      <el-table-column label="Chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.content.code_store }}
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại">
        <template slot-scope="scope">
          {{ scope.row.content.phone }}
        </template>
      </el-table-column>
      <el-table-column label="Note xử lý">
        <template slot-scope="scope">
          {{ scope.row.content.note_user }}
        </template>
      </el-table-column>
      <el-table-column label="Thẩm định đánh giá độ hài lòng">
        <template slot-scope="scope">
          <span
            v-if="scope.row.content.rate && scope.row.content.rate !== null"
          >
            {{ scope.row.content.rate }}
            / 5 sao
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Note thẩm định">
        <template slot-scope="scope">
          {{ scope.row.content.note_user_expertise }}
        </template>
      </el-table-column>
      <el-table-column label="Cách khắc phục">
        <template slot-scope="scope">
          {{ scope.row.content.coupon }}
        </template>
      </el-table-column>

      <el-table-column label="Trạng thái">
        <template slot-scope="scope">
          {{ ruleApproved(Number(scope.row.content.approved)) }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="user.find((a) => a.split('=')[0] == 'rule').split('=')[1] === '1'"
        label="Log"
      >
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      :page-size="20"
      layout="total, prev, pager, next"
      :total="log.TotalItem"
      :current-page.sync="pagelog"
      style="margin: 10px 0"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getLog } from '@/api/ticket'

export default {
  name: 'ComponentLog',
  data() {
    return {
      cid_ticket: '',
      pbn: '',

      loading: false,

      log: [],
      pagelog: 1
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },

  created() {
    this.loading = false
    this.getlog({ page: this.pagelog })
  },
  methods: {
    getlog(data) {
      this.loading = true
      this.pagelog = data.page
      getLog(data).then((res) => {
        if (res.status === 200) {
          this.log = res.data
        }
        this.loading = false
      })
    },
    handleCurrentChange(page) {
      this.loading = true
      getLog({ page: page }).then((res) => {
        if (res.status === 200) {
          this.log = res.data
        }
        this.loading = false
      })
    },
    ruleApproved(rule) {
      if (rule === 0) {
        return 'Mới tạo'
      } else if (rule === 1) {
        return 'Đang xử lý'
      } else if (rule === 2) {
        return 'Cần thẩm định'
      } else if (rule === 3) {
        return 'Đợi ra biên bản'
      } else if (rule === 4) {
        return 'Hủy'
      } else if (rule === 5) {
        return 'Yêu cầu xử lý lại'
      } else if (rule === -1) {
        return 'Lưu lại'
      } else if (rule === 6) {
        return 'Đã ra biên bản'
      }
    },
    handleStore() {
      this.getlog({ page: 1, id: this.cid_ticket, pbn: this.pbn })
    }
  }
}
</script>

<style>
.full .el-table__row td:last-child .cell {
  display: block;
  max-height: none;
}
</style>
