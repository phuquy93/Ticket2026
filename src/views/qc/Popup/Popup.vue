<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Chi tiết"
      :before-close="handleClose"
    >
      <div id="printMe" class="detailprint" style="font-size: 16px">
        <div v-if="!is_loading" class="box-detail">
          <div class="box" style="width: calc(100% / 4)">
            <h3 style="width: 100%">ID</h3>
            <p>{{ detail.id }}</p>
          </div>
          <div class="box" style="width: calc(100% / 4)">
            <h3 style="width: 100%">Tên KH</h3>
            <p>{{ detail.name }}</p>
          </div>
          <div class="box" style="width: calc(100% / 4)">
            <h3 style="width: 100%">PBN</h3>
            <p>{{ detail.pbn }}</p>
          </div>
          <div class="box" style="width: calc(100% / 4)">
            <h3 style="width: 100%">Chi nhánh</h3>
            <p>{{ detail.code_store }} - {{ detail.store_name }}</p>
          </div>
          <div class="box">
            <h3>Ngày tạo phiếu biên nhận</h3>
            <p v-if="detail.ngaytaophieu != null && detail.ngaytaophieu !== ''">
              {{ detail.ngaytaophieu | moment("DD/MM/YYYY HH:mm:ss") }}
            </p>
            <p v-else>---</p>
          </div>
          <div class="box">
            <h3>Ngày giao hàng</h3>
            <p v-if="detail.ngaygiaohang != null && detail.ngaygiaohang !== ''">
              {{ detail.ngaygiaohang | moment("DD/MM/YYYY HH:mm:ss") }}
            </p>
            <p v-else>---</p>
          </div>
          <div class="box" style="width: 100%">
            <h3>Ngày QC kiểm tra</h3>
            <p>{{ detail.date_cre | moment("DD/MM/YYYY") }}</p>
          </div>
          <div class="box">
            <h3>Mã NV bán hàng</h3>
            <p>{{ detail.mnvbh }}</p>
          </div>

          <div class="box">
            <h3>Tên NV bán hàng</h3>
            <p>{{ detail.tnvbh }}</p>
          </div>
          <template v-for="(n, i) in detail.nvgn">
            <div class="box" :key="n.MaNhanVien + i">
              <h3>Mã NV giao nhận</h3>
              <p>{{ n.MaNhanVien }}</p>
            </div>
            <div class="box" :key="n.MaNhanVien">
              <h3>Tên NV giao nhận</h3>
              <p>
                {{ n.TenNhanVien }}
              </p>
            </div>
          </template>
          <div class="box">
            <h3>Nhân viên điều</h3>

            <p>
              {{ detail.NhanVienDieu }}
            </p>
          </div>
          <div class="box" v-if="!!detail.nguoi_goi">
            <h3>Người gọi</h3>
            <p>{{ detail.nguoi_goi }}</p>
          </div>
          <div class="box">
            <h3>Trạng thái</h3>
            <p>{{ ruleApproved(detail.approved) }}</p>
          </div>

          <div class="box">
            <h3>Thời gian xử lý</h3>
            <p v-if="detail.time_handle !== null && detail.time_handle !== ''">
              {{ detail.time_handle | moment("DD/MM/YYYY HH:mm:ss") }}
            </p>
            <p v-else>---</p>
          </div>
          <div class="box">
            <h3>Tên user tạo ticket</h3>
            <p
              v-if="
                detail.name_user_create &&
                detail.name_user_create !== null &&
                detail.name_user_create !== ''
              "
            >
              {{ detail.name_user_create }}
            </p>
            <p v-else>---</p>
          </div>
          <div class="box">
            <h3>Tên QL xử lý</h3>
            <p
              v-if="
                detail.name_user &&
                detail.name_user !== null &&
                detail.name_user !== ''
              "
            >
              {{ detail.name_user }}
            </p>
            <p v-else>---</p>
          </div>

          <div class="box">
            <h3>Nội dung</h3>
            <p
              v-if="
                detail.description &&
                detail.description !== null &&
                detail.description !== ''
              "
              style="word-break: break-word"
            >
              {{ detail.description }}
            </p>
            <p v-else>---</p>
          </div>
          <div class="box">
            <h3>SDT</h3>

            <div style="display: flex">
              <el-input v-model="phone" placeholder="Please input" />

              <span
                v-if="
                  (detail.approved === 9 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 7 &&
                    detail.phieudoitra !== 'Chất lượng cuộc gọi') ||
                  (detail.approved === 9 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1) ||
                  (detail.approved === 5 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1 &&
                    detail.phieudoitra === 'info') ||
                  (detail.approved === 5 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 2 &&
                    detail.phieudoitra === 'info') ||
                  (detail.approved === 5 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 7 &&
                    detail.phieudoitra === 'info') ||
                  (detail.approved === 0 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1 &&
                    detail.phieudoitra === 'info') ||
                  (detail.approved === 0 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 2 &&
                    detail.phieudoitra === 'info') ||
                  (detail.approved === 0 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 7 &&
                    detail.phieudoitra === 'info')
                "
                style="width: 100%; display: inline-block"
              >
                <el-button
                  v-loading="loading"
                  type="success"
                  icon="el-icon-phone"
                  style="font-size: 16px; width: 200px"
                  @click="handleCall(userCall)"
                  >Gọi KH</el-button
                >
              </span>
            </div>
          </div>
          <div class="box">
            <h3>
              Phòng hành chánh <br />
              yêu cầu
            </h3>
            <p
              style="width: 100%; display: flex"
              v-if="
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1
              "
            >
              <el-input
                v-model="note_bgd"
                type="textarea"
                placeholder="Please input"
              />
              <el-button
                v-loading="loading"
                type="warning"
                style="font-size: 16px; width: 200px"
                @click="savenote_bgd(note_bgd)"
                >Lưu</el-button
              >
            </p>
            <p v-else>{{ note_bgd }}</p>
          </div>
          <div class="box">
            <h3>Nội dung giải trình</h3>

            <p
              v-if="
                (detail.approved === 0 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 2) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 2) ||
                (detail.approved === 0 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1)
              "
              style="width: 100%"
            >
              <el-input
                v-model="note_user"
                type="textarea"
                placeholder="Please input"
              />
            </p>
            <p v-else>
              <span
                v-if="
                  detail.flag_content !== null && detail.flag_content.note_user
                "
                >{{ detail.flag_content.note_user }}</span
              >
            </p>
          </div>

          <div class="box" v-if="checkcallercaller()">
            <h3>Nội dung QC đánh giá</h3>

            <p
              v-if="
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 7 ||
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1
              "
              style="width: 100%"
            >
              <el-input
                v-model="personnel_note"
                type="textarea"
                placeholder="Please input"
              />
              <el-button
                type="success"
                icon="el-icon-save"
                :loading="loading"
                style="margin-top: 5px"
                @click="saveQcdanhgia"
                >Lưu</el-button
              >
            </p>
            <p v-else>
              <span
                v-if="
                  detail.flag_content !== null &&
                  detail.flag_content.personnel_note
                "
                >{{ detail.flag_content.personnel_note }}</span
              >
            </p>
          </div>
          <div class="box" v-else>
            <h3>Nội dung QC đánh giá</h3>

            <p
              v-if="
                (detail.approved === 9 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 7) ||
                (detail.approved === 9 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1)
              "
              style="width: 100%"
            >
              <el-input
                v-model="personnel_note"
                type="textarea"
                placeholder="Please input"
              />
            </p>
            <p v-else>
              <span
                v-if="
                  detail.flag_content !== null &&
                  detail.flag_content.personnel_note
                "
                >{{ detail.flag_content.personnel_note }}</span
              >
            </p>
          </div>

          <div class="box" style="display: block">
            <h3>
              Mã NV vi phạm

              <el-button
                v-if="
                  (detail.approved === 0 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 2) ||
                  (detail.approved === 5 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 2) ||
                  (detail.approved === 0 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1) ||
                  (detail.approved === 5 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1)
                "
                type="primary"
                style="width: 100px; margin-left: 10px"
                @click="addPersonnel"
                >Add</el-button
              >
            </h3>

            <div
              v-if="
                (detail.approved === 0 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 2) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 2) ||
                (detail.approved === 0 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1)
              "
            >
              <div style="display: flex">
                <el-input
                  v-model="personnel_name"
                  placeholder="Please input"
                  @input.native="changeMnv"
                />
                <el-button
                  v-loading="loading"
                  type="primary"
                  style="width: 100px"
                  @click="loadMnv(personnel_name.trim())"
                  >Load</el-button
                >
              </div>
              <strong v-if="mnv !== null" style="font-size: 14px"
                >(Tên: {{ mnv.FullName }}, Phòng ban: {{ mnv.DepartMentName }},
                Chức vụ: {{ mnv.TenChucDanh }}, Chi nhánh: {{ mnv.SiteName }} -
                {{ mnv.SiteId }})</strong
              >
              <template v-for="(a, i) in personnel">
                <div
                  :key="i + Math.random()"
                  style="display: flex; margin-top: 10px"
                >
                  <el-input
                    :id="'personnel' + i"
                    v-model="a.manv"
                    placeholder="Please input"
                    @input.native="updateArrayData($event, i)"
                  />
                  <el-button
                    v-loading="loading"
                    type="primary"
                    style="width: 100px"
                    @click="loadMnv(a.manv.trim(), i + 1)"
                    >Load</el-button
                  >
                </div>
                <strong
                  v-if="a.desc !== ''"
                  :key="i + Math.random()"
                  style="font-size: 14px"
                  >(Tên: {{ a.desc.FullName }}, Phòng ban:
                  {{ a.desc.DepartMentName }}, Chức vụ:
                  {{ a.desc.TenChucDanh }}, Chi nhánh: {{ a.desc.SiteName }} -
                  {{ a.desc.SiteId }})</strong
                >
              </template>
            </div>
            <p v-else>
              <span v-if="detail.personnel_name !== null">{{
                detail.personnel_name
              }}</span>

              <span v-if="detail.flag_index !== null && detail.flag_index.user">
                {{ detail.flag_index.user.FullName }} ({{
                  detail.flag_index.user.SiteId
                }}
                - {{ detail.flag_index.user.SiteName }} -
                {{ detail.flag_index.user.TenChucDanh }})</span
              >
            </p>
          </div>
          <!-- <div v-if="detail.approved !== 0" class="box">
        <h3>Hình thức xử lý</h3>

        <p
          v-if="
            (detail.approved === 3 &&
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 4) ||
            (detail.approved === 3 &&
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 1)
          "
        >
          <el-input
            v-model="note_report"
            type="textarea"
            placeholder="Please input"
          />
        </p>
        <p v-else>
          <span v-if="detail.flag_content.note_report !== null">{{
            detail.flag_content.note_report
          }}</span>
        </p>
      </div> -->
          <!-- <div v-if="detail.approved !== 0" class="box">
        <h3>Căn cứ</h3>

        <div
          v-if="
            (detail.approved === 3 &&
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 4) ||
            (detail.approved === 3 &&
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 1)
          "
        >
          <p
            v-for="(v, i) in note_penalize"
            :key="i"
            style="display: flex; margin-bottom: 10px"
          >
            <el-input type="textarea" placeholder="Please input" />
            <el-button type="danger" style="width: 100px">Xóa</el-button>
          </p>
          <el-button
            type="primary"
            round
            @click="note_penalize.push({ value: '' })"
            >Thêm</el-button
          >
        </div>
        <p v-else>
          <span v-if="detail.flag_content.note_penalize !== null">{{
            detail.flag_content.note_penalize
          }}</span>
        </p>
      </div> -->

          <div class="box" style="color: blue">
            <h3>Số lần xử lý lại</h3>
            <p
              v-if="
                detail.flag_content !== null &&
                detail.flag_content.num_processing
              "
            >
              {{ detail.flag_content.num_processing }}
            </p>
            <p v-else>0</p>
          </div>

          <div class="box">
            <h3>Tên thẩm định</h3>
            <p v-if="detail.name_user_expertise !== ''">
              {{ detail.name_user_expertise }}
            </p>
            <p v-else>---</p>
          </div>

          <div v-if="detail.rate !== 0 && detail.rate !== null" class="box">
            <h3>Thẩm định đánh giá độ hài lòng</h3>
            <p>{{ detail.rate }}/5 sao</p>
          </div>
          <div class="box">
            <h3>Note thẩm định</h3>
            <p
              v-if="
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 3 ||
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1
              "
              style="width: 100%"
            >
              <el-input
                v-model="note_user_expertise"
                type="textarea"
                placeholder="Please input"
              />
            </p>
            <p v-else>
              <span
                v-if="
                  detail.flag_content !== null &&
                  detail.flag_content.note_user_expertise
                "
                >{{ detail.flag_content.note_user_expertise }}</span
              >
            </p>
          </div>
          <!-- <div
            v-if="
              (detail.approved !== 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) !== 3) ||
              (detail.approved !== 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) !== 1)
            "
            class="box"
          >
            <h3
              v-if="
                detail.coupon && detail.coupon !== null && detail.coupon !== ''
              "
            >
              Cách khắc phục
            </h3>
            <p>
              {{ detail.coupon }}
            </p>
          </div>
          <div
            v-if="
              (detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 3) ||
              (detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1)
            "
            class="box"
          >
            <h3>Cách khắc phục</h3>
            <p style="width: 100%">
              <el-input
                v-model="coupon"
                type="textarea"
                placeholder="Please input"
              />
            </p>
          </div> -->

          <!-- <div v-if="detail.code_store_rate !== detail.code_store" class="box">
            <h3 style="color: red">
              Hướng xử lý của chi nhánh có nhân viên vi phạm
            </h3>
            <template
              v-if="
                (detail.approved === 3 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 2) ||
                (detail.approved === 3 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1)
              "
            >
              <p style="width: 100%">
                <el-input
                  v-model="note_xu_ly_chi_nhanh"
                  type="textarea"
                  placeholder="Please input"
                />
              </p>
              <el-button
                v-loading="loading"
                type="primary"
                @click="saveNotexulychinhanh(detail.id)"
                >XÁC NHẬN XỬ LÝ</el-button
              >
            </template>
            <p v-else>{{ note_xu_ly_chi_nhanh }}</p>
          </div> -->
          <!-- <div v-if="stores" class="box">
            <h3 style="width: 100%">Chi nhánh xử lý</h3>

            <el-select
              v-model="code_store"
              filterable
              placeholder="Chọn chi nhánh"
            >
              <el-option
                v-for="rule in stores"
                :key="rule.code"
                :value="rule.code"
                :label="rule.name + ' - ' + rule.code"
              />
            </el-select>
            <el-button
              v-if="
                (detail.approved === 2 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1) ||
                (detail.approved === 2 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 3) ||
                (detail.approved === 3 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1) ||
                (detail.approved === 3 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 3) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 3)
              "
              v-loading="loading"
              type="primary"
              style="font-size: 16px"
              @click="handleSave"
              >Lưu</el-button
            >
          </div> -->
          <div class="box" :style="'width:' + (stores ? '50%' : '100%')">
            <h3 style="width: 100%">Chi nhánh nhận</h3>

            <p>{{ detail.code_store_rate }}</p>
          </div>
          <div class="box">
            <h3>Hình ảnh vi phạm</h3>

            <p>
              <template v-if="detail.multi_picture_violate !== null">
                <a
                  :href="`${url}${returnPublic()}/uploads/${
                    detail.id
                  }/${img}.png.webp`"
                  target="_blank"
                  style="margin-right: 10px"
                  v-for="img in JSON.parse(detail.multi_picture_violate)"
                  :key="img"
                >
                  <img
                    :src="`${url}${returnPublic()}/uploads/${
                      detail.id
                    }/${img}.png.webp`"
                    alt="img"
                    width="150"
                /></a>
                <!-- <vue-picture-swipe
                  :items="listImages(detail.multi_picture_violate)"
                /> -->
              </template>
            </p>
          </div>
          <div class="box">
            <h3>Hình ảnh</h3>
            <template
              v-if="
                (detail.approved === 0 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 2) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 2) ||
                (detail.approved === 0 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1) ||
                (detail.approved === 5 &&
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1)
              "
            >
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :limit="3"
                multiple
                :on-exceed="handleExceed"
                :on-change="handleChange"
                accept=".jpg, .png, .jpeg"
              >
                <i slot="default" class="el-icon-plus" />
                <div slot="fileList" slot-scope="{ fileList }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="fileList.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete">
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </div>
              </el-upload>
            </template>
          </div>
   <div class="field-group">
                <div class="field-label">Thời gian hẹn xử lý</div>
                <div
                  class="field-value"
                  v-if="
                    detail.approved === 0 ||
                    detail.approved === 5"                >
                  <el-date-picker
                    style="width: 100%"
                    v-model="thoi_gian_hen"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="Chọn thời gian hẹn"
                  />
                </div>
                <div class="field-value" v-else>
                  <span v-if="!!detail.thoi_gian_hen">{{
                    detail.thoi_gian_hen | moment("DD/MM/YYYY HH:mm:ss")
                  }}</span>
                  <span v-else>N/A</span>
                </div>
              </div>
          <div
            class="box"
            v-if="
              (detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 3) ||
              (detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1)
            "
          >
            <h3 style="color: red">Tiền phạt</h3>
            <p>
              <money
                style="
                  border: 1px solid #dcdfe6;
                  padding: 10px;
                  border-radius: 3px;
                  font-size: 14px;
                "
                v-model="tienphat"
                v-bind="{
                  decimal: '.',
                  thousands: '.',
                  prefix: '',
                  suffix: '',
                  precision: 0,
                  masked: false,
                }"
              ></money>
            </p>
          </div>
          <div class="box" v-else>
            <h3 style="color: red">Tiền phạt</h3>
            <p v-if="!!detail.tienphat">
              {{ detail.tienphat }}
            </p>
            <p v-else>---</p>
          </div>
          <!-- <div class="box" v-if="detail.mp3 !== null">
            <h3>MP3</h3>
            <p>
              <a
                target="_blank"
                style="color: blue"
                :href="process + '/uploads/' + detail.pbn + '/' + detail.mp3"
                >Link mp3</a
              >
            </p>
          </div> -->

          <div
            class="box"
            v-if="
              (detail.approved === 9 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 7) ||
              (detail.approved === 9 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 0 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 0 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 2) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 2)
            "
          >
            <h3 style="width: 100%">File ghi âm</h3>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :auto-upload="false"
              accept=".mp3"
              :on-change="handleChangeFile"
            >
              <el-button slot="trigger" size="small" type="primary"
                >Chọn file</el-button
              >
            </el-upload>
          </div>
          <template v-else>
            <div class="box" v-if="detail.mp3 !== null">
              <h3 style="width: 100%">File ghi âm</h3>
              <div>
                <audio controls>
                  <source
                    :src="`${url}${returnPublic()}/uploads/${detail.id}/${
                      detail.id
                    }_mp3.mp3`"
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
                <a
                  target="_blank"
                  style="color: blue; margin-left: 10px"
                  :href="`${url}${returnPublic()}/uploads/${detail.id}/${
                    detail.id
                  }_mp3.mp3`"
                  >Link ghi âm</a
                >
              </div>
            </div>
          </template>
          <div
            class="box"
            v-if="
              detail && detail.flag_content && detail.flag_content.link_cuoc_goi
            "
          >
            <h3 style="width: 100%">Ghi âm 1 sao</h3>
            <div style="width: 100%">
              <audio controls style="margin-bottom: 10px">
                <source
                  :src="detail.flag_content.link_cuoc_goi"
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
            <a
              target="_blank"
              style="color: blue"
              :href="
                detail &&
                detail.flag_content &&
                detail.flag_content.link_cuoc_goi
              "
              >Download ghi âm</a
            >
          </div>
          <div
            class="box"
            v-if="
              (detail.approved === 0 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 2) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 2) ||
              (detail.approved === 0 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1)
            "
          >
            <h3 style="width: 100%">File PDF</h3>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :auto-upload="false"
              accept=".pdf"
              :on-change="handleChangePdf"
            >
              <el-button slot="trigger" size="small" type="primary"
                >Chọn file</el-button
              >
            </el-upload>
          </div>
          <template v-else>
            <div class="box" v-if="detail.pdf !== null">
              <h3 style="width: 100%">File PDF</h3>
              <a
                target="_blank"
                style="color: blue"
                :href="`${url}${returnPublic()}/uploads/${detail.id}/${
                  detail.pdf
                }.pdf`"
                >Link PDF</a
              >
            </div>
          </template>

          <div class="box" style="width: 100%">
            <h3 style="display: flex; align-items: center">Record</h3>
            <p v-if="records.TotalItem > 0" style="width: 100%">
              <el-table :data="records.data" style="width: 100%">
                <el-table-column label="Name user">
                  <template slot-scope="scope">
                    {{ scope.row.name_user }}
                  </template>
                </el-table-column>
                <el-table-column label="Exten">
                  <template slot-scope="scope">
                    {{ scope.row.content.src }}
                  </template>
                </el-table-column>
                <el-table-column label="CallerIdNum">
                  <template slot-scope="scope">
                    {{ scope.row.content.dst }}
                  </template>
                </el-table-column>
                <el-table-column label="Time">
                  <template slot-scope="scope">
                    {{ scope.row.created_at }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="Option" width="400px">
                  <template slot-scope="scope">
                    <div v-if="scope.row.content.logRecord">
                      <el-button
                        style="margin: 0 10px"
                        type="primary"
                        @click="
                          handleDetail2(true, scope.row.content.logRecord)
                        "
                        >Xem chi tiết</el-button
                      >
                      <el-button
                        style="margin: 0 20px"
                        type="info"
                        icon="el-icon-download"
                        @click="downloadRecordNew(scope.row.content)"
                      />

                      <audio
                        v-if="scope.row.show"
                        type="audio/wav"
                        controls
                        autoplay
                        :src="`https://dmcl5-cskh.ccms.vn:1101/api/app/v1/playRecord?callLeg=${scope.row.listlog.cdr[0].details[0].callLeg}`"
                      ></audio>
                      <el-button
                        v-else
                        v-loading="loading_record"
                        type="success"
                        icon="el-icon-headset"
                        @click="playRecord2(scope.row)"
                      />
                    </div>
                    <div v-else>
                      <el-button
                        style="margin: 0 10px"
                        type="primary"
                        @click="handleDetail(true, scope.row.content.linkedid)"
                        >Xem chi tiết</el-button
                      >
                      <el-button
                        style="margin: 0 20px"
                        type="info"
                        icon="el-icon-download"
                        @click="downloadRecord(scope.row.content.callleg)"
                      />
                      <audio
                        v-if="scope.row.content.blobRecord !== ''"
                        :src="scope.row.content.blobRecord"
                        type="audio/wav"
                        controls
                        autoplay
                      />
                      <el-button
                        v-else
                        v-loading="loading_record"
                        type="success"
                        icon="el-icon-headset"
                        @click="playRecord(scope.row)"
                      />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </p>
            <p v-else>---</p>
          </div>
          <div class="box" v-if="detail.rate_customer !== null">
            <div v-if="checkcallercaller()">
              <h3 style="width: 100%">Số điểm đánh giá chất lượng</h3>
              <div
                v-if="
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 7 ||
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1
                "
              >
                <el-select
                  v-model="detail.rate_customer"
                  placeholder="Chọn số điểm"
                >
                  <el-option value="1" label="1" />
                  <el-option value="2" label="2" />
                  <el-option value="3" label="3" />
                  <el-option value="4" label="4" />
                  <el-option value="5" label="5" />
                </el-select>
                <el-button
                  type="success"
                  icon="el-icon-save"
                  :loading="loading"
                  style="margin-top: 5px"
                  @click="saverateCustomer"
                  >Lưu</el-button
                >
              </div>
              <b style="color: red" v-else>{{ detail.rate_customer }}</b>
            </div>
            <div v-else>
              <h3 style="width: 100%">Số điểm đánh giá chất lượng</h3>
              <b style="color: red">{{ detail.rate_customer }}</b>
            </div>
          </div>
          <div class="box" v-if="detail.email !== null">
            <h3 style="width: 100%">Email</h3>
            <b>{{ detail.email }}</b>
          </div>
          <div class="box full" style="width: 100%">
            <h3 style="width: 100%">Log</h3>
            <el-table
              v-if="log !== null"
              :data="log.data"
              border
              :class="{ hide: pagelogStatus }"
            >
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
                    v-if="
                      scope.row.content.rate && scope.row.content.rate !== null
                    "
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
                v-if="
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1] ===
                  '1'
                "
                label="Log"
              >
                <template slot-scope="scope">
                  {{ scope.row.content }}
                </template>
              </el-table-column>
            </el-table>
            <p style="width: 100%">
              <el-button
                v-if="log === null || pagelog < log.Totalpage"
                v-loading="loading"
                style="margin-top: 10px"
                type="primary"
                @click="handleLog({ id: detail.id, page: pagelog + 1 })"
                >Load
              </el-button>

              <el-button
                v-if="log !== null && pagelogStatus === false"
                v-loading="loading"
                style="margin-top: 10px"
                type="danger"
                @click="pagelogStatus = true"
                >Đóng log</el-button
              >
              <el-button
                v-if="log !== null && pagelogStatus"
                v-loading="loading"
                style="margin-top: 10px"
                type="danger"
                @click="pagelogStatus = false && log !== null"
                >Hiện log</el-button
              >
            </p>
          </div>
          <div class="box full" v-if="isTicketQc" style="display: block">
            <h3 style="width: 100%">Chi tiết biên nhận {{ detail.pbn }}</h3>
            <el-table :data="detail.saleReceiptDetailDto" border>
              <el-table-column label="Mã hàng" width="100">
                <template slot-scope="scope">
                  {{ scope.row.ItemID }}
                </template>
              </el-table-column>
              <el-table-column label="Tên hàng">
                <template slot-scope="scope">
                  {{ scope.row.ItemName }}
                </template>
              </el-table-column>
              <el-table-column label="Số lượng" width="100">
                <template slot-scope="scope">
                  {{ parseInt(scope.row.Quantity) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div
            class="box full"
            style="display: block"
            v-if="
              isTicketQc &&
              !!detail.flag_content &&
              !!detail.flag_content.ListDT
            "
          >
            <h3 style="width: 100%">
              Chi tiết đổi trả
              <span style="color: #03a9f4">{{ detail.phieudoitra }}</span>
            </h3>

            <el-table :data="Object.values(detail.flag_content.ListDT)" border>
              <el-table-column label="Mã hàng" width="100">
                <template slot-scope="scope">
                  {{ scope.row.ItemID }}
                </template>
              </el-table-column>
              <el-table-column label="Tên hàng">
                <template slot-scope="scope">
                  {{ scope.row.ItemName }}
                </template>
              </el-table-column>
              <el-table-column label="Số lượng" width="100">
                <template slot-scope="scope">
                  {{ scope.row.SoLuong }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div v-if="!is_loading" style="text-align: right; margin-top: 30px">
          <h1
            v-if="
              (disabled() &&
                detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 3) ||
              (disabled() &&
                detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1)
            "
            class="error"
            style="margin-bottom: 10px; font-size: 16px"
          >
            (Nội dung vi phạm và mã NV không có nên không thể ra biên bản)
          </h1>
          <div style="display: flex; justify-content: space-between">
            <div>
              <el-button
                v-if="
                  (detail.approved === 2 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 3) ||
                  (detail.approved === 2 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1)
                "
                v-loading="loading"
                type="primary"
                :disabled="disabled()"
                @click="handleUpdate(detail.id, 3)"
                >Đợi ra biên bản
              </el-button>
              <!-- <el-button
            v-if="
              (detail.approved === 3 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 3 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 4)
            "
            v-loading="loading"
            type="primary"
            @click="handleUpdate(detail.id, 6)"
            >Duyệt biên bản</el-button
          > -->
              <el-button
                v-if="
                  (detail.approved === 2 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 3) ||
                  (detail.approved === 2 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1)
                "
                v-loading="loading"
                type="danger"
                @click="handleUpdate(detail.id, 5)"
                >Yêu cầu xử lý lại</el-button
              >
              <el-button
                v-if="
                  (detail.approved === 0 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 2) ||
                  (detail.approved === 5 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 2) ||
                  (detail.approved === 0 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1) ||
                  (detail.approved === 5 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1)
                "
                v-loading="loading"
                type="success"
                @click="handleUpdate(detail.id, 2)"
                >Hoàn thành</el-button
              >
              <!-- <el-button
            v-if="
              detail.approved === 0 &&
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) !== 3
            "
            v-loading="loading"
            type="success"
            @click="handleUpdate(detail.id, 1)"
            >Xử lý</el-button
          > -->

              <!-- <el-button
            v-if="
              (detail.approved === 0 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 2) ||
              (detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 3) ||
              (detail.approved === 0 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 3) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 3) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 2) ||
              (detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 0 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1)
            "
            v-loading="loading"
            type="primary"
            @click="handleUpdate(detail.id, -1)"
            >Lưu</el-button
          > -->
              <el-button
                v-if="
                  (detail.approved === 9 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 7) ||
                  (detail.approved === 9 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1)
                "
                v-loading="loading"
                type="success"
                @click="handleUpdate(detail.id, 0)"
                >Giải trình</el-button
              >
              <el-button
                v-if="
                  (detail.approved === 2 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 3) ||
                  (detail.approved === 2 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1) ||
                  (detail.approved === 9 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 7) ||
                  (detail.approved === 9 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1)
                "
                v-loading="loading"
                type="danger"
                @click="handleUpdate(detail.id, 10)"
                >Hợp lệ</el-button
              >

              <!-- <el-button
                v-if="detail.approved === 3"
                v-loading="loading"
                @click="dialogVisiblePrint = true"
                type="danger"
                >Xem trước biên bản</el-button
              > -->
            </div>

            <el-button icon="el-icon-close" @click="closePopup">Đóng</el-button>
          </div>
        </div>
      </div>
      <el-button
        v-if="detail.approved === 3 && !is_loading"
        v-print="'#printMe'"
        type="danger"
        icon="el-icon-printer"
        >In</el-button
      >
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleDetail" title="Chi tiết Record">
      <DetailNew
        v-if="dialogVisibleDetail"
        :detailnew="detailnew"
        :dialogVisibleDetail="dialogVisibleDetail"
        @record-status="dialogVisibleDetail = false"
        :url="url"
      />
    </el-dialog>
  </div>
</template>

<script>
import DetailNew from "./Detailnew.vue";
import {
  updateTicket,
  updateRecord,
  getListsRecords,
  getLog,
  cloneticket,
  saveStore,
  luunotexuly,
  saveQcdanhgia,
  saverateCustomer,
} from "@/api/ticket";
import callGuard from "@/utils/callGuard";
import { Message } from "element-ui";
import { getUser } from "@/utils/auth.js";
import { getlists } from "@/api/department";
import { getlistsRate } from "@/api/rate";

let url = "";

if (window.location.host === "dmcltk.stdmcl.com:8099") {
  url = process.env.VUE_APP_BASE_API;
} else {
  url = process.env.VUE_APP_BASE_API_DEV;
}

export default {
  name: "ComponentTicketPopup",
  mixins: [callGuard],
  props: ["dialogVisible", "lists", "detail", "page", "stores"],
  components: { DetailNew },
  data() {
    return {
      dialogVisibleDetail: false,
      coupon: "",
      note_user: "",
      record: "",
      phone: "",
      note_user_expertise: "",
      rate: null,
      loading: false,
      personnel_name: "",
      personnel_note: "",
      list_rate: [],
      code_store: "",
      // note_report: "",
      note_xu_ly_chi_nhanh: "",
      fileList: [],
      files: [],
      process: url,

      processCall: process.env.VUE_APP_BASE_CALL,

      blobRecord: "",
      loading_record: false,

      records: [],

      log: null,
      pagelog: 0,
      pagelogStatus: false,

      mnv: null,

      // note_penalize: [{ value: "" }],

      listDepartment: [],
      loadingDepartment: false,
      cid_department: "",
      keytabs: "0",
      listRateDefault: [],
      listRate: [],

      is_loading: false,

      personnel: [],

      file: 0,
      pdf: 0,

      tienphat: 0,

      detailnew: null,
      url: url,

      note_bgd: "",

         thoi_gian_hen: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
    userCall() {
      return this.$store.state.user.userCall;
    },
    statusTabs() {
      if (this.list_rate.length > 0) {
        return true;
      }
      return false;
    },
    isTicketQc() {
      if (this.$route.name === "Ticketqcticket") return true;
      return false;
    },
  },
  async created() {
    this.loadingDepartment = true;
    getlists().then((res) => {
      if (res.status === 200) {
        this.listDepartment = res.data.data.filter((a) => a.status === 1);
        if (res.data.TotalItem > 0) {
          if (this.detail.department !== null) {
            const index = this.listDepartment.findIndex(
              (a) => a.id === this.detail.department
            );
            this.keytabs = String(index);
          }
        }
        getlistsRate().then((res2) => {
          if (res2.status === 200) {
            this.listRateDefault = res2.data.data.filter((a) => a.status === 1);

            this.listRate = res2.data.data.filter((a) => a.status === 1);

            this.list_rate = this.detail.list_rate_ticket;

            this.loadingDepartment = false;
          }
        });
      }
    });
    if (
      this.detail.flag_content !== null &&
      this.detail.flag_content.note_user
    ) {
      this.note_user = this.detail.flag_content.note_user;
    }
    if (this.detail.flag_index !== null && this.detail.flag_index.user) {
      this.mnv = this.detail.flag_index.user;
    }
    if (
      this.detail.flag_content !== null &&
      this.detail.flag_content.personnel_note
    ) {
      this.personnel_note = this.detail.flag_content.personnel_note;
    }
    if (this.detail.personnel_name !== null) {
      this.personnel_name = this.detail.personnel_name;
    }
    if (
      this.detail.flag_content !== null &&
      this.detail.flag_content.note_user_expertise
    ) {
      this.note_user_expertise = this.detail.flag_content.note_user_expertise;
    }
    if (this.detail.phone !== null) {
      this.phone = this.detail.phone;
    }
    if (!!this.detail.note_bgd) {
      this.note_bgd = this.detail.note_bgd;
    }
     if (!!this.detail.thoi_gian_hen) {
      this.thoi_gian_hen = this.detail.thoi_gian_hen;
    }
    // if (this.detail.rate !== null) {
    //   this.rate = this.detail.rate;
    // }
    // if (this.detail.coupon !== null) {
    //   this.coupon = this.detail.coupon;
    // }
    if (this.detail.code_store !== null) {
      this.code_store = this.detail.code_store;
    }
    if (this.detail.code_store !== this.detail.code_store_rate) {
      this.note_xu_ly_chi_nhanh = this.detail.note_xu_ly_chi_nhanh;
    }
    getListsRecords(
      this.detail.cid_parent !== null && this.detail.cid_parent > 0
        ? this.detail.cid_parent
        : this.detail.id
    ).then((res) => {
      if (res.status === 200) {
        res.data.data.forEach((a) => {
          a.content.blobRecord = "";
          if (a.content.logRecord) {
            a.content.logRecord.fromDateTime = new Date(
              new Date(a.created_at).getTime() - 2000
            ).toLocaleString("sv-SE");
          }
        });
        this.records = res.data;
      }
    });

    this.is_loading = true;

    let url = "http://apitk.stdmcl.com:8099/restful/checkpbn";

    const res = await fetch(url + "?sophieu=" + this.detail.pbn);

    const json = await res.json();

    if (json.status === 200) {
      if (json.result2 !== null && json.result2 !== "") {
        this.detail.ngaygiaohang = json.result2.NgayGiaoNhan;
        this.detail.nhanvien = json.result2.NhanVien;
        this.detail.ngaytaophieu = json.result2.NgayTaoPhieu;
        this.detail.tnvbh = json.result2.TenNVBH;
        this.detail.mnvbh = json.result2.MaNVBH;
        this.detail.nvgn = json.result2.NhanVien;
        this.detail.NhanVienDieu = json.result2.NhanVienDieu;

        if (json.result2?.dataJson) {
          this.detail.saleReceiptDetailDto = JSON.parse(
            json.result2?.dataJson
          ).SaleReceiptDetailDto;
        }
      }
    }

    const res2 = await fetch(
      "http://apitk.stdmcl.com:8099/restful/checkdt?sophieu=" + this.detail.pbn
    );

    const json2 = await res2.json();

    if (json2.result2 !== null && json2.result2 !== "") {
      this.detail.tnvbh = JSON.parse(json2.result2?.dataJson).EmployeeName;
      this.detail.mnvbh = JSON.parse(json2.result2?.dataJson).EmployeeID;
      if (json2.result2?.dataJson) {
        this.detail.saleReceiptDetailDto = JSON.parse(
          json2.result2?.dataJson
        ).SaleReceiptDetailDto;
      }
      if (json.result2 == null && json2?.data?.CreationDate) {
        this.detail.ngaytaophieu = json2?.data?.CreationDate ?? null;
      }
    }

    this.is_loading = false;
  },

  methods: {
    checkcallercaller() {
      if (this.$route.name === "Ticketcallerinfo") return true;
      return false;
    },
    saverateCustomer() {
      this.loading = true;

      const formData = new FormData();
      formData.append("id", this.detail.id);
      formData.append("rate_customer", this.detail.rate_customer);

      saverateCustomer(formData)
        .then((res) => {
          if (res.status == 200) {
            Message({
              message: "Lưu thành công",
              type: "success",
              duration: 5 * 1000,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          Message({
            message: "Lưu không thành công",
            type: "error",
            duration: 5 * 1000,
          });
          this.loading = false;
        });
    },
    saveQcdanhgia() {
      this.loading = true;

      const formData = new FormData();
      formData.append("id", this.detail.id);
      formData.append("personnel_note", this.personnel_note);

      saveQcdanhgia(formData)
        .then((res) => {
          if (res.status == 200) {
            Message({
              message: "Lưu thành công",
              type: "success",
              duration: 5 * 1000,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          Message({
            message: "Lưu không thành công",
            type: "error",
            duration: 5 * 1000,
          });
          this.loading = false;
        });
    },
    handleChangeFile(e) {
      this.file = e.raw;
    },
    handleChangePdf(e) {
      this.pdf = e.raw;
    },
    handlePrint(status) {
      this.dialogVisiblePrint = status;
    },
    updateArrayData(e, i) {
      document.getElementById("personnel" + i).focus();
    },
    handleSave() {
      const formData = new FormData();
      formData.append("id", this.detail.id);
      formData.append("code_store", this.code_store);

      this.loading = true;

      saveStore(formData)
        .then((res) => {
          if (res.status == 200) {
            Message({
              message: "Lưu thành công",
              type: "success",
              duration: 5 * 1000,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          Message({
            message: "Lưu không thành công",
            type: "error",
            duration: 5 * 1000,
          });
          this.loading = false;
        });
    },
    handleDetail(status, linkedid) {
      this.$parent.recordStatus(status, linkedid);
    },
    handleDetail2(status, data) {
      this.detailnew = data;
      this.dialogVisibleDetail = status;
    },
    selectChange(id) {
      const findIndex = this.list_rate.findIndex((a) => a === id);

      if (findIndex === -1) {
        this.list_rate.push(id);
      } else {
        this.list_rate = this.list_rate.filter((a) => a !== id);
      }
    },
    async saveNotexulychinhanh(id) {
      this.loading = true;
      const formData = new FormData();
      formData.append("id", id);
      formData.append("note_xu_ly_chi_nhanh", this.note_xu_ly_chi_nhanh);

      luunotexuly(formData)
        .then((res) => {
          if (res.status === 200) {
            Message({
              message: "Lưu thành công",
              type: "success",
              duration: 5 * 1000,
            });
          } else {
            Message({
              message: res.message,
              type: "error",
              duration: 5 * 1000,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          Message({
            message: "Cập nhật không thành công",
            type: "error",
            duration: 5 * 1000,
          });
        });
    },
    addPersonnel() {
      this.personnel.push({ mnv: "", desc: "" });
    },
    listImages(data) {
      const arr = [];
      JSON.parse(data).forEach((a) => {
        arr.push({
          src:
            this.process +
            "/uploads/" +
            this.detail.pbn +
            "/doitra/" +
            a +
            ".png.webp",
          thumbnail:
            this.process +
            "/uploads/" +
            this.detail.pbn +
            "/doitra/" +
            a +
            ".png.webp",
          w: 1500,
          h: 1300,
          title: "",
        });
      });

      return arr;
    },
    closePopup() {
      this.$parent.closePopup();
      this.note_user = "";
      this.note_user_expertise = "";
      this.personnel_name = "";
      this.personnel_note = "";
    },
    handleClose() {
      this.closePopup();
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
        return "Hủy";
      } else if (rule === 5) {
        return "Yêu cầu xử lý lại";
      } else if (rule === -1) {
        return "Lưu lại";
      } else if (rule === 6) {
        return "Đã ra biên bản";
      }
    },
    handleUpdate(id, approved) {
      if (
        Number(
          this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
        ) !== 7
      ) {
        if (approved === 4 && this.note_user === "") {
          this.$notify({
            title: "Warning",
            message: "Nhập lý do hủy tại note xử lý !!",
            type: "warning",
          });
          return false;
        }
        // if (approved === 3 && this.list_rate.length === 0) {
        //   this.$notify({
        //     title: "Warning",
        //     message: "Chọn tiêu chí đánh giá bộ phận !!",
        //     type: "warning",
        //   });
        //   return false;
        // }
      }
      if (
        (approved === 2 && this.mnv === null) ||
        (approved === 2 && this.note_user === "")
      ) {
        this.$notify.error({
          title: "Error",
          message: "Thông tin mnv, Note Nội dung giải trình không để trống !!",
        });
        return false;
      }
      // if (approved === 2 && this.records.TotalItem === undefined) {
      //   this.$notify.error({
      //     title: "Error",
      //     message: "Bạn chưa xử lý gọi khách hàng !!",
      //   });
      //   return false;
      // }
      this.loading = true;
      const formData = new FormData();
      formData.append("id", id);
      formData.append("approved", approved);
      formData.append("status", 1);
      formData.append("phone", this.phone);
      formData.append("cid_department", this.listDepartment[this.keytabs].id);
    let thoi_gian_hen = this.thoi_gian_hen;

      if (!!thoi_gian_hen) {
        thoi_gian_hen = new Date(this.thoi_gian_hen).toLocaleString("sv-SE");
      } else {
        thoi_gian_hen = "";
      }

      formData.append("thoi_gian_hen", thoi_gian_hen);
      // if (this.detail.approved === 2) {
      //   // formData.append("coupon", this.coupon);
      //   formData.append("rate", this.rate);
      // }

      if (
        (this.detail.approved === 2 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 3 &&
          this.personnel_note !== "" &&
          this.personnel_name.trim() !== "") ||
        (this.detail.approved === 2 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1 &&
          this.personnel_note !== "" &&
          this.personnel_name.trim() !== "")
      ) {
        this.list_rate.forEach((a) => {
          formData.append("list_rate[]", a);
        });
      }

      if (this.mnv !== null) {
        formData.append("TenChucDanh", this.mnv.TenChucDanh);
        formData.append("DepartMentName", this.mnv.DepartMentName);
        formData.append("SiteId", this.mnv.SiteId);
        formData.append("SiteName", this.mnv.SiteName);
        formData.append("FullName", this.mnv.FullName);
      }

      if (
        (this.detail.approved === 0 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1) ||
        (this.detail.approved === 5 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1) ||
        (this.detail.approved === 0 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 2) ||
        (this.detail.approved === 5 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 2) ||
        (this.detail.approved === 9 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 7) ||
        (this.detail.approved === 9 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1)
      ) {
        formData.append("mp3Files", this.file);
      }

      if (
        (this.detail.approved === 0 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 2) ||
        (this.detail.approved === 5 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 2) ||
        (this.detail.approved === 0 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1) ||
        (this.detail.approved === 5 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1)
      ) {
        formData.append("note_user", this.note_user);

        if (this.mnv !== null) {
          formData.append("personnel_name", this.personnel_name.trim());
        }

        formData.append("pdfFiles", this.pdf);

        this.files.forEach((a) => {
          formData.append("imageFiles[]", a);
        });
      }
      if (
        (this.detail.approved !== 0 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 3) ||
        (this.detail.approved !== 0 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1)
      ) {
        formData.append("note_user_expertise", this.note_user_expertise);
      }
      if (approved === 3 || approved === 0) {
        formData.append("code_store", this.code_store);
      }
      if (
        (this.detail.approved === 9 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 7) ||
        (this.detail.approved === 9 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1)
      ) {
        formData.append("personnel_note", this.personnel_note);
      }

      if (
        (this.detail.approved === 2 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 3) ||
        (this.detail.approved === 2 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1)
      ) {
        formData.append("tienphat", this.tienphat);
      }
      // if (
      //   (this.detail.approved === 3 &&
      //     Number(
      //       this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
      //     ) === 4) ||
      //   (this.detail.approved === 3 &&
      //     Number(
      //       this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
      //     ) === 1)
      // ) {
      //   formData.append("note_penalize", this.note_penalize);
      //   formData.append("note_report", this.note_report);
      // }

      updateTicket(formData).then((res) => {
        if (Number(res.status) === 200) {
          if (this.personnel.length > 0) {
            const formData2 = new FormData();
            formData2.append("cid_parent", this.detail.id);

            this.personnel
              .filter((a) => a.desc !== "")
              .forEach((a, i) => {
                formData2.append(
                  "data[" + i + "][TenChucDanh]",
                  a.desc.TenChucDanh
                );
                formData2.append(
                  "data[" + i + "][DepartMentName]",
                  a.desc.DepartMentName
                );
                formData2.append("data[" + i + "][SiteId]", a.desc.SiteId);
                formData2.append("data[" + i + "][SiteName]", a.desc.SiteName);
                formData2.append("data[" + i + "][FullName]", a.desc.FullName);
                formData2.append(
                  "data[" + i + "][personnel_name]",
                  a.desc.EmployeeId
                );
              });
            cloneticket(formData2).then((res2) => {
              if (res2.status == 200) {
                Message({
                  message: res.message,
                  type: "success",
                  duration: 5 * 1000,
                });
                this.closePopup();
                this.$parent.getLists(this.page);
                this.fileList = [];
                this.files = [];
              }
            });
          } else {
            Message({
              message: res.message,
              type: "success",
              duration: 5 * 1000,
            });
            this.closePopup();
            this.$parent.getLists(this.page);
            this.fileList = [];
            this.files = [];
          }
        } else {
          Message({
            message: res.message,
            type: "error",
            duration: 5 * 1000,
          });
        }
        this.loading = false;
      });
    },
    handleExceed() {
      this.$message.warning("Vui lòng up tối đa 3 hình!!");
    },
    handleChange(file, fileList) {
      let arr = [];
      fileList.forEach((a) => {
        arr = [...arr, a.raw];
      });
      this.files = arr;
      this.fileList = fileList;
    },
    handleLog(data) {
      this.loading = true;
      this.pagelog = data.page;
      getLog(data).then((res) => {
        if (res.status === 200) {
          if (this.log === null) {
            this.log = res.data;
          } else {
            this.log = this.log.data.concat(res.data.data);
          }
        }
        this.loading = false;
      });
    },
    handleCall(data) {
      if (this.phone === "") {
        this.$notify({
          title: "Warning",
          message: "Số điện thoại không để trống !!",
          type: "warning",
        });
        return false;
      }

      // Cuộc gọi bắt đầu -> chặn đóng/refresh tab cho tới khi updateRecord xong
      this.startCallGuard();
      this.loading = true;

      fetch(`${url}/restful/accountcall`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((dataUser) => {
          if (dataUser.data.data.accessToken) {
            let formData = new FormData();
            formData.append("username", data.username_call);
            formData.append("passwd", data.password_call);
            formData.append("src", data.caseout_call);
            formData.append("dst", this.phone);
            formData.append("caseOut", data.timeout_call);
            fetch(
              `${url}/restful/clickToCall?XAccountCode=dmcl_api&XAccessToken=${dataUser.data.data.accessToken}`,
              {
                method: "POST",
                body: formData,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.status == 200 && data?.data?.error?.code == 0) {
                  let logRecord = {
                    src: data.data.data.src,
                    dst: data.data.data.dst,
                    created_at: new Date().toLocaleString("sv-SE"),
                    logRecord: {
                      callKeys: data.data.data.callKey,
                      fromDateTime: new Date().toLocaleString("sv-SE"),
                      toDateTime: new Date(
                        new Date().setMinutes(new Date().getMinutes() + 30)
                      ).toLocaleString("sv-SE"),
                      destination: this.phone,
                      callType: "OUT",
                    },
                  };

                  const formData = new FormData();
                  formData.append("record", JSON.stringify(logRecord));
                  formData.append("id", this.detail.id);
                  // giữ payload: user vẫn đóng tab -> pagehide bắn beacon cứu data
                  this.setCallBeacon(formData);
                  updateRecord(formData)
                    .then((res) => {
                      if (Number(res.status) === 200) {
                        getListsRecords(this.detail.id).then((res) => {
                          if (res.status === 200) {
                            res.data.data.forEach((a) => {
                              if (a.content.logRecord) {
                                a.content.logRecord.fromDateTime = new Date(
                                  new Date(a.created_at).getTime() - 2000
                                ).toLocaleString("sv-SE");
                              }
                            });
                            this.records = res.data;
                            this.loading = false;
                          }
                        });
                        Message({
                          message: res.message,
                          type: "success",
                          duration: 5 * 1000,
                        });
                      }
                    })
                    .catch(() => {
                      Message({
                        message: "Cập nhật không thành công",
                        type: "error",
                        duration: 5 * 1000,
                      });
                    })
                    .finally(() => {
                      // updateRecord xong (kể cả lỗi) -> cho đóng tab bình thường
                      this.clearCallBeacon();
                      this.endCallGuard();
                    });
                } else if (
                  data.status == 200 &&
                  data?.data?.error?.code == 1201
                ) {
                  this.$notify({
                    title: "Error",
                    message:
                      "Vui lòng kiểm tra lại softphone. Hiện softphone chưa được mở!!",
                    type: "error",
                  });
                }
                if (!(data.status == 200 && data?.data?.error?.code == 0)) {
                  // không đặt được cuộc gọi -> không có updateRecord -> bỏ chặn
                  this.endCallGuard();
                }
                this.loading = false;
              })
              .catch((error) => {
                // lỗi khi gọi clickToCall -> bỏ chặn, tránh treo cảnh báo đóng tab
                this.endCallGuard();
                this.loading = false;
                console.error("Lỗi clickToCall:", error);
              });
          } else {
            // không lấy được accessToken -> bỏ chặn
            this.endCallGuard();
            this.loading = false;
          }
        })
        .catch((error) => {
          // lỗi khi lấy account call -> bỏ chặn
          this.endCallGuard();
          this.loading = false;
          console.error("Lỗi:", error);
        });
    },
    disabled() {
      if (this.personnel_name.trim() !== "") {
        return false;
      }
      return true;
    },
    downloadRecord(data) {
      this.loading_record = true;
      fetch(this.processCall + "/webservice/callRecord?key=" + data, {
        method: "GET",
      })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          var a = document.createElement("a");
          a.download = "ticket_record_" + this.detail.pbn;
          a.href = window.URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.loading_record = false;
        });
    },
    playRecord(data) {
      this.loading_record = true;
      fetch(
        this.processCall + "/webservice/callRecord?key=" + data.content.callleg,
        {
          method: "GET",
        }
      )
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          this.records.data[
            this.records.data.findIndex((a) => a.id === data.id)
          ].content.blobRecord = window.URL.createObjectURL(blob);
          this.loading_record = false;
        });
    },
    playRecord2(data) {
      this.loading_record = true;
      fetch(`${url}/restful/accountcall`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((dataUser) => {
          let formData = new FormData();
          Object.entries(data.content.logRecord).forEach((a) => {
            formData.append(a[0], a[1]);
          });
          fetch(
            `${this.url}/restful/callData?XAccountCode=dmcl_api&XAccessToken=${dataUser.data.data.accessToken}`,
            {
              method: "POST",
              body: formData,
            }
          )
            .then((response) => response.json())
            .then((resinfocall) => {
              data.show = true;
              data.listlog = resinfocall.data.data;
              this.loading_record = false;
            });
        });
    },
    async downloadRecordNew(data) {
      this.loading_record = true;
      fetch(`${url}/restful/accountcall`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((dataUser) => {
          let formData = new FormData();
          Object.entries(data.logRecord).forEach((a) => {
            formData.append(a[0], a[1]);
          });
          fetch(
            `${this.url}/restful/callData?XAccountCode=dmcl_api&XAccessToken=${dataUser.data.data.accessToken}`,
            {
              method: "POST",
              body: formData,
            }
          )
            .then((response) => response.json())
            .then((resinfocall) => {
              this.loading_record = true;
              let url = `https://dmcl5-cskh.ccms.vn:1101/api/app/v1/playRecord?callLeg=${resinfocall.data.data.cdr[0].details[0].callLeg}`;
              const link = document.createElement("a");
              link.href = url;
              link.download = "ticket_record_" + this.detail.pbn;
              link.id = "tempDownloadLink";
              link.style.display = "none";
              document.body.appendChild(link);
              link.click();
              setTimeout(() => {
                document.body.removeChild(link);
              }, 100);
              link.onerror = function () {
                alert(
                  "Không thể tải file. Vui lòng kiểm tra URL hoặc kết nối."
                );
                console.error("Lỗi tải file:", url);
              };
            });
        });
    },
    handlePrint(status) {
      this.$parent.handlePrint(status);
    },
    changeMnv() {
      this.mnv = null;
    },
    async loadMnv(data, number) {
      if (data === "") {
        this.$notify({
          title: "Warning",
          message: "Mã NV không để trống",
          type: "warning",
        });

        return false;
      }

      if (
        (number && data === this.personnel_name.trim()) ||
        (this.personnel.length > 0 &&
          this.personnel.filter(
            (a) => a.desc.EmployeeId === this.personnel_name.trim()
          ).length > 0) ||
        (this.personnel.length > 0 &&
          this.personnel.filter((a) => a.desc.EmployeeId === data).length > 0)
      ) {
        this.$notify({
          title: "Warning",
          message: "Mã NV đã tồn tại",
          type: "warning",
        });

        return false;
      }
      this.loading = true;

      const response = await fetch(
        process.env.VUE_APP_BASE_API +
          "/restful/getinfonhanvien?id=" +
          this.detail.id +
          "&username=" +
          data +
          "&" +
          JSON.parse(getUser()).find((a) => a.split("=")[0] === "token")
      );
      const datares = await response.json();

      if (datares.status === 200) {
        if (datares.code === 0) {
          if (number) {
            this.personnel[number - 1].desc = datares.data;
          } else {
            this.mnv = datares.data;
          }
        } else {
          this.$notify.error({
            title: "Error",
            message: datares.message,
          });
        }
      }
      this.loading = false;
    },
    returnPublic() {
      if (window.location.host === "dmcltk.stdmcl.com:8099") return "/public";
      else return "";
    },
    async savenote_bgd(note_bgd) {
      if (note_bgd === "") {
        this.$notify.warning({
          title: "Cảnh báo",
          message: "Nội dung không để trống",
        });
        return false;
      }
      this.loading = true;

      const formData = new FormData();
      formData.append("id", this.detail.id);
      formData.append("note_bgd", note_bgd);

      fetch(`${this.url}/restful/adminnotebgd`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.status == 200) {
            this.$notify({
              title: "Success",
              message: "Lưu thành công",
              type: "success",
            });
          }
          this.$parent.getLists(this.page);
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.box .hide {
  display: none;
}
.full .el-table__row td:last-child .cell {
  display: block;
  max-height: none;
}
</style>
