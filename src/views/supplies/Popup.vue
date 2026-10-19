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
                @click="handleUpdate(detail.id, 2)"
                >Từ chối (cần thẩm định)</el-button
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
                >Từ chối (cần thẩm định)</el-button
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
                    ) === 1 &&
                    detail.approved === 2 &&
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
                @click="handleUpdate(detail.id, 4)"
                >Đã xử lý</el-button
              >
              <el-button
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
                        (detail.approved === 9 &&
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
                        (detail.approved === 5 &&
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
                          ) === 7) ||
                        (detail.approved === 0 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 1) ||
                        (detail.approved === 0 &&
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
                          ) === 7) ||
                        (detail.approved === 9 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 7)
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
                      ? formatThoiGianVe(detail.ThoiGianVe)
                      : "Chưa giao hàng"
                  }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Ngày KH đánh giá</div>
                <div class="field-value">
                  {{ detail.date_cre | moment("DD/MM/YYYY") }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Chi nhánh</div>
                <div class="field-value">
                  {{ detail.code_store }} - {{ detail.store_name }}
                </div>
              </div>
            </div>
            <div class="section-card">
              <div class="section-header">
                <i class="el-icon-setting"></i>
                <h3>THÔNG TIN XỬ LÝ</h3>
              </div>
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
                v-if="detail.nhanvien && detail.nhanvien.length > 0"
              >
                <template v-for="(a, i) in detail.nhanvien">
                  <div class="field-label">NV giao nhận</div>
                  <div class="field-value">
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
                <div class="field-label">NV thu ngân</div>
                <div class="field-value">N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">NV bảo hành/lắp đặt</div>
                <div class="field-value">N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">NV quản lý</div>
                <div class="field-value">N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Thời gian xử lý</div>

                <div
                  class="field-value"
                  v-if="
                    detail.time_handle !== null && detail.time_handle !== ''
                  "
                >
                  {{ detail.time_handle | moment("DD/MM/YYYY HH:mm:ss") }}
                </div>
                <div class="field-value empty" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Nội dung đánh giá</div>
                <div
                  class="field-value"
                  v-if="
                    detail.description &&
                    detail.description !== null &&
                    detail.description !== ''
                  "
                >
                  {{ detail.description }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <!-- <div class="field-group">
                <div class="field-label">Chi nhánh xử lý ticket</div>
                <div class="field-value">
                  <span v-if="!!detail.code_store_rate">
                    {{ detail.code_store_rate }} - {{ detail.store_name_rate }}
                  </span>
                  <span v-else>N/A</span>
                </div>
              </div> -->
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
              <!-- <div class="field-group">
                <div class="field-label">Chi nhánh xử lý</div>
                <div class="field-value" v-if="stores">
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
                <div class="field-value" v-else>N/A</div>
              </div> -->
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
                <div class="field-value">
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
              </div>
              <div class="field-group">
                <div class="field-label">Nội dung giải trình</div>
                <div class="field-value">
                  <div class="call-button-container">
                    <el-input
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
                        (detail.approved === 9 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 7) ||
                        (detail.approved === 9 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 1)
                      "
                      v-model="note_user"
                      type="textarea"
                      placeholder="Please input"
                    />
                    <template v-else>
                      <span
                        v-if="
                          detail.flag_content !== null &&
                          detail.flag_content.note_user
                        "
                        >{{ detail.flag_content.note_user }}</span
                      >
                    </template>
                  </div>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Thời gian hẹn</div>
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
                  style="width: 100%"
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
                <div class="field-label">Nội dung gửi cho <br />giao nhận</div>
                <div class="field-value">
                  <div class="call-button-container">
                    <el-input
                      v-if="
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 2 ||
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 1 ||
                        (detail.approved === 9 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 7)
                      "
                      v-model="personnel_note"
                      type="textarea"
                      placeholder="Please input"
                    />
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
                        ) === 1) ||
                      (detail.approved === 9 &&
                        Number(
                          user
                            .find((a) => a.split('=')[0] === 'rule')
                            .split('=')[1]
                        ) === 7) ||
                      (detail.approved === 9 &&
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
                  <div class="personnel-input-group">
                    <el-input
                      v-model="personnel_name"
                      placeholder="Nhập mã NV"
                      @input.native="changeMnv"
                    />
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
                          ) === 1) ||
                        (detail.approved === 9 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 7) ||
                        (detail.approved === 9 &&
                          Number(
                            user
                              .find((a) => a.split('=')[0] === 'rule')
                              .split('=')[1]
                          ) === 1)
                      "
                      size="small"
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
                        placeholder="Nhập mã NV"
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
              </div>
              <div class="field-group">
                <div class="field-label">Note xử lý KH</div>
                <div class="field-value">
                  <div class="el-textarea el-input--medium">
                    <textarea
                      autocomplete="off"
                      placeholder="Nhập note"
                      rows="3"
                      class="el-textarea__inner"
                      style="min-height: 33px"
                    ></textarea
                    ><!---->
                  </div>
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
                  <span v-else>0</span>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Tên thẩm định</div>
                <div class="field-value">
                  <span v-if="detail.name_user_expertise !== ''">
                    {{ detail.name_user_expertise }}
                  </span>
                  <span v-else>N/A</span>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Tên user</div>
                <div class="field-value">
                  <span
                    v-if="
                      detail.name_user &&
                      detail.name_user !== null &&
                      detail.name_user !== ''
                    "
                  >
                    {{ detail.name_user }}
                  </span>
                  <span v-else>N/A</span>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Nhận xét hướng xử lý</div>
                <div class="field-value">
                  <div class="el-textarea el-input--medium">
                    <el-input
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
                      v-model="note_user_expertise"
                      type="textarea"
                      placeholder="Please input"
                    />
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
            </div>
          </div>
          <div class="section-card">
            <div class="section-header" style="margin-bottom: 0">
              <i class="el-icon-paperclip" style="margin-right: 5px"></i>
              <h3>TÀI LIỆU ĐÍNH KÈM</h3>
            </div>
            <div class="section-content">
              <div
                class="box full"
                style="
                  width: 100%;
                  border-top: 1px dotted #dcdfe6;
                  padding-top: 10px;
                "
                v-if="records.TotalItem > 0"
              >
                <h3>Record</h3>
                <el-table
                  :data="records.data"
                  style="width: 100%"
                  class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium"
                >
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
                        <!-- <el-button
                          style="margin: 0 10px"
                          type="primary"
                          @click="
                            handleDetail2(true, scope.row.content.logRecord)
                          "
                          >Xem chi tiết</el-button
                        > -->
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
                          @click="
                            handleDetail(true, scope.row.content.linkedid)
                          "
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
                    (detail.approved === 9 &&
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
                    (detail.approved === 9 &&
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
                    (detail.approved === 9 &&
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
                    (detail.approved === 9 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1)
                  "
                >
                  <h3>File ghi âm</h3>
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
                    <h3>File ghi âm</h3>
                    <a
                      target="_blank"
                      style="color: blue"
                      :href="
                        'http://apitk.stdmcl.com:8099/public/uploads/' +
                        detail.id +
                        '/' +
                        detail.mp3
                      "
                      >Link ghi âm</a
                    >
                  </div>
                </template>

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
                    (detail.approved === 9 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1) ||
                    (detail.approved === 9 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) === 1)
                  "
                >
                  <h3>File PDF</h3>
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
                    <h3>File PDF</h3>
                    <a
                      target="_blank"
                      style="color: blue"
                      :href="
                        'http://apitk.stdmcl.com:8099/public/uploads/' +
                        detail.id +
                        '/' +
                        detail.pdf +
                        '.pdf'
                      "
                      >Link PDF</a
                    >
                  </div>
                </template>
                <div class="box">
                  <h3>Log</h3>
                  <el-button
                    type="primary"
                    size="small"
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
            <div class="section-content">
              <div v-if="!is_loading" class="box-detail">
                <div
                  v-if="detail.rate !== 0 && detail.rate !== null"
                  class="box"
                >
                  <h3>Thẩm định đánh giá độ hài lòng</h3>
                  <p>{{ detail.rate }}/5 sao</p>
                </div>

                <div class="box full" style="display: block">
                  <div class="field-label">
                    Chi tiết biên nhận {{ detail.pbn }}
                  </div>
                  <div class="field-value" style="margin-top: 10px">
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
                <div
                  class="box full"
                  style="display: block"
                  v-if="detail.flag_content && detail.flag_content.vat_tu"
                >
                  <div class="field-label">Chi tiết vật tư tạo ticket</div>
                  <div class="field-value" style="margin-top: 10px">
                    <el-table :data="detail.flag_content.vat_tu" border>
                      <el-table-column label="Sản phẩm">
                        <template slot-scope="scope">
                          <span style="color: blue">{{ scope.row.Name }}_</span
                          ><span style="color: red">{{ scope.row.Code }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="Số lượng" width="100">
                        <template slot-scope="scope">
                          {{ scope.row.Quantity }}
                        </template>
                      </el-table-column>
                      <el-table-column label="Giá" width="100">
                        <template slot-scope="scope">
                          {{ formatPrice(scope.row.Price) }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="box full" style="display: block; width: 100%">
                  <div class="field-label">Chi tiết vật tư</div>
                  <div
                    v-for="a in chitietgiavattu"
                    :key="a.id"
                    class="supply-detail-card"
                  >
                    <div class="supply-grid">
                      <div class="supply-field">
                        <h3 class="supply-field-label">Tên sản phẩm</h3>
                        <p class="supply-field-value">
                          <span class="supply-product-name">{{
                            a.productName
                          }}</span>
                          <span class="supply-product-code">{{
                            a.productCode
                          }}</span>
                        </p>
                      </div>
                      <div class="supply-field">
                        <h3 class="supply-field-label">PBN</h3>
                        <p class="supply-field-value">{{ a.orderCode }}</p>
                      </div>
                      <div class="supply-field">
                        <h3 class="supply-field-label">NV giao nhận</h3>
                        <p class="supply-field-value">
                          {{ a.deliveryStaffCode }}
                        </p>
                      </div>
                      <div class="supply-field">
                        <h3 class="supply-field-label">Giá</h3>
                        <p class="supply-field-value supply-field-value--price">
                          {{ formatPrice(a.amount) }}Đ
                        </p>
                      </div>
                    </div>

                    <div
                      style="
                        display: flex;
                        gap: 10px;
                        border-top: 1px solid var(--sd-border);
                      "
                    >
                      <div
                        style="width: 50%"
                        class="supply-table-section"
                        v-if="!!a.materials.length"
                      >
                        <h3 class="supply-table-title">Bảng vật tư hiện tại</h3>
                        <el-table :data="a.materials" border>
                          <el-table-column label="Sản phẩm">
                            <template slot-scope="scope">
                              <span class="supply-product-name">{{
                                scope.row.name
                              }}</span>
                              <span class="supply-product-code">{{
                                scope.row.code
                              }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column label="Số lượng" width="80">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.quantity" />
                            </template>
                          </el-table-column>
                          <el-table-column label="Giá" width="110">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.price" />
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>

                      <div
                        class="supply-table-section"
                        style="width: 50%"
                        v-if="!!a.services.length"
                      >
                        <h3 class="supply-table-title">Bảng giá tiền công</h3>
                        <el-table :data="a.services" border>
                          <el-table-column label="Sản phẩm">
                            <template slot-scope="scope">
                              <span class="supply-product-name">{{
                                scope.row.name
                              }}</span>
                              <span class="supply-product-code">{{
                                scope.row.code
                              }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column label="Số lượng" width="80">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.quantity" />
                            </template>
                          </el-table-column>
                          <el-table-column label="Giá" width="110">
                            <template slot-scope="scope">
                              {{ formatPrice(scope.row.price) }}Đ
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 16px;
                      "
                    >
                      <div class="supply-checkbox-group">
                        <div class="supply-checkbox-item">
                          <h3 class="supply-checkbox-label">Bao vật tư</h3>
                          <el-checkbox v-model="a.isFreeMaterial" />
                        </div>
                        <div class="supply-checkbox-item">
                          <h3 class="supply-checkbox-label">
                            Bao công lắp đặt
                          </h3>
                          <el-checkbox v-model="a.isFreeService" />
                        </div>
                      </div>

                      <div
                        class="supply-actions"
                        v-if="
                          (detail.approved === 0 &&
                            Number(
                              user
                                .find((a) => a.split('=')[0] === 'rule')
                                .split('=')[1]
                            ) === 1) ||
                          (detail.approved === 0 &&
                            Number(
                              user
                                .find((a) => a.split('=')[0] === 'rule')
                                .split('=')[1]
                            ) === 2) ||
                          (detail.approved === 9 &&
                            Number(
                              user
                                .find((a) => a.split('=')[0] === 'rule')
                                .split('=')[1]
                            ) === 1) ||
                          (detail.approved === 9 &&
                            Number(
                              user
                                .find((a) => a.split('=')[0] === 'rule')
                                .split('=')[1]
                            ) === 7)
                        "
                      >
                        <el-button
                          type="primary"
                          @click="handleUpdateVatu(a)"
                          size="small"
                          >Cập nhật thay đổi</el-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

    <!-- Log Popup Dialog -->
    <LogPopup
      :visible="dialogLogVisible"
      :log="log"
      :pagelog="pagelog"
      :loading="loading"
      :detail-id="detail.id"
      :user-rule="
        user.find((a) => a.split('=')[0] === 'rule')
          ? user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
          : ''
      "
      @close="dialogLogVisible = false"
      @load-more="handleLog"
    />
  </div>
</template>

<script>
import DetailNew from "./Detailnew.vue";
import LogPopup from "../Popup/LogPopup.vue";
import StaffPopup from "../Popup/Staff.vue";
import {
  updateTicket,
  updateRecord,
  getListsRecords,
  getLog,
  cloneticket,
  saveStore,
  luunotexuly,
  saveQcdanhgia,
  updateVattu,
} from "@/api/ticket";
import callGuard from "@/utils/callGuard";
import { Message } from "element-ui";
import { getUser } from "@/utils/auth.js";
import { getlists } from "@/api/department";
import "./supplies-detail.css";

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
      dialogLogVisible: false,
      coupon: "",
      note_user: "",
      record: "",
      phone: "",
      note_user_expertise: "",
      rate: null,
      loading: false,
      personnel_name: "",
      personnel_note: "",

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

      is_loading: false,

      personnel: [],

      file: 0,
      pdf: 0,

      tienphat: 0,

      vattu: [],

      detailnew: null,
      url: url,

      note_bgd: "",

      chiphigiasanpham: [],
      chitietgiavattu: [],

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
          }
        }
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

    const res = await fetch(
      "http://apitk.stdmcl.com:8099/restful/checkpbn?sophieu=" + this.detail.pbn
    );
    const json = await res.json();

    if (json.status === 200 && json.result2 !== null) {
      this.detail.ngaygiaohang = json.result2.NgayGiaoNhan;
      this.detail.nhanvien = json.result2.NhanVien;
      this.detail.ngaytaophieu = json.result2.NgayTaoPhieu;
      this.detail.tnvbh = json.result2.TenNVBH;
      this.detail.mnvbh = json.result2.MaNVBH;
      this.detail.nvgn = json.result2.NhanVien;
      this.detail.NhanVienDieu = json.result2.NhanVienDieu;
      this.detail.ThoiGianVe = json.result2.ThoiGianVe;

      if (json.result2?.dataJson) {
        this.detail.saleReceiptDetailDto = JSON.parse(
          json.result2?.dataJson
        ).SaleReceiptDetailDto;
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

    const res3 = await fetch(
      "http://apitk.stdmcl.com:8099/restful/getgiavattu?sophieu=" +
        this.detail.pbn
    );

    const json3 = await res3.json();
    if (!!json3.result2 && !!json3.result2?.data.length) {
      json3.result2.data.forEach((m) => {
        m.materials.forEach((b) => {
          this.vattu.push(b);
        });
        m.services.forEach((b) => {
          this.chiphigiasanpham.push(b);
        });
        this.chitietgiavattu.push(m);
      });
    }

    this.is_loading = false;
  },

  methods: {
    // ThoiGianVe dạng M/D/YYYY ... -> đổi thành D/M/YYYY ..., giữ nguyên phần giờ
    formatThoiGianVe(value) {
      const [date, ...time] = value.split(" ");
      const [m, d, y] = date.split("/");
      return [`${d}/${m}/${y}`, ...time].join(" ");
    },
    handleUpdateVatu(a) {
      let data = {
        isFreeService: a.isFreeService,
        isFreeMaterial: a.isFreeMaterial,
        materials: a.materials,
        serviceQuantity: !!a.services.length
          ? Number(a.services.reduce((a, b) => a + b.quantity, 0))
          : 0,
        serviceCodes: a.services.map((m) => m.code),
      };
      //  fetch("http://delivery-api.stdmcl.com:5001/Integrate/InstallTicket/"+a.id, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   'api-key':'PNV77aHKTHKISVJh'
      //   },
      //   body: JSON.stringify(data),
      // })
      // .then((res) => {

      //   if(res.status === 200){
      //     Message({
      //       message: "Cập nhật thành công",
      //       type: "success",
      //       duration: 5 * 1000,
      //     });
      //   }else {
      //     Message({
      //       message: "Cập nhật không thành công",
      //       type: "error",
      //       duration: 5 * 1000,
      //     });
      //   }
      // })
      updateVattu(data, a.id)
        .then((res) => {
          if (res.http_code === 200) {
            Message({
              message: "Cập nhật thành công",
              type: "success",
              duration: 5 * 1000,
            });
          } else {
            Message({
              message: JSON.stringify(res?.response_be?.error),
              type: "error",
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
      data.forEach((a) => {
        arr.push({
          src:
            this.process +
            "/public/uploads/" +
            this.detail.id +
            "/" +
            a +
            ".png.webp",
          thumbnail:
            this.process +
            "/public/uploads/" +
            this.detail.id +
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
      } else if (rule === 13) {
        return "Đã xử lý app";
      } else if (rule === 9) {
        return "Vật tư";
      } else if (rule === 10) {
        return "Hợp lệ";
      } else if (rule === 11) {
        return "Cho phép chỉnh sửa";
      } else if (rule === 12) {
        return "Đã xử lý phiếu biên nhận tương ứng";
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

      if (
        (approved === 10 && this.personnel_note === "") ||
        (approved === 11 && this.personnel_note === "")
      ) {
        this.$notify({
          title: "Warning",
          message: "Nội dung gửi cho giao nhận không để trống !!",
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
      this.loading = true;
      const formData = new FormData();
      formData.append("id", id);
      formData.append("approved", approved);
      formData.append("status", 1);
      formData.append("phone", this.phone);
      formData.append("personnel_note", this.personnel_note);
      if (this.detail.approved === 2) {
        formData.append("coupon", this.coupon);
        formData.append("rate", this.rate);
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
          ) === 1) ||
        (this.detail.approved === 9 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 7) ||
        (this.detail.approved === 9 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1)
      ) {
        formData.append("note_user", this.note_user);

        if (this.mnv !== null) {
          formData.append("personnel_name", this.personnel_name.trim());
        }



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
        formData.append("type_xu_ly", this.type_xu_ly);
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
      this.dialogLogVisible = true;
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
        url +
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
    formatPrice(value) {
      if (value)
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      return 0;
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
  },
};
</script>

<style>
@import "../Popup/Popup.css";
.box .hide {
  display: none;
}
.full .el-table__row td:last-child .cell {
  display: block;
  max-height: none;
}
</style>
