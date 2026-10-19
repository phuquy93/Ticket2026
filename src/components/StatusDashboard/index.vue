<template>
  <div class="sd-wrap">
    <!-- Header -->
    <div class="sd-header">
      <div class="sd-header-left">
        <div class="sd-header-icon">
          <i :class="icon" aria-hidden="true" />
        </div>
        <div>
          <h2 class="sd-title">{{ title }}</h2>
          <p class="sd-subtitle">
            Tổng quan trạng thái · {{ formatNumber(total) }} ticket
          </p>
        </div>
      </div>
    </div>

    <!-- Nội dung: thẻ trạng thái + biểu đồ -->
    <div class="sd-body">
      <div class="sd-cards">
        <!-- Thẻ "Tất cả" -->
        <div
          v-if="showAll"
          class="sd-card sd-card--all"
          :class="{ 'is-clickable': !!allPath && !isDisabled(allPath) }"
          @click="go(allPath)"
        >
          <div class="sd-card-top">
            <span class="sd-card-label">Tất cả</span>
            <span class="sd-card-badge">100%</span>
          </div>
          <div class="sd-card-value">{{ formatNumber(total) }}</div>
          <span v-if="allPath" class="sd-card-link">Xem ›</span>
        </div>

        <!-- Thẻ từng trạng thái -->
        <div
          v-for="item in items"
          :key="item.key"
          class="sd-card"
          :style="{ background: item.color }"
          :class="{ 'is-clickable': !!item.path && !isDisabled(item.path) }"
          @click="go(item.path)"
        >
          <div class="sd-card-top">
            <span class="sd-card-label">{{ item.label }}</span>
            <span class="sd-card-badge">{{ item.percent }}%</span>
          </div>
          <div class="sd-card-value">{{ formatNumber(item.value) }}</div>
          <span v-if="item.path" class="sd-card-link">Xem ›</span>
        </div>
      </div>

      <!-- Biểu đồ cột ngang -->
      <div class="sd-chart">
        <p class="sd-chart-title">Số lượng theo trạng thái</p>
        <div
          ref="chart"
          class="sd-chart-canvas"
          :style="{ height: chartHeight + 'px' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { constantRoutes } from "@/router";

export default {
  name: "StatusDashboard",
  props: {
    // Tiêu đề (vd "Ticket khách hàng")
    title: { type: String, default: "Tổng quan" },
    // Icon ở header (class Font Awesome)
    icon: { type: String, default: "fa fa-address-card" },
    // Dữ liệu thô từ store: [{ approved, count_ticket }]
    data: { type: Array, default: () => [] },
    // Cấu hình trạng thái: [{ key, label, approved, color, path }]
    statuses: { type: Array, default: () => [] },
    // Đường dẫn cho thẻ "Tất cả" (rỗng = không điều hướng)
    allPath: { type: String, default: "" },
    // Có hiện thẻ "Tất cả" không
    showAll: { type: Boolean, default: true },
    // Có kiểm tra quyền theo route trước khi điều hướng không
    // (chỉ dashboard KH & NV dùng, các trang khác điều hướng tự do)
    guarded: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  data() {
    return { chart: null };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
    total() {
      return (this.data || []).reduce(
        (sum, it) => sum + (Number(it.count_ticket) || 0),
        0
      );
    },
    // Mỗi trạng thái kèm value + % theo tổng
    items() {
      const total = this.total || 0;
      return this.statuses.map((s) => {
        const found = (this.data || []).find(
          (a) => Number(a.approved) === Number(s.approved)
        );
        const value = found ? Number(found.count_ticket) || 0 : 0;
        const percent = total ? Math.round((value / total) * 100) : 0;
        return { ...s, value, percent };
      });
    },
    // Chiều cao canvas co giãn theo số trạng thái để cột không bị bóp / nhãn không bị cắt
    chartHeight() {
      return Math.max(300, this.items.length * 46 + 60);
    },
  },
  watch: {
    items() {
      this.$nextTick(this.renderChart);
    },
  },
  mounted() {
    this.renderChart();
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    formatNumber(n) {
      return Number(n || 0).toLocaleString("en-US");
    },
    resize() {
      if (this.chart) this.chart.resize();
    },
    // Kiểm tra quyền theo route (giống logic disabledRule cũ)
    isDisabled(path) {
      if (!path) return true;
      // Trang không bật guard -> luôn cho điều hướng
      if (!this.guarded) return false;
      // Bỏ phần hash (#approved=..) khi dò route
      const cleanPath = path.split("#")[0];
      const find = (routes, target) => {
        for (const r of routes) {
          if (r.path === target) return r;
          if (r.children && r.children.length) {
            const f = find(r.children, target);
            if (f) return f;
          }
        }
        return null;
      };
      const route = find(constantRoutes, cleanPath);
      const roles = (route && route.meta && route.meta.roles) || [];
      // Route không giới hạn quyền -> cho phép
      if (!roles.length) return false;
      const rule = Number(
        (this.user.find((a) => a.split("=")[0] === "rule") || "=").split("=")[1]
      );
      return !roles.find((a) => Number(a) === rule);
    },
    go(path) {
      if (!path || this.isDisabled(path)) return;
      this.$router.push(path);
    },
    renderChart() {
      if (!this.$refs.chart) return;
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
        this.chart.on("click", (params) => {
          const item = this.items[params.dataIndex];
          if (item) this.go(item.path);
        });
      }
      const items = this.items;
      const total = this.total || 0;
      // echarts vẽ từ dưới lên -> đảo mảng để giữ đúng thứ tự trên xuống
      const rows = [...items].reverse();

      this.chart.setOption(
        {
          grid: { left: 8, right: 96, top: 8, bottom: 8, containLabel: true },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (p) => {
              const d = p[0];
              const pct = total ? Math.round((d.value / total) * 100) : 0;
              return `${d.name}: <b>${this.formatNumber(
                d.value
              )}</b> (${pct}%)`;
            },
          },
          xAxis: {
            type: "value",
            splitLine: { lineStyle: { color: "#f0f0f0" } },
            axisLabel: { color: "#909399" },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          yAxis: {
            type: "category",
            data: rows.map((r) => r.label),
            axisLabel: { color: "#606266", fontSize: 13 },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          series: [
            {
              type: "bar",
              barWidth: 16,
              itemStyle: {
                color: (p) => rows[p.dataIndex].color,
                barBorderRadius: [0, 8, 8, 0],
              },
              data: rows.map((r) => r.value),
              label: {
                show: true,
                position: "right",
                color: "#303133",
                fontWeight: "bold",
                formatter: (p) => {
                  const pct = total ? Math.round((p.value / total) * 100) : 0;
                  return `${this.formatNumber(p.value)}  (${pct}%)`;
                },
              },
              animationDuration: 1200,
            },
          ],
        },
        true
      );
      this.resize();
    },
  },
};
</script>

<style lang="scss" scoped>
.sd-wrap {
  padding: 16px;
  background: #f0f2f5;
}

/* Header */
.sd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}
.sd-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.sd-header-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #eef2ff;
  color: #4f6ef7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.sd-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2d3d;
}
.sd-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #909399;
}
.sd-refresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #606266;
  padding: 9px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.sd-refresh:hover {
  color: #4f6ef7;
  border-color: #4f6ef7;
}
.sd-refresh.is-loading .fa-refresh {
  animation: sd-spin 0.8s linear infinite;
}
@keyframes sd-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Body layout */
.sd-body {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 1.2fr;
  gap: 16px;
  align-items: start;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
@media (max-width: 992px) {
  .sd-body {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.sd-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.sd-card {
  position: relative;
  border-radius: 12px;
  padding: 16px 18px;
  color: #fff;
  min-height: 96px;
  overflow: hidden;
}
.sd-card--all {
  background: #3b82f6;
}
.sd-card.is-clickable {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.sd-card.is-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
.sd-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.sd-card-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}
.sd-card-badge {
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 20px;
  padding: 2px 10px;
  white-space: nowrap;
}
.sd-card-value {
  font-size: 30px;
  font-weight: 700;
  margin-top: 10px;
}
.sd-card-link {
  position: absolute;
  right: 16px;
  bottom: 14px;
  font-size: 12px;
  opacity: 0.95;
}

/* Chart */
.sd-chart {
  min-width: 0;
}
.sd-chart-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}
.sd-chart-canvas {
  width: 100%;
  min-height: 300px;
}
</style>
