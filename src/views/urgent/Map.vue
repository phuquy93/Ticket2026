<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="Vị trí giao nhận"
    width="70%"
    :before-close="handleClose"
    append-to-body
  >
    <div v-loading="loading" style="min-height: 500px">
      <div v-if="trackingKey" class="map-wrapper">
        <iframe
          :src="mapSrc"
          width="100%"
          height="500"
          frameborder="0"
          style="border: 0"
          allowfullscreen
        ></iframe>
      </div>
      <p v-else-if="!loading" style="text-align: center; padding: 20px">
        Không có dữ liệu vị trí giao nhận.
      </p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">Đóng</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from "@/utils/fetch";
export default {
  name: "MapPopup",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    pbn: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      trackingKey: null,
      loading: false,
    };
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
    mapSrc() {
      return `https://navigator.service.dienmaycholon.vn/tracking?id=${this.trackingKey}`;
    },
  },
  watch: {
    visible(val) {
      if (val && this.pbn) {
        this.getKey();
      }
    },
  },
  methods: {
    async getKey() {
      this.loading = true;
      try {
        const res = await request({
          url: `/restful/getkeysalereceipt?pbn=${this.pbn}`,
          method: "get",
        });
        if (res && res.status === 200) {
          this.trackingKey = res.data ?? res.result ?? null;
        }
      } finally {
        this.loading = false;
      }
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  line-height: 0;
}
</style>
