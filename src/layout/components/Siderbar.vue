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
                }}</router-link
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
export default {
  name: "Sidebar",
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
