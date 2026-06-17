<template>
  <el-dialog
    :visible.sync="delivery.dialogDelivery"
    title="Khu vực giao hàng"
    :before-close="handleClose"
  >
    <div class="delivery">
      <div class="content">
        <b>Kho:</b> {{ delivery.detail.name }} ({{ delivery.detail.code }})
      </div>
      <div class="content" v-if="delivery.detail.length">
        <b>Chiều dài:</b> {{ delivery.detail.length }}m2
      </div>
      <div class="content" v-if="delivery.detail.width">
        <b>Chiều rộng:</b> {{ delivery.detail.width }}m2
      </div>
      <div class="content" v-if="delivery.detail.area">
        <b>Diện tích:</b> {{ delivery.detail.area }}m2
      </div>
      <div class="content" v-if="delivery.detail.multi_picture">
        <b style="margin-right: 5px">Hình ảnh:</b>
        <div>
          <vue-picture-swipe
            id="picturedelivery"
            :items="
              listImages(
                delivery.detail.multi_picture
                  ? JSON.parse(delivery.detail.multi_picture)
                  : []
              )
            "
          />
        </div>
      </div>
    </div>
    <div class="delivery">
      <div class="content" style="width: 50%">
        <b>Nơi giao hàng trực tiếp:</b><br />
        <div style="margin-top: 10px" v-if="loading_stores">Loading...</div>
        <vue-multi-select
          v-else
          :btnLabel="
            (values) =>
              values.length > 0
                ? `Đã chọn (${values.length}) chi nhánh`
                : 'Tùy chọn'
          "
          style="margin-top: 10px"
          v-model="value1"
          search
          :filters="filters"
          :options="options"
          :selectOptions="stores"
        />
        <el-button
          type="primary"
          icon="el-icon-box"
          style="margin-top: 10px"
          size="small"
          v-if="!loading_stores"
          @click="saveStore(1)"
          >Lưu thay đổi</el-button
        >
      </div>
      <div class="content" style="width: 50%">
        <b>Chứa hàng để rút nội bộ:</b><br />
        <div style="margin-top: 10px" v-if="loading_stores">Loading...</div>
        <vue-multi-select
          v-else
          :btnLabel="
            (values) =>
              values.length > 0
                ? `Đã chọn (${values.length}) chi nhánh`
                : 'Tùy chọn'
          "
          style="margin-top: 10px"
          v-model="value2"
          search
          :filters="filters"
          :options="options"
          :selectOptions="stores"
        />
        <el-button
          type="primary"
          icon="el-icon-box"
          style="margin-top: 10px"
          size="small"
          v-if="!loading_stores"
          @click="saveStore(2)"
          >Lưu thay đổi</el-button
        >
      </div>
    </div>
    <div style="text-align: right; margin-top: 10px">
      <el-button icon="el-icon-close" @click="handleClose">Đóng</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from "@/utils/fetch";
import vueMultiSelect from "vue-multi-select";
import "vue-multi-select/dist/lib/vue-multi-select.css";
import { Message } from "element-ui";

export default {
  props: ["delivery"],
  data() {
    return {
      value1: [],
      value2: [],

      stores: [],
      loading_stores: false,

      name: "first group",
      filters: [
        {
          nameAll: "Chọn tất cả",
          nameNotAll: "Bỏ tất cả",
          func() {
            return true;
          },
        },
      ],
      options: {
        multi: true,
        labelName: "label",
        valueName: "value",
        cssSelected: (option) =>
          option.selected ? { "background-color": "#00BCD4" } : "",
      },
    };
  },
  components: {
    vueMultiSelect,
  },
  async created() {
    this.loading_stores = true;
    let res = await request({
      url: "/restful/liststore?limit=9999",
      method: "get",
    });
    if (res.status === 200) {
      this.stores = res.data.data.map((a) => {
        return {
          label: a.name + " (" + a.code + ")",
          value: a.id,
        };
      });
      let res2 = await request({
        url: "/restful/liststoremulti?",
        method: "get",
      });
      if (res2.status === 200) {
        const storeData = res2.data.data;
        this.value1 = this.stores.filter((store) =>
          storeData.some(
            (item) =>
              item.type === 1 &&
              item.cid_child === store.value &&
              item.cid_parent === this.delivery.detail.id
          )
        );
        this.value2 = this.stores.filter((store) =>
          storeData.some(
            (item) =>
              item.type === 2 &&
              item.cid_child === store.value &&
              item.cid_parent === this.delivery.detail.id
          )
        );
      }
    }
    this.loading_stores = false;
  },
  methods: {
    handleClose() {
      this.$emit("closePopup");
    },
    listImages(data) {
      const arr = [];
      data.forEach((a) => {
        arr.push({
          src:
            "http://api.dienmaycholontest.site:8090/uploads/store/" +
            this.delivery.detail.id +
            "/" +
            a +
            ".png.webp",
          thumbnail:
            "http://api.dienmaycholontest.site:8090/uploads/store/" +
            this.delivery.detail.id +
            "/" +
            a +
            ".png.webp",
          w: 1500,
          h: 1300,
          title: "",
        });
      });
      return arr;
    },
    async saveStore(number) {
      let data = this.value1;
      let type = 1;
      let cid_child = data.map((item) => item.value).join(",");
      if (number === 2) {
        data = this.value2;
        type = 2;
        cid_child = data.map((item) => item.value).join(",");
      }
      if (!!data.length) {
        this.loading_stores = true;

        const formdata = new FormData();
        formdata.append("cid_parent", this.delivery.detail.id);
        formdata.append("cid_child", cid_child);
        formdata.append("type", type);
        formdata.append("status", "1");

        let { status } = await request({
          url: "/restful/addstoremulti?",
          method: "post",
          data: formdata,
        });
        if (status === 200) {
          Message({
            message: "Xác nhận thành công",
            type: "success",
            duration: 5 * 1000,
          });
        }
        this.loading_stores = false;
      }
    },
  },
};
</script>


<style scoped>
.delivery {
  display: flex;
  flex-wrap: wrap;
}
.delivery .content {
  width: calc(100% / 4);
  padding: 10px;
}
</style>

<style>
#picturedelivery .gallery-thumbnail img {
  width: 80px !important;
}
.el-select-dropdown.el-popper.is-multiple.custom-header {
  z-index: 999999 !important;
}
.el-message {
  z-index: 9999999 !important;
}
</style>
