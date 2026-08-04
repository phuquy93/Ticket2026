<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Chi tiết"
      :before-close="handleClose"
    >
      <div id="printMe" class="detailprint" style="font-size: 16px">
        <template v-if="!is_loading">
          <div class="popup-header" style="flex-wrap: wrap">
            <div
              style="
                display: flex;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
              "
            >
              <div class="popup-status">
                <span class="status-label">ID:</span>
                <span class="status-value" style="padding: 0">
                  {{ detail.id }}
                </span>
              </div>
              <div class="popup-status">
                <span class="status-label">Trạng thái:</span>
                <span class="status-value" :class="'status-' + detail.approved">
                  {{ ruleApproved(detail.approved) }}
                </span>
              </div>
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
                style="margin-bottom: 10px; font-size: 16px; width: 100%"
              >
                (Nội dung vi phạm và mã NV không có nên không thể ra biên bản)
              </h1>
            </div>
            <div class="popup-actions">
              <el-button
                size="small"
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

              <el-button
                size="small"
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
                size="small"
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

              <el-button
                size="small"
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
                type="success"
                @click="handleUpdate(detail.id, 4)"
                >Đã xử lý</el-button
              >
              <el-button
                size="small"
                v-if="
                  Number(
                    user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                  ) === 1 &&
                  user
                    .find((a) => a.split('=')[0] === 'dataid')
                    .split('=')[1] != 122
                "
                v-loading="loading"
                type="warning"
                @click="handleMail()"
                >Gửi mail</el-button
              >
              <el-button
                style="margin-top: 10px"
                v-if="detail.approved === 3 && !is_loading"
                v-print="'#printMe'"
                type="danger"
                icon="el-icon-printer"
                >In</el-button
              >
              <el-button size="small" icon="el-icon-close" @click="closePopup"
                >Đóng</el-button
              >
            </div>
            <div style="width: 100%" v-if="!!detail.id_bienban">
              <strong>Số BBVP:</strong> {{ detail.id_bienban }}
            </div>
            <div
              style="width: 100%; margin-top: 7px"
              v-if="!!detail.loai_vi_pham || !!detail.note_pmns"
            >
              <strong>Nội dung:</strong
              ><span v-if="!!detail.loai_vi_pham">
                {{ detail.loai_vi_pham }},</span
              >
              <span v-if="!!detail.note_pmns"> {{ detail.note_pmns }}</span>
            </div>
            <div
              style="width: 100%; margin-top: 7px"
              v-if="
                detail.approved === 4 &&
                !!detail.flag_content.note_user_expertise
              "
            >
              <strong>Lý do hủy:</strong
              ><span v-if="!!detail.flag_content.note_user_expertise">
                {{ detail.flag_content.note_user_expertise }},</span
              >
            </div>
          </div>

          <div class="popup-grid">
            <div class="section-card">
              <div class="section-header">
                <i class="el-icon-user"></i>
                <h3>THÔNG TIN KHÁCH HÀNG</h3>
              </div>
              <div class="field-group">
                <div class="field-label">Tên KH</div>
                <div class="field-value">
                  {{ detail.name }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">SĐT</div>
                <div class="field-value">
                  <div class="call-button-container">
                    <el-input v-model="phone" placeholder="Please input" />
                    <button
                      v-if="
                        (detail.approved === 0 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 2) ||
                        (detail.approved === 5 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 2) ||
                        (detail.approved === 0 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 1) ||
                        (detail.approved === 2 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 1) ||
                        (detail.approved === 5 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 1)
                      "
                      type="button"
                      class="el-button el-button--success el-button--small"
                      style="width: 100px"
                      @click="handleCall(userCall)"
                      v-loading="loading"
                    >
                      <!----><i class="el-icon-phone"></i><span>Gọi</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">PBN</div>
                <div class="field-value">
                  {{ detail.pbn }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Ngày tạo PBN</div>
                <div class="field-value">
                  {{ detail.ngaytaophieu | moment("DD/MM/YYYY HH:mm:ss") }}
                </div>
              </div>
              <div class="field-group" v-if="detail.ThoiGianVe">
                <div class="field-label">
                  Thời gian <br />
                  hoàn thành phiếu
                </div>
                <div class="field-value">
                  {{
                    detail.ThoiGianVe.search("1/1/1900") === -1
                      ? detail.ThoiGianVe
                      : "Chưa giao hàng"
                  }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Ngày KH đánh giá</div>
                <div class="field-value">
                  {{ detail.created_at | moment("DD/MM/YYYY") }}
                </div>
              </div>
              <!-- <div class="field-group">
                <div class="field-label">Chi nhánh</div>
                <div class="field-value">
                  {{ detail.code_store }} - {{ detail.store_name }}
                </div>
              </div> -->
              <div class="field-group">
                <div class="field-label">NV bán hàng</div>
                <div class="field-value">
                  <span
                    v-if="detail.mnvbh && detail.mnvbh !== null"
                    style="text-transform: uppercase"
                    >{{ detail.mnvbh }}</span
                  >
                  -
                  <span v-if="detail.tnvbh && detail.tnvbh !== null">{{
                    detail.tnvbh
                  }}</span>
                </div>
              </div>
              <div
                class="field-group"
                v-if="detail.nvgn && detail.nvgn.length > 0"
              >
                <template v-for="(a, i) in detail.nvgn">
                  <div class="field-label" :key="i + '1'">NV giao nhận</div>
                  <div class="field-value" :key="i + '2'">
                    <span
                      v-if="a.MaNhanVien && a.MaNhanVien !== null"
                      style="text-transform: uppercase"
                      >{{ a.MaNhanVien }}</span
                    >
                    -
                    <span v-if="a.TenNhanVien && a.TenNhanVien !== null">{{
                      a.TenNhanVien
                    }}</span>
                  </div>
                </template>
              </div>
              <div class="field-group">
                <div class="field-label">NV điều phối</div>
                <div class="field-value" style="text-transform: uppercase">
                  {{ detail.NhanVienDieu }} - {{ detail.TenNhanVienDieu }}
                </div>
              </div>
            </div>
            <div class="section-card">
              <div class="section-header">
                <i class="el-icon-setting"></i>
                <h3>THÔNG TIN XỬ LÝ</h3>
              </div>

              <div class="field-group">
                <div class="field-label">Nội dung đánh giá</div>
                <div class="field-value">
                  <span v-if="!!detail.description">{{
                    detail.description
                  }}</span>
                  <span v-else>N/A</span>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Chi nhánh xử lý</div>
                <div class="field-value">
                  <span v-if="!!detail.code_store_rate">{{
                    detail.code_store_rate + " - " + detail.store_name_rate
                  }}</span>
                  <span v-else>N/A-</span>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">CN có NV vi phạn</div>
                <div class="field-value">
                  <span v-if="!!detail.code_store">{{
                    detail.code_store + " - " + detail.store_name
                  }}</span>
                  <span v-else>N/A-</span>
                </div>
              </div>
              <!-- <div class="field-group" v-if="stores">
                <div class="field-label">Chi nhánh xử lý</div>
                <div class="field-value">
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
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 2 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 3) ||
                      (detail.approved === 3 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 3 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 3) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 3)
                    "
                    v-loading="loading"
                    type="primary"
                    style="font-size: 16px"
                    @click="handleSave"
                    >Lưu</el-button
                  >
                </div>
              </div> -->
              <div class="field-group">
                <div class="field-label">Số sao</div>
                <div class="field-value" v-if="!!detail.rate_customer">
                  {{ detail.rate_customer }} sao
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Tiêu chí đánh giá</div>
                <div class="field-value">
                  <template
                    v-if="
                      detail.flag_content !== null &&
                      detail.flag_content.content_rate &&
                      detail.flag_content.content_rate.length > 0
                    "
                  >
                    <span
                      v-for="(a, i) in detail.flag_content.content_rate"
                      :key="i"
                      class="tag"
                      style="word-break: break-word"
                      >{{ a }}</span
                    >
                  </template>
                  <template v-else>N/A</template>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Thời gian xử lý</div>
                <div class="field-value" v-if="!!detail.time_handle">
                  {{ detail.time_handle | moment("DD/MM/YYYY HH:mm:ss") }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Tên QL xử lý</div>
                <div class="field-value">
                  <span v-if="!!detail.name_user">{{ detail.name_user }}</span>
                  <span v-else>N/A</span>
                </div>
              </div>
            </div>
          </div>

          <div class="popup-grid">
            <div class="section-card">
              <div class="section-header">
                <i class="el-icon-view"></i>
                <h3>NỘI DUNG XỬ LÝ</h3>
              </div>
              <div class="field-group">
                <div class="field-label">
                  Phòng hành chánh <br />
                  yêu cầu
                </div>
                <div
                  class="field-value"
                  v-if="
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 1
                  "
                >
                  <div class="call-button-container">
                    <el-input
                      v-model="note_bgd"
                      type="textarea"
                      placeholder="Please input"
                    />
                    <el-button
                      style="width: 100px; height: -webkit-fill-available"
                      size="small"
                      v-loading="loading"
                      type="warning"
                      @click="savenote_bgd(note_bgd)"
                      v-if="
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1
                      "
                      >Lưu</el-button
                    >
                  </div>
                </div>
                <div class="field-value" v-else>{{ note_bgd }}</div>
              </div>
              <div class="field-group">
                <div class="field-label">Note xử lý KH</div>
                <div
                  class="field-value"
                  v-if="
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1)
                  "
                >
                  <el-input
                    v-model="note_user"
                    type="textarea"
                    placeholder="Please input"
                  />
                </div>
                <div class="field-value" v-else>
                  <span v-if="!!detail.flag_content.note_user">
                    {{ detail.flag_content.note_user }}
                  </span>
                  <span v-else>N/A</span>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Thời gian hẹn xử lý</div>
                <div
                  class="field-value"
                  v-if="detail.approved === 0 || detail.approved === 5"
                >
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
              <div class="field-group" style="flex-direction: column">
                <div class="field-label">
                  Mã NV vi phạm
                  <el-button
                    v-if="
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1)
                    "
                    type="primary"
                    size="small"
                    @click="addPersonnel"
                    >Thêm</el-button
                  >
                </div>
                <div class="field-value">
                  <div
                    v-if="
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
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
                      <el-button
                        v-loading="loading"
                        type="success"
                        style="width: 100px"
                        icon="el-icon-user"
                        @click="openStaffPopup()"
                      ></el-button>
                    </div>
                    <strong v-if="mnv !== null" style="font-size: 14px"
                      >(Tên: {{ mnv.FullName }}, Phòng ban:
                      {{ mnv.DepartMentName }}, Chức vụ: {{ mnv.TenChucDanh }},
                      Chi nhánh: {{ mnv.SiteName }} - {{ mnv.SiteId }})</strong
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
                        <el-button
                          v-loading="loading"
                          type="success"
                          style="width: 100px"
                          icon="el-icon-user"
                          @click="openStaffPopup(i + 1)"
                        ></el-button>
                      </div>
                      <strong
                        v-if="a.desc !== ''"
                        :key="i + Math.random()"
                        style="font-size: 14px"
                        >(Tên: {{ a.desc.FullName }}, Phòng ban:
                        {{ a.desc.DepartMentName }}, Chức vụ:
                        {{ a.desc.TenChucDanh }}, Chi nhánh:
                        {{ a.desc.SiteName }} - {{ a.desc.SiteId }})</strong
                      >
                    </template>
                  </div>
                  <p v-else>
                    <span v-if="detail.personnel_name !== null">{{
                      detail.personnel_name
                    }}</span>

                    <span
                      v-if="
                        detail.flag_index !== null && detail.flag_index.user
                      "
                    >
                      {{ detail.flag_index.user.FullName }} ({{
                        detail.flag_index.user.SiteId
                      }}
                      - {{ detail.flag_index.user.SiteName }} -
                      {{ detail.flag_index.user.TenChucDanh }})</span
                    >
                  </p>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Nội dung vi phạm</div>
                <div class="field-value">
                  <template
                    v-if="
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1)
                    "
                  >
                    <el-input
                      v-model="personnel_note"
                      type="textarea"
                      placeholder="Please input"
                    />
                  </template>
                  <template v-else>
                    <span
                      v-if="
                        detail.flag_content !== null &&
                        detail.flag_content.personnel_note
                      "
                      >{{ detail.flag_content.personnel_note }}</span
                    >
                  </template>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Hình thức xử lý</div>
                <div class="field-value" style="display: flex; gap: 5px">
                  <template
                    v-if="
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1)
                    "
                  >
                    <div
                      v-for="b in [
                        { label: 'Nhắc nhở', value: 1 },
                        { label: 'Cảnh cáo', value: 2 },
                        { label: 'Phạt tiền', value: 3 },
                        { label: 'Khác', value: 4 },
                      ]"
                      :key="b.id"
                      class="rate-item"
                    >
                      <label class="form-control" style="user-select: none">
                        <input
                          type="radio"
                          name="checkbox"
                          :value="b.value"
                          v-model="type_xu_ly"
                        />
                        {{ b.label }}
                      </label>
                    </div>
                  </template>
                  <template v-else>
                    <span v-if="!!detail.type_xu_ly && detail.type_xu_ly == 1"
                      >Nhắc nhở</span
                    >
                    <span
                      v-else-if="!!detail.type_xu_ly && detail.type_xu_ly == 2"
                      >Cảnh cáo</span
                    >
                    <span
                      v-else-if="!!detail.type_xu_ly && detail.type_xu_ly == 3"
                      >Phạt tiền</span
                    >
                    <span v-else>Khác</span>
                  </template>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label" style="color: red">Tiền phạt</div>
                <div
                  class="field-value"
                  v-if="
                    (detail.approved === 2 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 3) ||
                    (detail.approved === 2 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1)
                  "
                >
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
                </div>
                <div class="field-value" v-else>
                  <span v-if="!!detail.tienphat">
                    {{ detail.tienphat }}
                  </span>
                  <span v-else>0</span>
                </div>
              </div>
            </div>
            <div class="section-card">
              <div class="section-header">
                <i class="el-icon-star-off"></i>
                <h3>ĐÁNH GIÁ &amp; THẨM ĐỊNH</h3>
              </div>

              <!-- <div class="field-group">
                <div class="field-label">Đánh giá cách xử lý</div>
                <div class="field-value">
                  <template
                    v-if="
                      (detail.approved === 2 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 3) ||
                      (detail.approved === 2 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1)
                    "
                  >
                    <el-rate v-model="rate" />
                  </template>
                  <template v-else>N/A</template>
                </div>
              </div> -->
              <div
                class="field-group"
                v-if="
                  ((detail.approved !== 2 &&
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) !== 3) ||
                    (detail.approved !== 2 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) !== 1)) &&
                  detail.coupon &&
                  detail.coupon !== null &&
                  detail.coupon !== ''
                "
              >
                <div class="field-label">Cách khắc phục</div>
                <div class="field-value">{{ detail.coupon }}</div>
              </div>
              <div
                class="field-group"
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
                <div class="field-label">Cách khắc phục</div>
                <div class="field-value">
                  <el-input
                    v-model="coupon"
                    type="textarea"
                    placeholder="Please input"
                  />
                </div>
              </div>
              <div
                class="field-group"
                v-if="detail.rate !== 0 && detail.rate !== null"
              >
                <div class="field-label">Thẩm định đánh giá độ hài lòng</div>
                <div class="field-value">{{ detail.rate }}/5 sao</div>
              </div>
              <div class="field-group">
                <div class="field-label">Nhận xét hướng xử lý</div>
                <div class="field-value">
                  <template
                    v-if="
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 3 ||
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1
                    "
                  >
                    <el-input
                      v-model="note_user_expertise"
                      type="textarea"
                      placeholder="Please input"
                    />
                  </template>
                  <template v-else>
                    <span
                      v-if="
                        detail.flag_content !== null &&
                        detail.flag_content.note_user_expertise
                      "
                      >{{ detail.flag_content.note_user_expertise }}</span
                    >
                  </template>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Đề xuất hướng xử lý</div>
                <div class="field-value">
                  <template
                    v-if="
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 3 ||
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1
                    "
                  >
                    <el-input
                      v-model="note_nhan_xet_xu_ly"
                      type="textarea"
                      placeholder="Please input"
                    />
                  </template>
                  <template v-else>
                    <span
                      v-if="
                        detail.note_nhan_xet_xu_ly !== null &&
                        detail.note_nhan_xet_xu_ly
                      "
                      >{{ detail.note_nhan_xet_xu_ly }}</span
                    >
                  </template>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">NV nhận xét</div>
                <div class="field-value">
                  <template
                    v-if="
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 3 ||
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1
                    "
                  >
                    <el-input
                      v-model="note_nhan_vien_nhan_xet"
                      type="textarea"
                      placeholder="Please input"
                    />
                  </template>
                  <template v-else>
                    <span
                      v-if="
                        detail.note_nhan_vien_nhan_xet !== null &&
                        detail.note_nhan_vien_nhan_xet
                      "
                      >{{ detail.note_nhan_vien_nhan_xet }}</span
                    >
                  </template>
                </div>
              </div>
              <div class="field-group">
                <div
                  v-if="
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) !== 2
                  "
                  class="box"
                  style="padding: 0"
                >
                  <h3 style="width: 100%" class="field-label">
                    Tiêu chí đánh giá bộ phận
                  </h3>

                  <el-tabs
                    v-model="keytabs"
                    v-loading="loadingDepartment"
                    type="border-card"
                  >
                    <el-tab-pane
                      v-for="a in listDepartment"
                      :key="a.id"
                      :label="a.name"
                      :disabled="statusTabs"
                    >
                      <div class="rate-grid">
                        <div
                          v-for="b in listRate"
                          :key="b.id"
                          class="rate-item"
                        >
                          <label class="form-control" style="user-select: none">
                            <input
                              :checked="list_rate.find((c) => c === b.id)"
                              type="checkbox"
                              name="checkbox"
                              @change="selectChange(b.id)"
                            />
                            {{ b.name }}
                          </label>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                  <h1
                    v-if="
                      (detail.approved === 2 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 3 &&
                        personnel_note === '' &&
                        personnel_name === '') ||
                      (detail.approved === 2 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1 &&
                        personnel_note === '' &&
                        personnel_name === '')
                    "
                    class="error"
                    style="margin-bottom: 10px; font-size: 16px"
                  >
                    (Nội dung vi phạm và mã NV không có nên không thể chọn tiêu
                    chí)
                  </h1>
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">Số lần xử lý lại</div>
                <div class="field-value">
                  <template
                    v-if="
                      detail.flag_content !== null &&
                      detail.flag_content.num_processing
                    "
                  >
                    {{ detail.flag_content.num_processing }}
                  </template>
                  <template v-else>0</template>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Tên thẩm định</div>
                <div class="field-value">
                  <template v-if="detail.name_user_expertise !== ''">
                    {{ detail.name_user_expertise }}
                  </template>
                  <template v-else>N/A</template>
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header" style="margin: 0">
              <i class="el-icon-paperclip" style="margin-right: 5px"></i>
              <h3>TÀI LIỆU ĐÍNH KÈM</h3>
            </div>
            <div class="field-content">
              <div
                class="box"
                style="
                  width: 100%;
                  border-top: 1px dotted #dcdfe6;
                  padding-top: 10px;
                "
                v-if="records.TotalItem > 0"
              >
                <h3 style="display: flex; align-items: center">Record</h3>
                <p style="width: 100%">
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
                    <el-table-column
                      align="center"
                      label="Option"
                      width="400px"
                    >
                      <template slot-scope="scope">
                        <div v-if="scope.row.content.logRecord">
                          <!-- <el-button
                            size="small"
                            style="margin: 0 10px"
                            type="primary"
                            @click="
                              handleDetail2(true, scope.row.content.logRecord)
                            "
                            >Xem chi tiết</el-button
                          > -->
                          <el-button
                            size="small"
                            style="margin: 0 20px"
                            type="info"
                            icon="el-icon-download"
                            @click="downloadRecordNew(scope.row.content)"
                          />

                          <audio
                            v-if="
                              scope.row.show && !!scope.row.listlog.cdr.length
                            "
                            type="audio/wav"
                            controls
                            autoplay
                            :src="`https://dmcl5-cskh.ccms.vn:1101/api/app/v1/playRecord?callLeg=${scope.row.listlog.cdr[0].details[0].callLeg}`"
                          ></audio>
                          <el-button
                            size="small"
                            v-else
                            v-loading="loading_record"
                            type="success"
                            icon="el-icon-headset"
                            @click="playRecord2(scope.row)"
                          />
                        </div>
                        <div v-else>
                          <!-- <el-button
                            style="margin: 0 10px"
                            type="primary"
                            @click="
                              handleDetail(true, scope.row.content.linkedid)
                            "
                            >Xem chi tiết</el-button
                          > -->
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
              </div>

              <div class="flex-style">
                <div
                  class="box"
                  v-if="
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1)
                  "
                >
                  <h3>Hình ảnh</h3>
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
                </div>
                <div class="box" v-if="detail.multi_picture !== null">
                  <h3>Hình ảnh</h3>

                  <vue-picture-swipe
                    :items="listImages(detail.multi_picture)"
                  />
                </div>

                <div
                  class="box"
                  v-if="
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1) ||
                    detail.mp3 !== null
                  "
                >
                  <h3 style="width: 100%">File ghi âm</h3>
                  <el-upload
                    style="margin-bottom: 10px"
                    v-if="
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2) ||
                      (detail.approved === 0 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1) ||
                      (detail.approved === 5 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1)
                    "
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
                  <a
                    v-if="detail.mp3 !== null"
                    target="_blank"
                    style="color: blue"
                    :href="
                      'http://apitk.stdmcl.com:8099/public/uploads/' +
                      detail.pbn +
                      '/' +
                      detail.mp3
                    "
                    >Link ghi âm</a
                  >
                </div>

                <div
                  class="box"
                  v-if="
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 2) ||
                    (detail.approved === 0 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1) ||
                    (detail.approved === 5 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
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
                <div class="box" v-if="detail.pdf !== null">
                  <h3 style="width: 100%">File PDF</h3>
                  <a
                    target="_blank"
                    style="color: blue"
                    :href="
                      'http://apitk.stdmcl.com:8099/public/uploads/' +
                      detail.pbn +
                      '/' +
                      detail.pdf +
                      '.pdf'
                    "
                    >Link PDF</a
                  >
                </div>

                <div class="box">
                  <h3 style="width: 100%">Log</h3>
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleOpenLogPopup"
                    icon="el-icon-document"
                    >Xem Log</el-button
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="section-card" style="margin-top: 16px">
            <div class="section-header">
              <i class="el-icon-document" style="margin-right: 5px"></i>
              <h3>CHI TIẾT BIÊN NHẬN</h3>
            </div>
            <div class="box full" style="display: block">
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
          </div>
        </template>
        <div
          style="display: flex; justify-content: center; padding: 10% 0"
          v-else
        >
          <div class="loading"></div>
        </div>
      </div>
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

    <el-dialog
      :visible.sync="dialogVisibleStaff"
      title="Danh sách nhân viên"
      width="900px"
    >
      <StaffPopup :code_store="detail.code_store" @choose="handleChooseStaff" />
    </el-dialog>

    <LogPopup
      :visible="dialogVisibleLog"
      :log="log"
      :pagelog="pagelog"
      :loading="loading"
      :detail-id="detail.id"
      :user-rule="user.find((a) => a.split('=')[0] === 'rule').split('=')[1]"
      @close="dialogVisibleLog = false"
      @load-more="handleLog"
    />
  </div>
</template>

<script>
// import Print from "./Print.vue";
import DetailNew from "./Detailnew.vue";
import LogPopup from "./LogPopup.vue";
import StaffPopup from "./Staff.vue";
import {
  updateTicket,
  updateRecord,
  getListsRecords,
  getLog,
  cloneticket,
  saveStore,
  luunotexuly,
  sendMail,
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
  components: { DetailNew, LogPopup, StaffPopup },
  data() {
    return {
      dialogVisibleDetail: false,
      dialogVisibleLog: false,
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
      dialogVisibleStaff: false,
      currentIndexStaff: 0,

      note_nhan_xet_xu_ly: "",
      note_nhan_vien_nhan_xet: "",
      type_xu_ly: 0,
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
    disabledCheckRate() {
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
        return false;
      }
      return true;
    },
    statusTabs() {
      if (this.list_rate.length > 0) {
        return true;
      }
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
    if (this.detail.rate !== null) {
      this.rate = this.detail.rate;
    }
    if (this.detail.coupon !== null) {
      this.coupon = this.detail.coupon;
    }
    if (this.detail.code_store !== null) {
      this.code_store = this.detail.code_store;
    }
    if (this.detail.code_store !== this.detail.code_store_rate) {
      this.note_xu_ly_chi_nhanh = this.detail.note_xu_ly_chi_nhanh;
    }
    if (!!this.detail.note_bgd) {
      this.note_bgd = this.detail.note_bgd;
    }

    if (!!this.detail.type_xu_ly) {
      this.type_xu_ly = this.detail.type_xu_ly;
    }
    if (!!this.detail.note_nhan_xet_xu_ly) {
      this.note_nhan_xet_xu_ly = this.detail.note_nhan_xet_xu_ly;
    }
    if (!!this.detail.note_nhan_vien_nhan_xet) {
      this.note_nhan_vien_nhan_xet = this.detail.note_nhan_vien_nhan_xet;
    }
    if (!!this.detail.thoi_gian_hen) {
      this.thoi_gian_hen = this.detail.thoi_gian_hen;
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
        this.detail.ThoiGianVe = json.result2.ThoiGianVe;

        // if (!!json.result2.MaNVBH && this.personnel_name === "") {
        //   this.personnel_name = this.detail.mnvbh;
        //   this.loadMnv(this.detail.mnvbh.trim());
        // }
        this.detail.nvgn = json.result2.NhanVien;
        this.detail.NhanVienDieu = json.result2.NhanVienDieu;
        this.detail.TenNhanVienDieu = json.result2.TenNhanVienDieu;

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
        // if (
        //   !!JSON.parse(json2.result2?.dataJson)?.Phone &&
        //   this.personnel_name === ""
        // ) {
        //   this.personnel_name = JSON.parse(json2.result2?.dataJson)?.Phone;
        //   this.loadMnv(this.personnel_name.trim());
        // }

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
    openStaffPopup(index = 0) {
      this.currentIndexStaff = index;
      this.dialogVisibleStaff = true;
    },
    handleChooseStaff(data) {
      if (this.currentIndexStaff === 0) {
        this.personnel_name = data.EmployeeId;
      } else {
        this.personnel[this.currentIndexStaff - 1].manv = data.EmployeeId;
      }
      this.dialogVisibleStaff = false;
      this.loadMnv(data.EmployeeId, this.currentIndexStaff);
    },
    listImages(data) {
      const arr = [];
      data.forEach((a) => {
        arr.push({
          src:
            this.process +
            "/public/uploads/" +
            this.detail.pbn +
            "/" +
            a +
            ".png.webp",
          thumbnail:
            this.process +
            "/public/uploads/" +
            this.detail.pbn +
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
    closePopup() {
      this.$parent.closePopup();
      this.note_user = "";
      this.note_user_expertise = "";
      this.personnel_name = "";
      this.personnel_note = "";
      this.note_nhan_xet_xu_ly = "";
      this.note_nhan_vien_nhan_xet = "";
      this.type_xu_ly = 0;
      this.thoi_gian_hen = null;
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
        return "Đã xử lý";
      } else if (rule === 5) {
        return "Yêu cầu xử lý lại";
      } else if (rule === -1) {
        return "Lưu lại";
      } else if (rule === 6) {
        return "Đã ra biên bản";
      }
    },
    handleUpdate(id, approved) {
      if (approved === 4 && this.note_user === "") {
        this.$notify({
          title: "Warning",
          message: "Nhập lý do hủy tại note xử lý !!",
          type: "warning",
        });
        return false;
      }
      if (approved === 3 && this.list_rate.length === 0) {
        this.$notify({
          title: "Warning",
          message: "Chọn tiêu chí đánh giá bộ phận !!",
          type: "warning",
        });
        return false;
      }
      if (
        (approved === 2 && this.mnv === null) ||
        (approved === 2 && this.note_user === "") ||
        (approved === 2 && this.personnel_note === "")
      ) {
        this.$notify.error({
          title: "Error",
          message:
            "Thông tin mnv, Note xử lý KH, Nội dung vi phạm không để trống !!",
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
      if (
        approved == 2 &&
        this.records.length === 0 &&
        this.file === 0 &&
        this.detail.mp3 === null
      ) {
        this.$notify.error({
          title: "Error",
          message: "Vui lòng upload file ghi âm !!",
        });
        return false;
      }
      this.loading = true;
      const formData = new FormData();
      formData.append("id", id);
      formData.append("approved", approved);
      formData.append("status", 1);
      formData.append("phone", this.phone);
      formData.append("cid_department", this.listDepartment[this.keytabs].id);

      if (this.detail.approved === 2) {
        formData.append("coupon", this.coupon);
        formData.append("rate", 0);
      }

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

        formData.append("personnel_note", this.personnel_note);
        formData.append("type_xu_ly", this.type_xu_ly);

        let thoi_gian_hen = this.thoi_gian_hen;

        if (!!thoi_gian_hen) {
          thoi_gian_hen = new Date(this.thoi_gian_hen).toLocaleString("sv-SE");
        } else {
          thoi_gian_hen = "";
        }

        formData.append("thoi_gian_hen", thoi_gian_hen);

        formData.append("mp3Files", this.file);

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
        formData.append(
          "note_nhan_vien_nhan_xet",
          this.note_nhan_vien_nhan_xet
        );
        formData.append("note_nhan_xet_xu_ly", this.note_nhan_xet_xu_ly);
      }
      if (approved === 3) {
        formData.append("code_store", this.code_store);
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
    handleOpenLogPopup() {
      this.dialogVisibleLog = true;
      if (this.log === null) {
        this.loadAllLogs();
      }
    },
    async loadAllLogs() {
      this.loading = true;
      try {
        let currentPage = 1;
        let allLogs = [];
        let totalPages = 1;

        // Load first page to get total pages
        const firstResponse = await getLog({
          id: this.detail.id,
          page: currentPage,
        });
        if (firstResponse.status === 200) {
          allLogs = firstResponse.data.data;
          totalPages = firstResponse.data.Totalpage || 1;
          this.pagelog = currentPage;

          // Load remaining pages
          while (currentPage < totalPages) {
            currentPage++;
            const response = await getLog({
              id: this.detail.id,
              page: currentPage,
            });
            if (response.status === 200) {
              allLogs = allLogs.concat(response.data.data);
              this.pagelog = currentPage;
            }
          }

          // Set all logs at once
          this.log = {
            data: allLogs,
            Totalpage: totalPages,
            TotalItem: allLogs.length,
          };
        }
      } catch (error) {
        console.error("Error loading logs:", error);
      } finally {
        this.loading = false;
      }
    },
    handleLog(data) {
      this.loading = true;
      this.pagelog = data.page;
      getLog(data).then((res) => {
        if (res.status === 200) {
          if (this.log === null) {
            this.log = res.data;
          } else {
            this.log.data = this.log.data.concat(res.data.data);
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
      if (this.personnel_note !== "" && this.personnel_name.trim() !== "") {
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
              this.loading_record = false;
              if (!!resinfocall.data.data.cdr.length) {
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
                  this.$notify({
                    title: "Error",
                    message:
                      "Không thể tải file. Vui lòng kiểm tra URL hoặc kết nối",
                    type: "error",
                  });

                  console.error("Lỗi tải file:", url);
                };
              }
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
        "http://apitk.stdmcl.com:8099/restful/getinfonhanvien?id=" +
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
    async handleMail() {
      const formData = new FormData();
      formData.append("id", this.detail.id);

      this.loading = true;

      sendMail(formData)
        .then((res) => {
          if (res.status == 200) {
            Message({
              message: "Gửi mail thành công",
              type: "success",
              duration: 5 * 1000,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          Message({
            message: "Gửi mail không thành công",
            type: "error",
            duration: 5 * 1000,
          });
          this.loading = false;
        });
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
@import "./Popup.css";

.full .el-table__row td:last-child .cell {
  display: block;
  max-height: none;
}
</style>
