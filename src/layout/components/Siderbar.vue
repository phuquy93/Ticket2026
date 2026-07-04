<template>
  <div class="sidebar-inner">
    <div class="bg_overflow" @click.prevent="handleMenu" />
    <div class="sidebar-container">
      <el-menu
        :collapse="iscollapse"
        class="el-menu-vertical-demo"
        theme="light"
        :default-active="defaultBar"
      >
        <template
          v-for="(item, index) in siderBars.filter((a) => a.alwaysShow)"
        >
          <template v-if="item.children && item.children.length > 1">
            <el-submenu :key="index" :index="item.path">
              <template slot="title"
                ><i :class="item.meta.icon" aria-hidden="true" />{{
                  item.meta.title
                }}</template
              >
              <el-menu-item
                v-for="(subItem, i) in returnChildren(item.children)"
                :key="i"
                :index="subItem.path"
                ><router-link :to="subItem.path">{{
                  subItem.meta.title
                }}</router-link></el-menu-item
              >
            </el-submenu>
          </template>

          <template
            v-else-if="
              item.children && item.children.length === 1 && rolesOther(item)
            "
          >
            <el-menu-item :key="index" :index="item.path">
              <router-link :to="item.path">
                <i :class="item.meta.icon" aria-hidden="true" />{{
                  item.meta.title
                }}<span v-if="getNoti(item.path)" class="menu-noti-badge">{{
                  getNoti(item.path)
                }}</span></router-link
              >
            </el-menu-item>
          </template>
        </template>
      </el-menu>
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
  "/manage/dashboardqc": { type: 2, doitra: 1 },
  "/manage/dashboardcall": { type: 2, doitra: 2 },
  "/manage/dashboardinfo": { type: 2, doitra: 3 },
  "/manage/dashboardviolate": { type: 6 },
  "/manage/dashboardonline": { type: 5 },
  "/manage/dashboardsupplies": { type: 3 },
  "/manage/dashboardurgent": { type: 4 },
};

export default {
  name: "Sidebar",
  data() {
    return {
      notiData: [],
      notiTimer: null,
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
    iscollapse() {
      return this.$store.state.settings.isCollapse;
    },
    siderBars() {
      return constantRoutes;
    },
    defaultBar() {
      if (!!this.findParentRoute()) {
        return this.findParentRoute().pathparent;
      }
      if (this.$route.params.id) {
        return this.$route.fullPath.replace("/" + this.$route.params.id, "");
      }
      return this.$route.path;
    },

    user() {
      return this.$store.state.user.user;
    },
  },
  methods: {
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

<style scoped>
/* Neo badge theo từng dòng menu */
.sidebar-container >>> .el-menu-item {
  position: relative;
}

/* Giữ chữ menu trên 1 dòng, chừa chỗ bên phải cho badge */
.sidebar-container >>> .el-menu-item a {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 44px;
}

.menu-noti-badge {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background-color: #f56c6c;
  border-radius: 10px;
  box-sizing: border-box;
}
</style>
