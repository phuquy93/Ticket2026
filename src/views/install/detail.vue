<template>
  <div>
    <div id="printMe" div class="detailprint" style="font-size: 16px">
      <template v-if="!is_loading">
        <div class="popup-header" style="flex-wrap: wrap">
          <div style="display: flex; align-items: center; gap: 15px">
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
              style="margin-bottom: 10px; font-size: 16px"
            >
              (Nội dung vi phạm và mã NV không có nên không thể ra biên bản)
            </h1>
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
              v-if="detail.approved === 3 && !is_loading"
              v-print="'#printMe'"
              type="danger"
              icon="el-icon-printer"
              >In</el-button
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
              detail.approved === 4 && !!detail.flag_content.note_user_expertise
            "
          >
            <strong>Lý do hủy:</strong
            ><span v-if="!!detail.flag_content.note_user_expertise">
              {{ detail.flag_content.note_user_expertise }},</span
            >
          </div>
        </div>
        <el-tabs v-model="mainTab" class="detail-tabs">
          <el-tab-pane label="Thông tin" name="info">
        <div class="popup-grid">
          <div style="display: flex; flex-direction: column; gap: 20px">
          <div class="section-card">
            <div class="section-header">
              <i class="el-icon-user"></i>
              <h3>THÔNG TIN KHÁCH HÀNG & THÔNG TIN PHIẾU</h3>
            </div>
            <div class="field-group">
              <div class="field-label">PBN</div>
              <div class="field-value">{{ detail.pbn || "N/A" }}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Ngày tạo PBN</div>
              <div class="field-value" v-if="!!detail.ngaytaophieu">
                {{ detail.ngaytaophieu | moment("DD/MM/YYYY HH:mm:ss") }}
              </div>
              <div class="field-value" v-else>N/A</div>
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
                    v-if="canCall(true)"
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
                {{ detail.TTPName || "N/A" }}
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Số trạng thái phiếu</div>
              <div class="field-value">
                {{ detail.TTP || "N/A" }}
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">NV bán hàng</div>
              <div class="field-value" v-if="!!detail.mnvbh && !!detail.tnvbh">
                {{ detail.mnvbh }} - {{ detail.tnvbh }}
              </div>
              <div class="field-value" v-else>N/A</div>
            </div>
            <template
              v-if="detail.NhomNhanVienGh && detail.NhomNhanVienGh.length > 0"
            >
              <div
                class="field-group"
                v-for="(a, i) in detail.NhomNhanVienGh"
                :key="'nhomnv' + i"
              >
                <div class="field-label">NV giao nhận</div>
                <div class="field-value">
                  {{ a.Maxe }} - {{ a.NhomNhanVien }} - {{ a.Phone }}
                </div>
              </div>
            </template>
            <template
              v-else-if="detail.nhanvien && detail.nhanvien.length > 0"
            >
              <div
                class="field-group"
                v-for="(a, i) in detail.nhanvien"
                :key="'nv' + i"
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
            <div class="field-group">
              <div class="field-label">SĐT NV giao nhận</div>
              <div class="field-value" style="display: flex">
                <el-input
                  v-model="phoneNv"
                  placeholder="Please input"
                  style="flex: 1; min-width: 0"
                />
                <span
                  v-if="canCall(false)"
                  style="flex: none; display: inline-flex"
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
              <div class="field-label">Tiêu đề</div>
              <div class="field-value">
                <span style="text-transform: uppercase">{{ detail.name }}</span>
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Chi nhánh</div>
              <div class="field-value">
                <span style="text-transform: uppercase"
                  >{{ detail.code_store }} - {{ detail.store_name }}</span
                >
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Ngày tạo ticket</div>
              <div class="field-value">
                <span style="text-transform: uppercase">{{
                  detail.created_at | moment("DD/MM/YYYY")
                }}</span>
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Thời gian xử lý</div>
              <div
                class="field-value"
                v-if="detail.time_handle !== null && detail.time_handle !== ''"
              >
                <span style="text-transform: uppercase">
                  {{ detail.time_handle | moment("DD/MM/YYYY HH:mm:ss") }}</span
                >
              </div>
              <div class="field-value" v-else>N/A</div>
            </div>
            <div class="field-group">
              <div class="field-label">Tên user tạo ticket</div>
              <div class="field-value">
                <span>{{ detail.name_user_create }}</span>
              </div>
            </div>
          </div>
          </div>
          <div class="section-card">
            <div class="section-header">
              <i class="el-icon-view"></i>
              <h3>NỘI DUNG XỬ LÝ & THẨM ĐỊNH</h3>
            </div>
            <div class="field-group">
              <div class="field-label">
                Nội dung <br />
                từ ban giám đốc
              </div>
              <div class="field-value">
                <div
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
                    style="font-size: 16px; width: 100px"
                    @click="savenote_bgd(note_bgd)"
                    >Lưu</el-button
                  >
                </div>
                <div v-else>{{ note_bgd }}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Nội dung vi phạm</div>
              <div class="field-value">
                <div
                  v-if="
                    detail.vipham &&
                    detail.vipham !== null &&
                    detail.vipham !== ''
                  "
                  style="word-break: break-word"
                >
                  {{ detail.vipham }}
                </div>
                <div v-else>N/A</div>
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
              <div class="field-label">Số lần xử lý lại</div>
              <div class="field-value">
                <div
                  v-if="
                    detail.flag_content !== null &&
                    detail.flag_content.num_processing
                  "
                >
                  {{ detail.flag_content.num_processing }}
                </div>
                <div v-else>0</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Tên thẩm định</div>
              <div class="field-value">
                <div v-if="detail.name_user_expertise !== ''">
                  {{ detail.name_user_expertise }}
                </div>
                <div v-else>N/A</div>
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

            <div
              class="field-group"
              v-if="detail.rate !== 0 && detail.rate !== null"
            >
              <div class="field-label">Đánh giá độ hài lòng</div>
              <div class="field-value">
                {{ detail.rate }}
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">GSNS xử lý</div>
              <div class="field-value" style="color: red">
                <template
                  v-if="
                    (detail.approved !== 2 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) !== 3) ||
                    (detail.approved !== 2 &&
                      Number(
                        user
                          .find((a) => a.split('=')[0] === 'rule')
                          .split('=')[1]
                      ) !== 1)
                  "
                >
                  <template style="color: red">
                    {{ detail.coupon }}
                  </template>
                </template>
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
                  <el-input
                    v-model="coupon"
                    type="textarea"
                    placeholder="Please input"
                  />
                </template>
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Tiền phạt</div>
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
                </template>
                <template v-else>
                  <template v-if="!!detail.tienphat">
                    {{ detail.tienphat }}
                  </template>
                  <template v-else>N/A</template>
                </template>
              </div>
            </div>
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
              <div class="field-label">Hướng xử lý</div>
              <div
                class="field-value"
                v-if="detail.flag_content && detail.flag_content.huong_xu_ly"
                style="word-break: break-word"
              >
                {{ detail.flag_content.huong_xu_ly }}
              </div>
              <div class="field-value" v-else>N/A</div>
            </div>
            <div class="field-group">
              <div class="field-label">Auditor</div>
              <div
                class="field-value"
                v-if="detail.flag_content && detail.flag_content.auditor"
                style="word-break: break-word"
              >
                {{ detail.flag_content.auditor }}
              </div>
              <div class="field-value" v-else>N/A</div>
            </div>
            <div class="field-group">
              <div class="field-label">Nội dung</div>
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
              <div class="field-label">Xử lý vi phạm</div>
              <div
                class="field-value"
                v-if="detail.flag_content && detail.flag_content.personnel_note"
                style="word-break: break-word"
              >
                {{ detail.flag_content.personnel_note }}
              </div>
              <div class="field-value" v-else>N/A</div>
            </div>
            <div class="field-group">
              <div class="field-label">Đề xuất hướng xử lý</div>
              <div class="field-value">
                <template
                  v-if="
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 3 ||
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
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
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                    ) === 3 ||
                    Number(
                      user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
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
          </el-tab-pane>
          <el-tab-pane label="Tài liệu đính kèm" name="files">
        <div class="popup-grid">
          <div class="section-card">
            <div class="section-header">
              <i class="el-icon-user"></i>
              <h3>NHÂN VIÊN & HÌNH ẢNH VI PHẠM</h3>
            </div>
            <div
              v-if="!is_loading"
              class="box-detail"
              style="padding: 0 15px; margin-bottom: 10px"
            >
              <div class="box" style="width: 100%; background: #bbe1ff">
                <div class="box" style="display: block; width: 100%">
                  <h3>Mã NV vi phạm</h3>

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
                        @click="dialogVisibleStaff = true"
                      ></el-button>
                    </div>
                    <strong v-if="mnv !== null" style="font-size: 14px"
                      >(Tên: {{ mnv.FullName }}, Phòng ban:
                      {{ mnv.DepartMentName }}, Chức vụ: {{ mnv.TenChucDanh }},
                      Chi nhánh: {{ mnv.SiteName }} - {{ mnv.SiteId }})</strong
                    >
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

                <div class="box" style="width: 100%">
                  <h3>Note xử lý</h3>
                  <p
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
                      autosize
                      placeholder="Please input"
                    />
                  </p>
                  <p v-else style="word-break: break-word">
                    <span
                      v-if="
                        detail.flag_content !== null &&
                        detail.flag_content.note_user
                      "
                      >{{ detail.flag_content.note_user }}</span
                    >
                  </p>
                </div>

                <div class="box" style="width: 100%">
                  <h3>Hình ảnh xử lý</h3>
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
                      class="blockupload"
                      action="#"
                      list-type="picture-card"
                      :auto-upload="false"
                      :limit="30"
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
                  <p>
                    <template v-if="detail.multi_picture !== null">
                      <vue-picture-swipe
                        :items="listImages2(detail.multi_picture)"
                      />
                    </template>
                  </p>
                </div>
              </div>

              <div
                v-for="per in personnel"
                :key="per.id"
                class="box"
                style="width: 100%; background: #bbe1ff; margin-top: 20px"
              >
                <div class="box" style="display: block">
                  <h3>Mã NV vi phạm</h3>

                  <div>
                    <div style="display: flex">
                      <el-input
                        :id="'manvper_' + per.id"
                        v-model="per.manv"
                        placeholder="Please input"
                        @input.native="changeMnvPer(per.id)"
                      />
                      <el-button
                        v-loading="loading"
                        type="primary"
                        style="width: 100px"
                        @click="loadMnv(per.manv.trim(), per.id)"
                        >Load</el-button
                      >
                    </div>
                    <strong v-if="per.desc !== ''" style="font-size: 14px"
                      >(Tên: {{ per.desc.FullName }}, Phòng ban:
                      {{ per.desc.DepartMentName }}, Chức vụ:
                      {{ per.desc.TenChucDanh }}, Chi nhánh:
                      {{ per.desc.SiteName }} - {{ per.desc.SiteId }})</strong
                    >
                  </div>
                </div>

                <div class="box">
                  <h3>Nội dung</h3>
                  <p style="word-break: break-word; width: 100%">
                    <el-input
                      v-model="per.description"
                      autosize
                      type="textarea"
                      placeholder="Please input"
                    />
                  </p>
                </div>
                <div class="box">
                  <h3>Xử lý vi phạm</h3>

                  <p style="width: 100%">
                    <el-input
                      v-model="per.personnel_note"
                      autosize
                      type="textarea"
                      placeholder="Please input"
                    />
                  </p>
                </div>
                <div class="box">
                  <h3>Hình ảnh xử lý</h3>
                  <template>
                    <el-upload
                      class="blockupload"
                      action="#"
                      list-type="picture-card"
                      :auto-upload="false"
                      :limit="30"
                      multiple
                      :on-exceed="handleExceed"
                      :on-change="
                        (file, fileList) => {
                          handleChange2(file, fileList, per.id);
                        }
                      "
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
                <el-button
                  v-loading="loading"
                  type="danger"
                  style="width: 100%"
                  @click="deletePersonnel(per.id)"
                  >Xóa</el-button
                >
              </div>
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
                type="primary"
                style="width: 100%; margin-top: 20px"
                @click="addPersonnel"
                >Thêm nhân viên vi phạm</el-button
              >
            </div>
            <div class="field-group">
              <div class="field-label">Hình ảnh vi phạm</div>
              <div class="field-value" v-if="!!detail.multi_picture_violate">
                <vue-picture-swipe
                  :items="listImages(detail.multi_picture_violate)"
                />
              </div>
              <div class="field-value" v-else>N/A</div>
            </div>
          </div>
          <div class="section-card">
            <div class="section-header">
              <i class="el-icon-picture"></i>
              <h3>LINK & LOG</h3>
            </div>
            <div
              class="field-group"
              v-if="detail.cid_parent !== null && detail.cid_parent > 0"
            >
              <div class="field-label">Link ticket xử lý</div>
              <div class="field-value">
                <a
                  :href="'/manage/install/' + detail.cid_parent"
                  target="_blank"
                  style="color: blue"
                  >Link</a
                >
              </div>
            </div>
            <div class="field-group">
              <div class="field-label">Log</div>
              <div class="field-value">
                <el-button
                  icon="el-icon-view"
                  type="primary"
                  @click="showLogPopup"
                >
                  Xem Log
                </el-button>
              </div>
            </div>
          </div>
        </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <div
        style="display: flex; justify-content: center; padding: 10% 0"
        v-else
      >
        <div class="loading"></div>
      </div>
    </div>
    <LogPopup
      :visible="logPopupVisible"
      :log="log"
      :pagelog="pagelog"
      :loading="loading"
      :detailId="detail.id"
      :userRule="user.find((a) => a.split('=')[0] === 'rule').split('=')[1]"
      @close="logPopupVisible = false"
      @load-more="handleLog"
    />

    <el-dialog
      :visible.sync="dialogVisibleStaff"
      title="Danh sách nhân viên"
      width="900px"
      :append-to-body="true"
    >
      <StaffPopup :code_store="detail.code_store" @choose="handleChooseStaff" />
    </el-dialog>
  </div>
</template>

<script>
import {
  updateTicket,
  getLists,
  cloneticket,
  saveStore,
  getLog,
  updateRecord,
} from "@/api/ticket";
import { Message } from "element-ui";
import { getUser } from "@/utils/auth.js";
import { getlists } from "@/api/department";
import { getlistsRate } from "@/api/rate";
import LogPopup from "../Popup/LogPopup.vue";
import StaffPopup from "./Staff.vue";

let url = "";

if (window.location.host === "dmcltk.stdmcl.com:8099") {
  url = process.env.VUE_APP_BASE_API;
} else {
  url = process.env.VUE_APP_BASE_API_DEV;
}

export default {
  name: "ComponentTicketStaffPopup",
  components: {
    LogPopup,
    StaffPopup,
  },
  props: ["detailParent", "page"],
  data() {
    return {
      mainTab: "info",
      coupon: "Xử lý theo quy định công ty",
      phone: "",
      phoneNv: "",
      note_user_expertise: "",
      note_user: "",
      rate: null,
      loading: false,
      personnel_name: "",
      personnel_note: "",
      list_rate: [],
      code_store: "",

      fileList: [],
      files: [],
      process: url,

      mnv: null,

      listDepartment: [],
      loadingDepartment: false,
      cid_department: "",
      keytabs: "0",
      listRateDefault: [],
      listRate: [],

      is_loading: false,

      detail: {},

      personnel: [],

      tienphat: 0,

      note_bgd: "",

      log: null,
      pagelog: 0,
      pagelogStatus: false,
      logPopupVisible: false,

      dialogVisibleStaff: false,

      currentIndexStaff: 0,

      note_nhan_xet_xu_ly: "",
      note_nhan_vien_nhan_xet: "",
      type_xu_ly: 0,
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
    stores() {
      return this.$store.state.store.stores;
    },
  },
  async created() {
    this.is_loading = true;
    this.$store.dispatch("store/getStores").then(() => {
      let id = "";
      if (this.detailParent) {
        id = this.detailParent.id;
      } else {
        id = this.$route.params.id;
      }

      getLists({
        tienphat: "",
        page: 1,
        approved: "",
        code_store: "",
        phone: "",
        date_cre_date_start: "",
        date_cre_date_end: "",
        type: 7,
        id,
      }).then(async (res0) => {
        if (res0.status === 200) {
          this.detail = res0.data.data[0];
          this.loadingDepartment = true;
          if (this.detail.id) {
            getlists().then((res) => {
              if (res.status === 200) {
                this.listDepartment = res.data.data.filter(
                  (a) => a.status === 1
                );
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
                    this.listRateDefault = res2.data.data.filter(
                      (a) => a.status === 1
                    );

                    this.listRate = res2.data.data.filter(
                      (a) => a.status === 1
                    );

                    this.list_rate = this.detail.list_rate_ticket;

                    this.loadingDepartment = false;
                  }
                });
              }
            });
            if (!!this.detail.note_bgd) {
              this.note_bgd = this.detail.note_bgd;
            }
            if (
              this.detail.flag_index !== null &&
              this.detail.flag_index.user
            ) {
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
              this.detail.flag_content.note_user
            ) {
              this.note_user = this.detail.flag_content.note_user;
            }
            if (
              this.detail.flag_content !== null &&
              this.detail.flag_content.note_user_expertise
            ) {
              this.note_user_expertise =
                this.detail.flag_content.note_user_expertise;
            }
            if (this.detail.phone !== null) {
              this.phone = this.detail.phone;
            }
            this.loadPbnInfo().then(() => this.autoLoadMnv());
            if (this.detail.rate !== null) {
              this.rate = this.detail.rate;
            }
            if (this.detail.coupon !== null) {
              this.coupon = this.detail.coupon;
            }
            if (this.detail.code_store !== null) {
              this.code_store = this.detail.code_store;
            }

            if (!!this.detail.type_xu_ly) {
              this.type_xu_ly = this.detail.type_xu_ly;
            }
            if (!!this.detail.note_nhan_xet_xu_ly) {
              this.note_nhan_xet_xu_ly = this.detail.note_nhan_xet_xu_ly;
            }

            if (!!this.detail.note_nhan_vien_nhan_xet) {
              this.note_nhan_vien_nhan_xet =
                this.detail.note_nhan_vien_nhan_xet;
            }

            this.is_loading = false;
          }
        }
      });
    });
  },
  methods: {
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
    async loadPbnInfo() {
      if (!this.detail.pbn) return;
      const info = {};
      try {
        const res = await fetch(
          "http://apitk.stdmcl.com:8099/restful/checkpbn?sophieu=" +
            this.detail.pbn
        );
        const json = await res.json();

        if (json.status === 200 && json.result2 !== null) {
          info.ngaygiaohang = json.result2.NgayGiaoNhan;
          info.nhanvien = json.result2.NhanVien;
          info.ngaytaophieu = json.result2.NgayTaoPhieu;
          info.tnvbh = json.result2.TenNVBH;
          info.mnvbh = json.result2.MaNVBH;
          info.NhanVienDieu = json.result2.NhanVienDieu;
          info.TenNhanVienDieu = json.result2.TenNhanVienDieu;
          info.NhomNhanVienGh = json.result2.NhomNhanVienGh;
          info.TTPName = json.result2.TTPName;
          info.TTP = json.result2.TTP;
          info.address2 = json.result2.DiaChi;

          if (json.result2.NhanVien && json.result2.NhanVien.length) {
            this.phoneNv = json.result2.NhanVien[0].DienThoai;
          } else if (
            json.result2.NhomNhanVienGh &&
            json.result2.NhomNhanVienGh.length
          ) {
            const nhanvien = json.result2.NhomNhanVienGh.find(
              (a) => a.Maxe === json.result2.MaSoXe
            );
            if (nhanvien) this.phoneNv = nhanvien.Phone;
          }
        }

        const res2 = await fetch(
          "http://apitk.stdmcl.com:8099/restful/checkdt?sophieu=" +
            this.detail.pbn
        );
        const json2 = await res2.json();

        if (json2.result2 && json2.result2.dataJson) {
          const dataJson = JSON.parse(json2.result2.dataJson);
          info.tnvbh = dataJson.EmployeeName;
          info.mnvbh = dataJson.EmployeeID;
        }
        if (json.result2 == null && json2?.data?.CreationDate) {
          info.ngaytaophieu = json2.data.CreationDate;
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
      this.detail = { ...this.detail, ...info };
    },
    autoLoadMnv() {
      if (this.mnv !== null) return;
      if (this.personnel_name.trim() !== "") {
        this.loadMnv(this.personnel_name.trim(), undefined, true);
        return;
      }
      const rule = Number(
        this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
      );
      const canEdit =
        (this.detail.approved === 0 || this.detail.approved === 5) &&
        (rule === 1 || rule === 2);
      const nhanvien = this.detail.nhanvien;
      if (canEdit && nhanvien && nhanvien.length > 0 && nhanvien[0].MaNhanVien) {
        this.personnel_name = nhanvien[0].MaNhanVien;
        this.loadMnv(this.personnel_name, undefined, true);
      }
    },
    canCall(isKh) {
      const rule = Number(
        this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
      );
      const approved = this.detail.approved;
      if (approved === 9) {
        return isKh ? rule === 7 || rule === 1 : rule === 1;
      }
      if (approved === 0 || approved === 5) {
        return rule === 1 || rule === 2 || rule === 7;
      }
      return false;
    },
    handleCall(data, isKh) {
      const phone = isKh === 1 ? this.phone : this.phoneNv;
      if (phone === "") {
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
            const formData = new FormData();
            formData.append("username", data.username_call);
            formData.append("passwd", data.password_call);
            formData.append("src", data.caseout_call);
            formData.append("dst", phone);
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
                  const logRecord = {
                    src: data.data.data.src,
                    dst: data.data.data.dst,
                    created_at: new Date().toLocaleString("sv-SE"),
                    logRecord: {
                      callKeys: data.data.data.callKey,
                      fromDateTime: new Date().toLocaleString("sv-SE"),
                      toDateTime: new Date(
                        new Date().setMinutes(new Date().getMinutes() + 30)
                      ).toLocaleString("sv-SE"),
                      destination: phone,
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
          } else {
            this.loading = false;
          }
        })
        .catch((error) => {
          console.error("Lỗi:", error);
          this.loading = false;
        });
    },
    closePopup() {
      this.$emit("handlePopup");
      this.coupon = "Xử lý theo quy định công ty";
      this.phone = "";
      this.phoneNv = "";
      this.note_user_expertise = "";
      this.note_user = "";
      this.personnel_name = "";
      this.personnel_note = "";
      this.note_nhan_xet_xu_ly = "";
      this.note_nhan_vien_nhan_xet = "";
      this.type_xu_ly = 0;
    },
    addPersonnel() {
      const find = this.personnel.find((a) => a.desc === "");
      if (this.mnv === null || find) {
        this.$notify.error({
          title: "Error",
          message: "Load mã nhân viên trước khi tạo thêm !!",
        });
        return false;
      }
      this.personnel.push({
        id: new Date().getTime(),
        mnv: "",
        desc: "",
        personnel_note: "",
        description: "",
        fileList: [],
        files: [],
      });
    },
    handleDetail(status, linkedid) {
      this.$parent.recordStatus(status, linkedid);
    },
    selectChange(id) {
      const findIndex = this.list_rate.findIndex((a) => a === id);

      if (findIndex === -1) {
        this.list_rate.push(id);
      } else {
        this.list_rate = this.list_rate.filter((a) => a !== id);
      }
    },
    listImages(data) {
      const arr = [];
      const id =
        this.detail.cid_parent !== null && this.detail.cid_parent !== 0
          ? this.detail.cid_parent
          : this.detail.id;
      JSON.parse(data).forEach((a) => {
        arr.push({
          src: url + "/public/uploads/" + id + "/anninh/" + a + ".png.webp",
          thumbnail:
            url + "/public/uploads/" + id + "/anninh/" + a + ".png.webp",
          w: 900,
          h: 900,
          title: "",
        });
      });
      return arr;
    },
    deletePersonnel(id) {
      const index = this.personnel.findIndex((a) => a.id === id);
      const del = this.personnel.splice(index, 1);
    },
    showLogPopup() {
      this.logPopupVisible = true;
      if (this.log === null) {
        this.handleLog({ id: this.detail.id, page: 1 });
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
            this.log = this.log.data.concat(res.data.data);
          }
        }
        this.loading = false;
      });
    },
    listImages2(data) {
      const arr = [];

      data.forEach((a) => {
        arr.push({
          src:
            url +
            "/public/uploads/" +
            this.detail.id +
            "/quanly/" +
            a +
            ".png.webp",
          thumbnail:
            url +
            "/public/uploads/" +
            this.detail.id +
            "/quanly/" +
            a +
            ".png.webp",
          w: 900,
          h: 900,
          title: "",
        });
      });
      return arr;
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
      const find = this.personnel.find(
        (a) => a.desc === "" || a.personnel_note === ""
      );
      if (
        (approved === 2 && this.mnv === null) ||
        (approved === 2 && this.personnel_note === "") ||
        find
      ) {
        this.$notify.error({
          title: "Error",
          message: "Thông tin mnv, Nội dung vi phạm không để trống !!",
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
        if (this.coupon === "") {
          this.coupon = "Xử lý theo quy định công ty";
        }
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
        if (this.mnv !== null) {
          formData.append("personnel_name", this.personnel_name.trim());
        }
        formData.append("personnel_note", this.personnel_note);
        formData.append("note_user", this.note_user);
        formData.append("type_xu_ly", this.type_xu_ly);
        this.files.forEach((a) => {
          formData.append("imageFiles[]", a);
        });
        formData.append("description", this.detail.description);
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
                formData2.append("data[" + i + "][description]", a.description);
                formData2.append(
                  "data[" + i + "][personnel_name]",
                  a.desc.EmployeeId
                );
                formData2.append(
                  "data[" + i + "][personnel_note]",
                  a.personnel_note
                );
                a.files.forEach((b, e) => {
                  formData2.append("data[" + i + "][imageFiles][" + e + "]", b);
                });
              });
            cloneticket(formData2)
              .then((res2) => {
                if (res2.status == 200) {
                  Message({
                    message: res.message,
                    type: "success",
                    duration: 5 * 1000,
                  });
                  this.$emit("getlists", this.page);
                  this.fileList = [];
                  this.files = [];
                  this.closePopup();
                  if (this.$route.params.id) {
                    this.$router.push("/manage/install");
                  }
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
          } else {
            Message({
              message: res.message,
              type: "success",
              duration: 5 * 1000,
            });
            this.loading = false;
            this.$emit("getlists", this.page);
            this.fileList = [];
            this.files = [];
            this.closePopup();
            if (this.$route.params.id) {
              this.$router.push("/manage/install");
            }
          }
        } else {
          this.loading = false;
          Message({
            message: res.message,
            type: "error",
            duration: 5 * 1000,
          });
        }
      });
    },
    handleExceed() {
      this.$message.warning("Vui lòng up tối đa 30 hình!!");
    },
    handleChange(file, fileList) {
      let arr = [];
      fileList.forEach((a) => {
        arr = [...arr, a.raw];
      });
      this.files = arr;
      this.fileList = fileList;
    },
    handleChange2(file, fileList, id) {
      const index = this.personnel.findIndex((a) => a.id === id);
      let arr = [];
      fileList.forEach((a) => {
        arr = [...arr, a.raw];
      });

      this.personnel[index].files = arr;
      this.personnel[index].fileList = fileList;
    },

    disabled() {
      if (this.personnel_note !== "" && this.personnel_name.trim() !== "") {
        return false;
      }
      return true;
    },

    handlePrint(status) {
      this.$parent.handlePrint(status);
    },
    changeMnv() {
      this.mnv = null;
    },
    changeMnvPer(id) {
      document.getElementById("manvper_" + id).focus();
      const index = this.personnel.findIndex((a) => a.id === id);
      this.personnel[index].desc = "";
    },

    async loadMnv(data, number, silent) {
      if (data === "" || data === undefined) {
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
            const findIndex = this.personnel.findIndex((a) => a.id === number);
            this.personnel[findIndex].desc = datares.data;
          } else {
            this.mnv = datares.data;
          }
        } else if (!silent) {
          this.$notify.error({
            title: "Error",
            message: datares.message,
          });
        }
      }
      this.loading = false;
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

      fetch(`${url}/restful/adminnotebgd`, {
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
          this.$emit("getlists", this.page);
          this.loading = false;
        });
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
@import "./../Popup/Popup.css";

.box .hide {
  display: none;
}
.full .el-table__row td:last-child .cell {
  display: block;
  max-height: none;
}
.my-gallery {
  flex-wrap: wrap;
}
.blockupload .el-upload--picture-card,
.blockupload .el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
  line-height: 90px;
}
.detailprint .box-detail .box h3 {
  font-size: 14px !important;
}
</style>
