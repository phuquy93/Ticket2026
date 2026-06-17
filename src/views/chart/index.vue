<template>
  <div class="app-container">
    <div>
      <el-button
        type="danger"
        @click="isMonth = 1"
        :class="{ active: isMonth === 1 }"
      >
        Biểu đồ theo tháng
      </el-button>
      <el-button
        type="warning"
        @click="isMonth = 2"
        :class="{ active: isMonth === 2 }"
      >
        Biểu đồ theo ngày
      </el-button>
       <el-button
        type="success"
        @click="isMonth = 3"
        :class="{ active: isMonth === 3 }"
      >
        Biểu đồ tổng hợp
      </el-button>
       <el-button
        type="primary"
        @click="isMonth = 4"
        :class="{ active: isMonth === 4 }"
      >
        Biểu đồ loại
      </el-button>
    </div>
    <Month v-if="isMonth === 1" />
    <Day v-else-if="isMonth === 2" />
    <Total v-else-if="isMonth === 3" />
    <Type v-else />
  </div>
</template>

<script>
import Month from "./month.vue";
import Day from "./day.vue";
import Total from "./Total.vue";
import Type from "./type.vue";

export default {
  components: { Month, Day,Total, Type },
  data() {
    return {
      isMonth: 1,
    };
  },
};
</script>

<style scoped>
.el-button {
  position: relative;
}
.el-button.active::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: greenyellow;
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>
