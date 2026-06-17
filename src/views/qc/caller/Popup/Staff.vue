<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <el-input
          v-model="search"
          placeholder="Tìm kiếm theo tên hoặc mã NV"
        ></el-input>
      </el-col>
    </el-row>
    <el-table
      :data="paginationslice(lists, 10, page)"
      style="
        width: 100%;
        max-height: 500px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        overflow-y: auto;
      "
    >
      <el-table-column label="Chi nhánh">
        <template slot-scope="scope">
          {{ scope.row.SiteName }} - {{ scope.row.SiteId }}
        </template>
      </el-table-column>
      <el-table-column
        prop="DepartMentName"
        label="Phòng ban"
      ></el-table-column>
      <el-table-column prop="DepartMentName" label="Chức vụ"> </el-table-column>
      <el-table-column prop="FullName" label="Tên"></el-table-column>
      <el-table-column prop="EmployeeId" label="Mã NV"></el-table-column>
      <el-table-column label="Chọn" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="choose(scope.row)">
            Chọn
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page.sync="page"
      :page-size="10"
      :pager-count="11"
      layout="total,prev, pager, next"
      :total="lists.length"
      @current-change="handlePage"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
      lists_bk: [],
      page: 1,
      search: "",
      timer: null,
    };
  },
  props: ["code_store"],
  watch: {
    search() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.handleSearch();
      }, 500);
    },
  },
  async created() {
    const res = await fetch(
      `http://apitk.stdmcl.com:8099/restful/getdanhsachnhanvien?code_store=${this.code_store}`
    );

    const json = await res.json();

    if (json.status === 200) {
      this.lists = json.data;
      this.lists_bk = json.data;
    }
  },
  methods: {
    handleSearch() {
      this.page = 1;
      const query = this.search.toLowerCase().trim();
      if (!query) {
        this.lists = this.lists_bk;
      } else {
        this.lists = this.lists_bk.filter(
          (item) =>
            item.FullName.toLowerCase().includes(query) ||
            item.EmployeeId.toLowerCase().includes(query)
        );
      }
    },
    handlePage(page) {
      this.page = page;
    },
    choose(data) {
      this.$emit("choose", data);
    },
    paginationslice(data, pagesize, page) {
      return data.filter((value, n) => {
        return n >= pagesize * (page - 1) && n < pagesize * page;
      });
    },
  },
};
</script>
