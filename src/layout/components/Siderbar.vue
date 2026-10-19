<template>
  <div class="sidebar-inner">
    <div class="bg_overflow" @click.prevent="handleMenu" />
    <div class="sidebar-container app-sidebar">
      <div class="app-brand">
        <div class="brand-row">
          <router-link to="/" title="Trang chủ">
            <img
              class="logo-img"
              src="http://180.16.1.133:8080/js/app_serial_system/img/logo.png"
              alt="Điện Máy Chợ Lớn"
            />
          </router-link>
          <span class="brand-mark" aria-hidden="true">D</span>
          <button
            class="rail-btn"
            type="button"
            :title="railCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'"
            @click="toggleRail"
          >
            <i class="fas fa-chevron-left" aria-hidden="true" />
          </button>
        </div>
        <span class="portal-pill"><span class="dot" /> Cổng Ticket</span>
      </div>

      <nav class="app-nav">
        <template v-for="group in menuGroups">
          <button
            :key="group.key + '-head'"
            type="button"
            class="app-nav-group"
            :class="{ collapsed: !isOpen(group) }"
            :aria-expanded="isOpen(group) ? 'true' : 'false'"
            @click="toggleGroup(group.key)"
          >
            <span>{{ group.label }}</span>
            <em v-if="group.noti && !isOpen(group)" class="menu-noti-badge">{{
              group.noti
            }}</em>
            <i class="fas fa-chevron-down nav-chev" aria-hidden="true" />
          </button>
          <div
            :key="group.key + '-items'"
            class="app-nav-items"
            :class="{ 'is-closed': !isOpen(group) }"
          >
            <router-link
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              :title="item.title"
              :class="{ 'is-active': item.path === activePath }"
            >
              <i :class="item.icon" aria-hidden="true" />
              <span>{{ item.title }}</span>
              <em v-if="item.noti" class="menu-noti-badge">{{ item.noti }}</em>
            </router-link>
          </div>
        </template>
      </nav>

      <div class="app-user">
        <router-link to="/profile" class="who-link" title="Thông tin tài khoản">
          <span class="avatar">{{ initials }}</span>
          <span class="who">
            <b>{{ fullname }}</b>
            <span>{{ isAdmin ? "Quản trị viên" : "Nhân viên" }}</span>
          </span>
        </router-link>
        <router-link
          to="/profile"
          class="user-action"
          :class="{ 'is-active': $route.path === '/profile' }"
          title="Profile"
        >
          <i class="fas fa-user-cog" aria-hidden="true" />
        </router-link>
        <a href="#" class="user-action" title="Thoát" @click.prevent="logout">
          <i class="fas fa-sign-out-alt" aria-hidden="true" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { constantRoutes } from "@/router";
import { getCountTicketXuly } from "@/api/ticket";

// Map từng menu (theo path) -> loại ticket tương ứng trên API countticketxuly
// qua zalo: type 0 | camera: type 1 | đổi trả: type 2 doitra 1 | AI: type 2 doitra 2
// google: type 2 doitra 3 | GH ko thành công: type 6 | online: type 5
// vật tư: type 3 | cuộc gọi khẩn: type 4
const NOTI_CONFIG = {
  "/manage/dashboard": { type: 0 },
  "/manage/dashboard-nhanvien": { type: 1 },
  "/manage/dashboardinstall": { type: 7 },
  "/manage/dashboardqc": { type: 2, doitra: 1 },
  "/manage/dashboardcall": { type: 2, doitra: 2 },
  "/manage/dashboardinfo": { type: 2, doitra: 3 },
  "/manage/dashboardviolate": { type: 6 },
  "/manage/dashboardonline": { type: 5 },
  "/manage/dashboardsupplies": { type: 3 },
  "/manage/dashboardurgent": { type: 4 },
};

// Nhóm menu sidebar (theo path của route cha trong router). Route alwaysShow
// nào không nằm trong nhóm nào sẽ rơi vào nhóm "Khác" để không mất link.
const GROUPS = [
  { key: "overview", label: "Tổng quan", paths: ["/manage/chart"] },
  {
    key: "ticket",
    label: "Ticket",
    paths: [
      "/manage/dashboard",
      "/manage/dashboard-nhanvien",
      "/manage/dashboardinstall",
      "/manage/dashboardqc",
      "/manage/dashboardcall",
      "/manage/dashboardinfo",
      "/manage/dashboardviolate",
      "/manage/dashboardonline",
      "/manage/dashboardsupplies",
      "/manage/dashboardurgent",
    ],
  },
  { key: "report", label: "Báo cáo", paths: ["/manage/record"] },
  {
    key: "admin",
    label: "Quản trị",
    paths: [
      "/manage/store",
      "/manage/user",
      "/manage/userqc",
      "/manage/department",
      "/manage/rate",
    ],
  },
];

// Icon riêng cho từng mục (route trong router đang dùng chung fa-align-left)
const ICONS = {
  "/manage/chart": "fas fa-chart-bar",
  "/manage/dashboard": "fas fa-comment-dots",
  "/manage/dashboard-nhanvien": "fas fa-video",
  "/manage/dashboardinstall": "fas fa-tools",
  "/manage/dashboardqc": "fas fa-exchange-alt",
  "/manage/dashboardcall": "fas fa-robot",
  "/manage/dashboardinfo": "fas fa-info-circle",
  "/manage/dashboardviolate": "fas fa-truck",
  "/manage/dashboardonline": "fas fa-globe-asia",
  "/manage/dashboardsupplies": "fas fa-boxes",
  "/manage/dashboardurgent": "fas fa-phone-volume",
  "/manage/store": "fas fa-store",
  "/manage/user": "fas fa-user",
  "/manage/userqc": "fas fa-user-shield",
  "/manage/department": "fas fa-sitemap",
  "/manage/rate": "fas fa-star",
};

const STORAGE_KEY = "Ticket-Sidebar-Groups";

export default {
  name: "Sidebar",
  data() {
    return {
      notiData: [],
      notiTimer: null,
      groupState: this.loadGroupState(),
    };
  },
  created() {
    this.fetchNoti();
    // Cứ mỗi 1 tiếng tự động gọi lại API và cập nhật số lượng
    this.notiTimer = setInterval(this.fetchNoti, 60 * 60 * 1000);
  },
  beforeDestroy() {
    if (this.notiTimer) {
      clearInterval(this.notiTimer);
      this.notiTimer = null;
    }
  },
  computed: {
    railCollapsed() {
      return this.$store.state.settings.sidebar.opened;
    },
    user() {
      return this.$store.state.user.user || [];
    },
    userField() {
      return (key) => {
        const found = this.user.find((a) => a.split("=")[0] === key);
        return found ? found.split("=")[1] : "";
      };
    },
    fullname() {
      return this.userField("data") || "Tài khoản";
    },
    initials() {
      const words = this.fullname.trim().split(/\s+/);
      const first = words[0] ? words[0][0] : "?";
      const last = words.length > 1 ? words[words.length - 1][0] : "";
      return (first + last).toUpperCase();
    },
    isAdmin() {
      return Number(this.userField("rule")) === 1;
    },
    activePath() {
      const parent = this.findParentRoute();
      if (parent && parent.pathparent) {
        return parent.pathparent;
      }
      if (this.$route.params.id) {
        return this.$route.fullPath.replace("/" + this.$route.params.id, "");
      }
      return this.$route.path;
    },
    menuGroups() {
      const routes = constantRoutes.filter((a) => a.alwaysShow);
      const used = new Set();
      const build = (route) => {
        if (route.children && route.children.length > 1) {
          return this.returnChildren(route.children).map((c) => ({
            path: c.path,
            title: c.meta.title,
            icon: ICONS[c.path] || "fas fa-file-alt",
          }));
        }
        if (
          route.children &&
          route.children.length === 1 &&
          this.rolesOther(route)
        ) {
          return [
            {
              path: route.path,
              title: route.meta.title,
              icon: ICONS[route.path] || route.meta.icon,
            },
          ];
        }
        return [];
      };

      const groups = GROUPS.map((g) => {
        const items = [];
        g.paths.forEach((p) => {
          const route = routes.find((r) => r.path === p);
          if (!route) return;
          used.add(route);
          items.push(...build(route));
        });
        return { key: g.key, label: g.label, items };
      });

      const others = routes.filter((r) => !used.has(r));
      if (others.length) {
        groups.push({
          key: "other",
          label: "Khác",
          items: others.reduce((acc, r) => acc.concat(build(r)), []),
        });
      }

      return groups
        .filter((g) => g.items.length)
        .map((g) => {
          g.items.forEach((it) => {
            it.noti = this.getNoti(it.path);
          });
          g.noti = g.items.reduce((sum, it) => sum + it.noti, 0);
          return g;
        });
    },
    currentGroupKey() {
      const g = this.menuGroups.find((grp) =>
        grp.items.some((it) => it.path === this.activePath)
      );
      return g ? g.key : null;
    },
  },
  watch: {
    // Chuyển trang thì bung nhóm chứa trang đó (nếu người dùng đã đóng trước đó)
    currentGroupKey(key) {
      if (key && this.groupState[key] === false) {
        this.toggleGroup(key);
      }
    },
  },
  methods: {
    loadGroupState() {
      try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
      } catch (e) {
        return {};
      }
    },
    isOpen(group) {
      if (group.key in this.groupState) return this.groupState[group.key];
      // Mặc định: mở nhóm chứa trang đang xem, nhóm Ticket luôn mở
      return group.key === this.currentGroupKey || group.key === "ticket";
    },
    toggleGroup(key) {
      const group = this.menuGroups.find((g) => g.key === key);
      this.groupState = { ...this.groupState, [key]: !this.isOpen(group) };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.groupState));
      } catch (e) {
        // bỏ qua khi trình duyệt chặn storage
      }
    },
    toggleRail() {
      this.$store.dispatch("settings/changeIscollapse", !this.railCollapsed);
    },
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$store.dispatch("tabhistory/resetState");
      });
    },
    async fetchNoti() {
      try {
        const res = await getCountTicketXuly();
        if (res && res.status === 200 && Array.isArray(res.data)) {
          this.notiData = res.data;
        }
      } catch (e) {
        // im lặng, giữ lại data cũ nếu gọi lỗi
      }
    },
    getNoti(path) {
      const cfg = NOTI_CONFIG[path];
      if (!cfg) return 0;
      const found = this.notiData.find(
        (a) =>
          Number(a.type) === cfg.type &&
          (cfg.doitra === undefined || Number(a.doitra) === cfg.doitra)
      );
      return found ? Number(found.count_ticket) : 0;
    },
    findParentRoute() {
      const currentPath = this.$route.path;
      for (const parent of constantRoutes) {
        if (parent.children && parent.children.length) {
          const found = parent.children.find(
            (child) => child.path === currentPath
          );
          if (found) {
            return parent;
          }
        }
      }
      return null;
    },
    handleMenu() {
      this.$store.dispatch("settings/changeIscollapse", false);
    },
    returnChildren(data) {
      return data.filter((a) =>
        a.meta.roles.find(
          (b) =>
            Number(b) ===
            Number(
              this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
            )
        )
      );
    },
    rolesOther(data) {
      if (
        data.meta.not_show?.find(
          (b) =>
            Number(b) ===
            Number(
              this.user.find((a) => a.split("=")[0] === "dataid")?.split("=")[1]
            )
        )
      ) {
        return false;
      }
      if (data.meta.showid) {
        if (
          this.user.find((a) => a.split("=")[0] === "dataid").split("=")[1] ==
          255
        ) {
          return true;
        }
      }

      return data.children[0].meta.roles.find(
        (elm) =>
          elm == this.user.find((a) => a.split("=")[0] == "rule").split("=")[1]
      );
    },
  },
};
</script>
