<template>
  <div>
    <el-dialog
      :top="'10px'"
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
            </div>
            <div class="popup-actions">
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
                <h3>THÔNG TIN KHÁCH HÀNG & THÔNG TIN PHIẾU</h3>
              </div>
              <div class="field-group">
                <div class="field-label">Tên KH</div>
                <div class="field-value">{{ detail.name }}</div>
              </div>
              <div class="field-group">
                <div class="field-label">PBN</div>
                <div class="field-value">{{ detail.pbn }}</div>
              </div>
              <div class="field-group">
                <div class="field-label">Ngày tạo PBN</div>
                <div class="field-value">
                  {{ detail.ngaytaophieu | moment("DD/MM/YYYY HH:mm:ss") }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Địa chỉ</div>
                <div class="field-value">
                  {{ detail.address2 || "N/A" }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">SDT</div>
                <div class="field-value">
                  <div style="display: flex">
                    <el-input v-model="phone" placeholder="Please input" />
                    <span
                      v-if="
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
                          ) === 7)
                      "
                      style="width: 100%; display: inline-block"
                    >
                      <el-button
                        size="small"
                        v-loading="loading"
                        type="success"
                        icon="el-icon-phone"
                        style="font-size: 16px; width: 130px"
                        @click="handleCall(userCall, 1)"
                        >Gọi</el-button
                      >
                    </span>
                  </div>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Ngày giao hàng</div>
                <div class="field-value" v-if="!!detail.ngaygiaohang">
                  {{ detail.ngaygiaohang | moment("DD/MM/YYYY") }}
                  <span
                    v-if="detail.khung_gio !== null && detail.khung_gio !== ''"
                    >{{ detail.khung_gio }}</span
                  >
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>

              <div class="field-group">
                <div class="field-label">Tên trạng thái phiếu</div>
                <div class="field-value">
                  {{ detail.TTPName }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Số trạng thái phiếu</div>
                <div class="field-value">
                  {{ detail.TTP }}
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">NV bán hàng</div>
                <div
                  class="field-value"
                  v-if="!!detail.mnvbh && !!detail.tnvbh"
                >
                  {{ detail.mnvbh ? detail.mnvbh : "N/A" }} -
                  {{ detail.tnvbh ? detail.tnvbh : "N/A" }}
                </div>
              </div>
              <template v-if="!is_loading">
                <template
                  v-if="
                    !!detail.nhanvien.length &&
                    detail.NhomNhanVienGh.length === 0
                  "
                >
                  <template
                    v-if="detail.nhanvien && detail.nhanvien.length > 0"
                  >
                    <div
                      class="field-group"
                      v-for="(a, i) in detail.nhanvien"
                      :key="Math.random() + i"
                    >
                      <div class="field-label">NV giao nhận</div>
                      <div class="field-value">
                        {{ a.MaNhanVien }} - {{ a.TenNhanVien }}
                      </div>
                    </div>
                  </template>
                  <div v-else class="field-group">
                    <div class="field-label">NV giao nhận</div>
                    <div class="field-value">N/A</div>
                  </div>
                </template>
                <template v-else>
                  <template
                    v-if="
                      detail.NhomNhanVienGh && detail.NhomNhanVienGh.length > 0
                    "
                  >
                    <div
                      class="field-group"
                      v-for="(a, i) in detail.NhomNhanVienGh"
                      :key="Math.random() + i"
                    >
                      <div class="field-label">NV giao nhận</div>
                      <div class="field-value">
                        {{ a.Maxe }} - {{ a.NhomNhanVien }} - {{ a.Phone }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="field-group">
                      <div class="field-label">NV giao nhận</div>
                      <div class="field-value">N/A</div>
                    </div>
                  </template>
                </template>
              </template>

              <div class="field-group">
                <div class="field-label">SĐT NV giao nhận</div>
                <div class="field-value" style="display: flex">
                  <el-input v-model="phoneNv" placeholder="Please input" />
                  <span
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
                        ) === 7)
                    "
                    style="width: 100%; display: inline-block"
                  >
                    <el-button
                      size="small"
                      v-loading="loading"
                      type="warning"
                      icon="el-icon-phone"
                      style="font-size: 16px; width: 120px"
                      @click="handleCall(userCall, 0)"
                      >Gọi NV</el-button
                    >
                  </span>
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">NV điều phối</div>
                <div class="field-value" v-if="!!detail.NhanVienDieu">
                  {{ detail.NhanVienDieu }} - {{ detail.TenNhanVienDieu }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
            </div>
            <div class="section-card">
              <div class="section-header">
                <i class="el-icon-setting"></i>
                <h3>THÔNG TIN XỬ LÝ</h3>
              </div>
              <div class="field-group">
                <div class="field-label">Lý do giao trễ</div>
                <div
                  class="field-value"
                  v-if="!!detail.description"
                  style="word-break: break-word"
                >
                  {{ detail.description }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Chi nhánh bán</div>
                <div class="field-value">
                  {{ detail.code_store_rate }} - {{ detail.store_name_rate }}
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">Chi nhánh giao hàng</div>
                <div class="field-value">
                  {{ detail.code_store_giao_hang }} -
                  {{ detail.store_name_giao_hang }}
                </div>
              </div>

              <!-- <div class="field-group">
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
              <!-- <div class="field-group">
                <div class="field-label">Chi nhánh xử lý ticket</div>
                <div class="field-value">
                  {{ detail.code_store_rate }} - {{ detail.store_name_rate }}
                </div>
              </div> -->
              <!-- <div class="field-group">
                <div class="field-label">Chi nhánh xử lý</div>
                <div class="field-value">
                  <span v-if="!!detail.code_store_rate">{{
                    detail.code_store_rate + " - " + detail.store_name_rate
                  }}</span>
                  <span v-else>N/A-</span>
                </div>
              </div> -->
              <!-- <div class="field-group">
                <div class="field-label">CN có NV vi phạn</div>
                <div class="field-value">
                  <span v-if="!!detail.code_store">{{
                    detail.code_store + " - " + detail.store_name
                  }}</span>
                  <span v-else>N/A-</span>
                </div>
              </div> -->

              <div class="field-group">
                <div class="field-label">Ngày tạo</div>
                <div class="field-value" v-if="!!detail.created_at">
                  {{ detail.created_at | moment("DD/MM/YYYY HH:mm") }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Ngày cập nhật</div>
                <div class="field-value" v-if="!!detail.updated_at">
                  {{ detail.updated_at | moment("DD/MM/YYYY HH:mm") }}
                </div>
                <div class="field-value" v-else>N/A</div>
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
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Tên user</div>
                <div
                  class="field-value"
                  v-if="
                    detail.name_user &&
                    detail.name_user !== null &&
                    detail.name_user !== ''
                  "
                >
                  {{ detail.name_user }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Tên QC</div>
                <div
                  class="field-value"
                  v-if="
                    detail.name_user_create &&
                    detail.name_user_create !== null &&
                    detail.name_user_create !== ''
                  "
                >
                  {{ detail.name_user_create }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Số lần xử lý lại</div>
                <div
                  class="field-value"
                  v-if="
                    detail.flag_content !== null &&
                    detail.flag_content.num_processing
                  "
                >
                  {{ detail.flag_content.num_processing }}
                </div>
                <div class="field-value" v-else>0</div>
              </div>
              <div class="field-group">
                <div class="field-label">Thời gian hẹn lại</div>
                <div class="field-value">
                  {{ detail.thoi_gian_hen_lai || 0 }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Thời gian đến nhà khách</div>
                <div class="field-value" v-if="!!detail.ngay_den_nha_khach">
                  {{ detail.ngay_den_nha_khach || 0 }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Số lần gửi ticket</div>
                <div class="field-value" v-if="!!detail.so_lan_gui_ticket">
                  {{ detail.so_lan_gui_ticket || 0 }}
                </div>
              </div>
              <div class="field-group" v-if="detail.approved === 9">
                <div class="field-label">Vị trí giao nhận</div>
                <div class="field-value">
                  <el-button
                    size="small"
                    type="success"
                    style="font-size: 16px; width: 130px"
                    @click="dialogVisibleMap = true"
                    >Xem</el-button
                  >
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
                <div class="field-label">Nội dung <br />từ ban giám đốc</div>
                <div class="field-value" style="display: flex">
                  <el-input
                    v-model="note_bgd"
                    type="textarea"
                    placeholder="Nội dung"
                  />
                  <el-button
                    v-loading="loading"
                    type="warning"
                    style="font-size: 16px; width: 100px"
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
              <div class="field-group">
                <div class="field-label">QC gửi giao nhận</div>
                <div
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
                    placeholder="Nội dung"
                  />
                  <div
                    style="
                      display: flex;
                      margin-top: 10px;
                      gap: 10px;
                      flex-wrap: wrap;
                    "
                  >
                    <div>
                      <b style="font-size: 14px">Ngày hẹn</b>
                      <el-date-picker
                        style="margin-top: 5px; display: block"
                        v-model="ngay_hen"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="dd-MM-yyyy"
                        placeholder="Chọn ngày"
                      />
                    </div>
                    <div style="display: flex; gap: 10px">
                      <div>
                        <b style="font-size: 14px">Từ</b>
                        <el-time-picker
                          style="margin-top: 5px; display: block; width: 120px"
                          v-model="gio_bat_dau"
                          value-format="HH:mm"
                          format="HH:mm"
                          placeholder="Từ giờ"
                        />
                      </div>
                      <div>
                        <b style="font-size: 14px">Đến</b>
                        <el-time-picker
                          style="margin-top: 5px; display: block; width: 120px"
                          v-model="gio_ket_thuc"
                          value-format="HH:mm"
                          format="HH:mm"
                          placeholder="Đến giờ"
                        />
                      </div>
                    </div>
                    <div>
                      <b>Số lần hẹn</b>
                      <el-input-number
                        style="width: auto; margin-top: 5px; display: block"
                        v-model="so_lan_hen_ticket"
                        class="mx-4"
                        :min="0"
                        controls-position="right"
                      />
                    </div>
                  </div>
                  <el-button
                    type="success"
                    icon="el-icon-save"
                    :loading="loading"
                    style="margin-top: 5px"
                    @click="saveQcdanhgia"
                    >Lưu</el-button
                  >
                </div>
                <div v-else>
                  <div>{{ personnel_note }}</div>
                  <div
                    class="display: flex; margin-top: 10px; gap: 10px; flex-wrap: wrap;"
                  >
                    <div>
                      <b
                        style="
                          font-size: 14px;
                          display: block;
                          margin-bottom: 7px;
                        "
                        >Ngày hẹn</b
                      >
                      <div
                        style="
                          display: flex;
                          gap: 5px;
                          font-size: 14px;
                          margin-bottom: 7px;
                        "
                      >
                        Từ giờ:
                        <div>{{ ngay_hen || "N/A" }} {{ gio_bat_dau }}</div>
                      </div>
                      <div
                        style="
                          display: flex;
                          gap: 5px;
                          font-size: 14px;
                          margin-bottom: 7px;
                        "
                      >
                        Đến giờ:
                        <div>{{ ngay_hen || "N/A" }} {{ gio_ket_thuc }}</div>
                      </div>
                      <b
                        style="
                          font-size: 14px;
                          display: block;
                          margin-bottom: 7px;
                        "
                        >Số lần hẹn</b
                      >
                      <div style="font-size: 14px; display: block">
                        {{ so_lan_hen_ticket || "N/A" }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <p v-else>
                  <span
                    v-if="
                      detail.flag_content !== null &&
                      detail.flag_content.personnel_note
                    "
                    >{{ detail.flag_content.personnel_note }}</span
                  >
                </p> -->
              </div>
              <div class="field-group">
                <div class="field-label">Nội dung giải trình</div>
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
                  <el-input
                    v-model="note_user"
                    type="textarea"
                    placeholder="Please input"
                  />
                </div>
                <div v-else class="field-value">
                  <template
                    v-if="
                      detail.flag_content !== null &&
                      detail.flag_content.note_user
                    "
                    >{{ detail.flag_content.note_user }}</template
                  >
                  <template v-else>N/A</template>
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
                <div class="field-label">
                  Mã NV vi phạm
                  <el-button
                    size="small"
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
                    style="width: 100px; margin-left: 10px"
                    @click="addPersonnel"
                    >Add</el-button
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
                  !!detail.coupon
                "
              >
                <div class="field-label">Cách khắc phục</div>
                <div class="field-value">
                  {{ detail.coupon }}
                </div>
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
              <div class="field-group" v-if="!!detail.flag_content.lat">
                <div class="field-label">Lat</div>
                <div class="field-value">
                  {{ detail.flag_content.lat }}
                </div>
              </div>
              <div class="field-group" v-if="!!detail.flag_content.lng">
                <div class="field-label">Lng</div>
                <div class="field-value">
                  {{ detail.flag_content.lng }}
                </div>
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
                <div class="field-label" style="color: red">Tiền phạt</div>
                <div class="field-value">
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
              </div>
              <div class="field-group" v-else>
                <div class="field-label" style="color: red">Tiền phạt</div>
                <div class="field-value" v-if="!!detail.tienphat">
                  {{ detail.tienphat }}
                </div>
                <div class="field-value" v-else>0</div>
              </div>
            </div>
            <div class="section-card">
              <div class="section-header">
                <i class="el-icon-star-off"></i>
                <h3>ĐÁNH GIÁ &amp; THẨM ĐỊNH</h3>
              </div>
              <div class="field-group">
                <div class="field-label">Tiêu chí đánh giá</div>
                <div
                  class="field-value"
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
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Đánh giá độ hài lòng</div>
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
                  <el-rate v-model="rate" />
                </div>
                <div class="field-value" v-else>---</div>
              </div>
              <div class="field-group">
                <div class="field-label">Tên thẩm định</div>
                <div
                  class="field-value"
                  v-if="detail.name_user_expertise !== ''"
                >
                  {{ detail.name_user_expertise }}
                </div>
                <div class="field-value" v-else>N/A</div>
              </div>
              <div class="field-group">
                <div class="field-label">Nhận xét hướng xử lý</div>
                <div
                  class="field-value"
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
                </div>
                <div v-else class="field-value">
                  <template
                    v-if="
                      detail.flag_content !== null &&
                      detail.flag_content.note_user_expertise
                    "
                    >{{ detail.flag_content.note_user_expertise }}</template
                  >
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

              <div class="field-group" v-if="!!detail.rate">
                <div class="field-label">Thẩm định đánh giá độ hài lòng</div>
                <div class="field-value">
                  {{ detail.rate }}
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <i class="el-icon-document"></i>
              <h3>TÀI LIỆU ĐÍNH KÈM</h3>
            </div>
            <div class="field-content">
              <div
                class="box"
                style="
                  width: 100%;
                  border-top: 1px dotted rgb(220, 223, 230);
                  padding-top: 10px;
                "
              >
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
                    <el-table-column label="KH/NV">
                      <template slot-scope="scope">
                        <span
                          v-if="
                            !!scope.row.flag_index &&
                            scope.row.flag_index.is_nv == 1
                          "
                          >Nhân viên</span
                        >
                        <span v-else>Khách hàng</span>
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
                </p>
                <p v-else>N/A</p>
              </div>
              <div class="flex-style">
                <div class="box">
                  <h3>Hình ảnh</h3>
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

                  <template v-if="detail.multi_picture !== null">
                    <vue-picture-swipe
                      :items="listImages(detail.multi_picture)"
                    />
                  </template>
                  <span v-else>N/A</span>
                </div>
                <div class="box">
                  <h3>File ghi âm</h3>
                  <el-upload
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
                  <template v-else>
                    <a
                      v-if="!!detail.mp3"
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
                    <span v-else>N/A</span>
                  </template>
                </div>
                <div class="box">
                  <h3>File PDF</h3>
                  <el-upload
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
                    accept=".pdf"
                    :on-change="handleChangePdf"
                  >
                    <el-button slot="trigger" size="small" type="primary"
                      >Chọn file</el-button
                    >
                  </el-upload>
                  <template v-else>
                    <a
                      v-if="!!detail.pdf"
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
                    <span v-else>N/A</span>
                  </template>
                </div>
                <div class="box">
                  <h3>Log</h3>
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-document"
                    @click="
                      dialogVisibleLog = true;
                      if (log === null) {
                        handleLog({ id: detail.id, page: 1 });
                      }
                    "
                    >Xem Log</el-button
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="section-card" style="margin-top: 20px">
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
        <!-- <div v-if="!is_loading" class="box-detail">
          <template
            v-if="
              !!detail.nhanvien.length && detail.NhomNhanVienGh.length === 0
            "
          >
            <template v-if="detail.nhanvien && detail.nhanvien.length > 0">
              <template v-for="(a, i) in detail.nhanvien">
                <div :key="Math.random() + i" class="box">
                  <h3>Mã NV giao nhận</h3>
                  <p>{{ a.MaNhanVien }}</p>
                </div>
                <div :key="Math.random() + i" class="box">
                  <h3>Tên NV giao nhận</h3>
                  <p>{{ a.TenNhanVien }}</p>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="box">
                <h3>Mã NV giao nhận</h3>
                <p>---</p>
              </div>
              <div class="box">
                <h3>Tên NV giao nhận</h3>
                <p>---</p>
              </div>
            </template>
          </template>
          <template v-else>
            <template
              v-if="detail.NhomNhanVienGh && detail.NhomNhanVienGh.length > 0"
            >
              <div
                v-for="(a, i) in detail.NhomNhanVienGh"
                style="width: 100%; display: flex; flex-wrap: wrap"
                :key="Math.random() + i"
              >
                <div class="box">
                  <h3>Mã NV giao nhận</h3>
                  <p>{{ a.Maxe }}</p>
                </div>
                <div class="box">
                  <h3>Tên - SĐT NV giao nhận</h3>
                  <p>{{ a.NhomNhanVien }} - {{ a.Phone }}</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="box">
                <h3>Mã NV giao nhận</h3>
                <p>---</p>
              </div>
              <div class="box">
                <h3>Tên - SĐT NV giao nhận</h3>
                <p>---</p>
              </div>
            </template>
          </template>
        </div> -->
      </div>
    </el-dialog>

    <LogPopup
      :visible="dialogVisibleLog"
      :log="log"
      :pagelog="pagelog"
      :loading="loading"
      :detailId="detail.id"
      :userRule="userRule"
      @close="dialogVisibleLog = false"
      @load-more="handleLog"
    />

    <MapPopup
      :visible="dialogVisibleMap"
      :pbn="detail.pbn"
      @close="dialogVisibleMap = false"
    />

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
import LogPopup from "../Popup/LogPopup.vue";
import MapPopup from "./Map.vue";
import {
  updateTicket,
  updateRecord,
  getListsRecords,
  getLog,
  cloneticket,
  saveStore,
  luunotexuly,
  saveQcdanhgia,
} from "@/api/ticket";
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
  props: ["dialogVisible", "lists", "detail", "page", "stores"],
  components: { DetailNew, LogPopup, MapPopup },
  data() {
    return {
      dialogVisibleDetail: false,
      dialogVisibleLog: false,
      dialogVisibleMap: false,
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

      so_lan_hen_ticket: 0,
      ngay_hen: "", // ngày hẹn (yyyy-MM-dd)
      gio_bat_dau: "", // giờ bắt đầu (HH:mm)
      gio_ket_thuc: "", // giờ kết thúc (HH:mm)

      detailnew: null,
      url: url,

      phoneNv: "",

      note_bgd: "",
      note_nhan_xet_xu_ly: "",
      note_nhan_vien_nhan_xet: "",
      type_xu_ly: 0,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
    userRule() {
      if (this.user && this.user.length > 0) {
        const rule = this.user.find((a) => a.split("=")[0] === "rule");
        if (rule) return rule.split("=")[1];
      }
      return "";
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
    if (this.detail.so_lan_hen_ticket !== null) {
      this.so_lan_hen_ticket = this.detail.so_lan_hen_ticket;
    }
    // Tách thời gian hẹn -> ngày + giờ bắt đầu / kết thúc
    const parseHen = (str) => {
      if (!str) return { date: "", time: "" };
      const [datePart, timePart = ""] = String(str).trim().split(" ");
      const seg = datePart.split(/[-/]/);
      let date = "";
      if (seg.length === 3) {
        const p = (n) => String(n).padStart(2, "0");
        // seg[0] dài 4 ký tự -> yyyy-MM-dd, ngược lại -> dd-MM-yyyy
        date =
          seg[0].length === 4
            ? `${seg[0]}-${p(seg[1])}-${p(seg[2])}`
            : `${seg[2]}-${p(seg[1])}-${p(seg[0])}`;
      }
      return { date, time: timePart ? timePart.slice(0, 5) : "" };
    };
    if (this.detail.thoi_gian_hen) {
      const s = parseHen(this.detail.thoi_gian_hen);
      this.ngay_hen = s.date;
      this.gio_bat_dau = s.time;
    }
    if (this.detail.thoi_gian_hen_2) {
      const e = parseHen(this.detail.thoi_gian_hen_2);
      if (!this.ngay_hen) this.ngay_hen = e.date;
      this.gio_ket_thuc = e.time;
    }

    if (!!this.detail.note_bgd) {
      this.note_bgd = this.detail.note_bgd;
    }
    if (this.detail.code_store !== this.detail.code_store_rate) {
      this.note_xu_ly_chi_nhanh = this.detail.note_xu_ly_chi_nhanh;
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

    getListsRecords(
      this.detail.cid_parent !== null && this.detail.cid_parent > 0
        ? this.detail.cid_parent
        : this.detail.id
    ).then((res) => {
      if (res.status === 200) {
        res.data.data.forEach((a) => {
          a.content.blobRecord = "";
          if (a.content.logRecord) {
            a.content.logRecord.fromDateTime = a.created_at;
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
      this.detail.TenNhanVienDieu = json.result2.TenNhanVienDieu;
      this.detail.NhomNhanVienGh = json.result2.NhomNhanVienGh;
      this.detail.TTPName = json.result2.TTPName;
      this.detail.TTP = json.result2.TTP;
      this.detail.address2 = json.result2.DiaChi;

      if (json.result2?.dataJson) {
        this.detail.saleReceiptDetailDto = JSON.parse(
          json.result2?.dataJson
        ).SaleReceiptDetailDto;
      }

      if (!!json.result2.NhanVien.length) {
        this.phoneNv = json.result2.NhanVien[0].DienThoai;
      } else if (!!json.result2.NhomNhanVienGh.length) {
        let nhanvien = json.result2.NhomNhanVienGh.find(
          (a) => a.Maxe === json.result2.MaSoXe
        );

        if (nhanvien) this.phoneNv = nhanvien.Phone;
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
      // Chặn double-click: đang gọi API thì bỏ qua các click tiếp theo
      if (this.loading) return false;
      if (approved === 4 && this.note_user === "") {
        this.$notify({
          title: "Warning",
          message: "Nhập lý do hủy tại note xử lý !!",
          type: "warning",
        });
        return false;
      }

      // Hoàn thành: bắt buộc có Mã NV vi phạm + Nội dung giải trình
      // (đã bỏ yêu cầu nhập Nội dung QC đánh giá - personnel_note)
      if (
        (approved === 2 && this.mnv === null) ||
        (approved === 2 && this.note_user === "")
      ) {
        this.$notify.error({
          title: "Error",
          message: "Thông tin mnv, Note xử lý KH không để trống !!",
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

      if (this.detail.approved === 2) {
        formData.append("coupon", this.coupon);
        formData.append("rate", this.rate);
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
      }).catch(() => {
        // API lỗi/timeout: mở khóa lại để có thể bấm gọi lại
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
    handleCall(data, isKh) {
      if (isKh === 1 && this.phone === "") {
        this.$notify({
          title: "Warning",
          message: "Số điện thoại không để trống !!",
          type: "warning",
        });
        return false;
      }
      if (isKh === 0 && this.phoneNv === "") {
        this.$notify({
          title: "Warning",
          message: "Số điện thoại không để trống !!",
          type: "warning",
        });
        return false;
      }
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
                  formData.append("is_nv", isKh);
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
                this.loading = false;
              });
          }
        })
        .catch((error) => console.error("Lỗi:", error));
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
    saveQcdanhgia() {
      // Bắt buộc nhập nội dung QC đánh giá
      if (!this.personnel_note || !this.personnel_note.trim()) {
        this.$notify.warning({
          title: "Cảnh báo",
          message: "Vui lòng nhập Nội dung QC đánh giá",
        });
        return false;
      }
      // Bắt buộc nhập đủ ngày hẹn + giờ bắt đầu + giờ kết thúc mới cho lưu
      if (!this.ngay_hen || !this.gio_bat_dau || !this.gio_ket_thuc) {
        this.$notify.warning({
          title: "Cảnh báo",
          message: "Vui lòng nhập đầy đủ Ngày hẹn, Giờ bắt đầu và Giờ kết thúc",
        });
        return false;
      }

      this.loading = true;

      // Chuẩn hoá: ngày yyyy-MM-dd, giờ HH:mm (chấp nhận cả Date lẫn string)
      const pad = (n) => String(n).padStart(2, "0");
      const toYmd = (dt) => {
        if (!dt) return "";
        if (dt instanceof Date)
          return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
            dt.getDate()
          )}`;
        return String(dt).slice(0, 10);
      };
      const toHm = (t) => {
        if (!t) return "";
        if (t instanceof Date)
          return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
        return String(t).slice(0, 5);
      };
      // Ghép ngày + giờ -> dd/MM/yyyy HH:mm
      const buildHen = (time) => {
        const ymd = toYmd(this.ngay_hen);
        const hm = toHm(time);
        if (!ymd || !hm) return "";
        // ymd đã là yyyy-MM-dd -> ghép giờ
        return `${ymd} ${hm}`;
      };
      const thoi_gian_hen = buildHen(this.gio_bat_dau); // bắt đầu
      const thoi_gian_hen_2 = buildHen(this.gio_ket_thuc); // kết thúc

      const formData = new FormData();
      formData.append("id", this.detail.id);
      formData.append("personnel_note", this.personnel_note);
      formData.append("so_lan_hen_ticket", this.so_lan_hen_ticket);
      formData.append("thoi_gian_hen", thoi_gian_hen);
      formData.append("thoi_gian_hen_2", thoi_gian_hen_2);

      saveQcdanhgia(formData)
        .then((res) => {
          if (res.status == 200) {
            Message({
              message: "Lưu thành công",
              type: "success",
              duration: 5 * 1000,
            });
            this.$parent.getLists(this.page);
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
.el-dialog__body {
  padding-top: 0;
}
</style>

<style scoped>
.box-detail .box h3,
.box-detail .box p {
  margin-bottom: 10px;
}
.box-detail .box {
  padding-bottom: 0;
}
</style>
