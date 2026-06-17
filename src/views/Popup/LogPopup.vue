<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="Log"
    width="80%"
    :before-close="handleClose"
    append-to-body
  >
    <div style="max-height: 600px; overflow-y: auto">
      <el-table v-if="log !== null" :data="log.data" border>
        <el-table-column label="Note xử lý">
          <template slot-scope="scope">
            {{ scope.row.content.note_user }}
          </template>
        </el-table-column>
        <el-table-column label="Tên user">
          <template slot-scope="scope">
            {{ scope.row.name_user }}
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
        <el-table-column label="Ngày tạo">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái">
          <template slot-scope="scope">
            {{ ruleApproved(Number(scope.row.content.approved)) }}
          </template>
        </el-table-column>

        <el-table-column v-if="userRule === '1'" label="Log">
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
      </el-table>
      <p v-else style="text-align: center; padding: 20px">
        Đang tải dữ liệu...
      </p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        v-if="log === null || pagelog < log.Totalpage"
        v-loading="loading"
        type="primary"
        @click="handleLoadMore"
        >Load thêm</el-button
      >
      <el-button size="small" @click="handleClose">Đóng</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "LogPopup",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    log: {
      type: Object,
      default: null,
    },
    pagelog: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    detailId: {
      type: Number,
      required: true,
    },
    userRule: {
      type: String,
      default: "",
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        if (!val) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleLoadMore() {
      this.$emit("load-more", { id: this.detailId, page: this.pagelog + 1 });
    },
    ruleApproved(rule) {
      if (rule === 0) {
        return "Mới tạo";
      } else if (rule === 1) {
        return "Đang xử lý";
      } else if (rule === 2) {
        return "Cần thẩm định";
      } else if (rule === 3) {
        return "Đợi ra biên bản";
      } else if (rule === 4) {
        return "Đã xử lý";
      } else if (rule === 5) {
        return "Yêu cầu xử lý lại";
      } else if (rule === -1) {
        return "Lưu lại";
      } else if (rule === 6) {
        return "Đã ra biên bản";
      }
    },
  },
};
</script>

<style scoped></style>
