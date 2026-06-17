<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="Chi tiết"
    :before-close="handleClose"
  >
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
      <!-- <div class="box" style="width: calc(100% / 4)">
        <h3 style="width: 100%">Chi nhánh</h3>
        <p>{{ detail.code_store }} - {{ detail.store_name }}</p>
      </div> -->
      <div class="box" style="width: 100%">
        <h3>Ngày giao hàng</h3>
        <p v-if="detail.ngaygiaohang != null && detail.ngaygiaohang !== ''">
          {{ detail.ngaygiaohang | moment("DD/MM/YYYY HH:mm:ss") }}
        </p>
        <p v-else>---</p>
      </div>
      <div class="box">
        <h3>Mã NV bán hàng</h3>
        <p v-if="detail.mnvbanhang && detail.mnvbanhang !== ''">
          {{ detail.mnvbanhang }}
        </p>
        <p v-else>---</p>
      </div>
      <div class="box">
        <h3>Tên NV bán hàng</h3>
        <p v-if="detail.tnvbanhang && detail.tnvbanhang !== ''">
          {{ detail.tnvbanhang }}
        </p>
        <p v-else>---</p>
      </div>
      <div class="box">
        <h3>Mã NV thu ngân</h3>
        <p v-if="detail.tnvthungan && detail.tnvthungan !== ''">
          {{ detail.tnvthungan }}
        </p>
        <p v-else>---</p>
      </div>
      <div class="box">
        <h3>Tên NV thu ngân</h3>
        <p v-if="detail.tnvthungan && detail.tnvthungan !== ''">
          {{ detail.tnvthungan }}
        </p>
        <p v-else>---</p>
      </div>
      <div class="box">
        <h3>Mã NV giao nhận</h3>
        <p>---</p>
      </div>
      <div class="box">
        <h3>Tên NV giao nhận</h3>
        <p>---</p>
      </div>
      <div class="box">
        <h3>Mã NV bảo hành/lắp đặt</h3>
        <p>---</p>
      </div>
      <div class="box">
        <h3>Tên NV bảo hành/lắp đặt</h3>
        <p>---</p>
      </div>
      <div class="box">
        <h3>Mã NV quản lý</h3>
        <p>---</p>
      </div>
      <div class="box">
        <h3>Tên NV quản lý</h3>
        <p>---</p>
      </div>
      <div class="box">
        <h3>Ngày tạo phiếu</h3>
        <p v-if="detail.ngaytaophieu != null && detail.ngaytaophieu !== ''">
          {{ detail.ngaytaophieu | moment("DD/MM/YYYY HH:mm:ss") }}
        </p>
        <p v-else>---</p>
      </div>
      <div class="box">
        <h3>Ngày KH đánh giá</h3>
        <p>{{ detail.date_cre | moment("DD/MM/YYYY") }}</p>
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
              (detail.approved === 2 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1) ||
              (detail.approved === 5 &&
                Number(
                  user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
                ) === 1)
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
        <h3>Note xử lý KH</h3>

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
            v-if="detail.flag_content !== null && detail.flag_content.note_user"
            >{{ detail.flag_content.note_user }}</span
          >
        </p>
      </div>

      <div class="box">
        <h3>Nội dung vi phạm</h3>

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
            v-model="personnel_note"
            type="textarea"
            placeholder="Please input"
          />
        </p>
        <p v-else>
          <span
            v-if="
              detail.flag_content !== null && detail.flag_content.personnel_note
            "
            >{{ detail.flag_content.personnel_note }}</span
          >
        </p>
      </div>

      <div class="box">
        <h3>Mã NV</h3>

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
          style="display: flex"
        >
          <el-input
            v-model="personnel_name"
            placeholder="Please input"
            @input.native="changeMnv"
          />
          <el-button
            v-loading="loading"
            type="primary"
            style="width: 100px"
            @click="loadMnv(personnel_name)"
            >Load</el-button
          >
        </div>
        <p v-else>
          <span v-if="detail.personnel_name !== null">{{
            detail.personnel_name
          }}</span>
        </p>
        <strong v-if="mnv !== null" style="font-size: 14px"
          >(Tên: {{ mnv.FullName }}, Phòng ban: {{ mnv.DepartMentName }}, Chức
          vụ: {{ mnv.TenChucDanh }}, Chi nhánh: {{ mnv.SiteName }} -
          {{ mnv.SiteId }})</strong
        >
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
      <div class="box">
        <h3>Tiêu chí đánh giá</h3>
        <p
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
        </p>
        <p v-else>---</p>
      </div>
      <div class="box">
        <h3>Đánh giá độ hài lòng</h3>
        <p
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
          <el-rate v-model="rate" />
        </p>
        <p v-else>---</p>
      </div>
      <div class="box" style="color: blue">
        <h3>Số lần xử lý lại</h3>
        <p
          v-if="
            detail.flag_content !== null && detail.flag_content.num_processing
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
      <div
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
          v-if="detail.coupon && detail.coupon !== null && detail.coupon !== ''"
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
      </div>
      <div class="box" style="width: 100%">
        <h3 style="width: 100%">Tiêu chí đánh giá bộ phận</h3>
        <el-tabs
          v-loading="loadingDepartment"
          type="border-card"
          @tab-click="handleDepartment"
        >
          <el-tab-pane v-for="a in listDepartment" :key="a.id" :label="a.name">
            <el-checkbox-group v-model="list_rate_name">
              <el-checkbox
                v-for="b in listRate"
                :key="b.id"
                :label="b.name"
                :disabled="disabledCheckRate"
                @change="selectChange"
              />
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
        <h1
          v-if="
            (detail.approved === 2 &&
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 3 &&
              personnel_note === '' &&
              personnel_name === '') ||
            (detail.approved === 2 &&
              Number(
                user.find((a) => a.split('=')[0] === 'rule').split('=')[1]
              ) === 1 &&
              personnel_note === '' &&
              personnel_name === '')
          "
          class="error"
          style="margin-bottom: 10px; font-size: 16px"
        >
          (Nội dung vi phạm và mã NV không có nên không thể chọn tiêu chí)
        </h1>
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

        <p>
          <template v-if="detail.multi_picture !== null">
            <vue-picture-swipe :items="listImages(detail.multi_picture)" />
          </template>
        </p>
      </div>
      <div class="box" style="width: 100%">
        <h3 style="display: flex; align-items: center">Record</h3>
        <p v-if="records.TotalItem > 0" style="width: 100%">
          <el-table :data="records.data" border style="width: 100%">
            <el-table-column label="Name user">
              <template slot-scope="scope">
                {{ scope.row.name_user }}
              </template>
            </el-table-column>
            <el-table-column label="Exten">
              <template slot-scope="scope">
                {{ scope.row.content.exten }}
              </template>
            </el-table-column>
            <el-table-column label="CallerIdNum">
              <template slot-scope="scope">
                {{ scope.row.content.callerIdNum }}
              </template>
            </el-table-column>
            <el-table-column label="ReceivedAt">
              <template slot-scope="scope">
                {{ scope.row.content.receivedAt }}
              </template>
            </el-table-column>
            <el-table-column label="ResponseAt">
              <template slot-scope="scope">
                {{ scope.row.content.responseAt }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Option" width="300px">
              <template slot-scope="scope">
                <el-button
                  style="margin: 0 30px"
                  type="primary"
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
              </template>
            </el-table-column>
          </el-table>
        </p>
        <p v-else>---</p>
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
          <el-table-column label="Thẩm định đánh giá độ hài lòng">
            <template slot-scope="scope">
              <span
                v-if="scope.row.content.rate && scope.row.content.rate !== null"
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
              user.find((a) => a.split('=')[0] === 'rule').split('=')[1] === '1'
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
                ) === 2)
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

          <el-button
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
            type="danger"
            @click="handleUpdate(detail.id, 4)"
            >Hủy</el-button
          >

          <!-- <el-button
            v-if="detail.approved === 6"
            v-loading="loading"
            type="danger"
            @click="handlePrint(true)"
            >Xem trước biên bản</el-button
          > -->
        </div>

        <el-button icon="el-icon-close" @click="closePopup">Đóng</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  updateTicket,
  updateRecord,
  getListsRecords,
  getLog,
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
  props: ["dialogVisible", "lists", "detail", "page"],
  data() {
    return {
      coupon: "",
      note_user: "",
      record: "",
      phone: "",
      note_user_expertise: "",
      rate: null,
      loading: false,
      personnel_name: "",
      personnel_note: "",
      list_rate_name: [],
      list_rate: [],
      // note_report: "",

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
      chooseDepartment: "",
      listRateDefault: [],
      listRate: [],

      is_loading: false,
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
          this.personnel_name !== "" &&
          this.statusTabs()) ||
        (this.detail.approved === 2 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1 &&
          this.personnel_note !== "" &&
          this.personnel_name !== "" &&
          this.statusTabs())
      ) {
        return false;
      }
      return true;
    },
  },
  watch: {
    chooseDepartment(newData, OldData) {
      this.listRate = this.listRateDefault.filter(
        (a) => a.cid_department === newData
      );
    },
  },
  async created() {
    this.loadingDepartment = true;
    getlists().then((res) => {
      if (res.status === 200) {
        this.listDepartment = res.data.data.filter((a) => a.status === 1);
        if (res.data.TotalItem > 0) {
          this.chooseDepartment = this.listDepartment[0].id;
        }
        getlistsRate().then((res2) => {
          if (res2.status === 200) {
            this.listRateDefault = res2.data.data.filter((a) => a.status === 1);
            this.listRate = res2.data.data.filter(
              (a) => a.cid_department === this.chooseDepartment
            );
            this.list_rate = this.detail.list_rate_ticket;
            if (this.list_rate.length > 0) {
              this.listRateDefault.forEach((a) => {
                this.list_rate.forEach((b) => {
                  if (a.id === b) {
                    this.list_rate_name.push(a.name);
                  }
                });
              });
            }
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
    getListsRecords(this.detail.id).then((res) => {
      if (res.status === 200) {
        res.data.data.forEach((a) => {
          a.content.blobRecord = "";
        });
        this.records = res.data;
      }
    });

    this.is_loading = true;

    const res = await fetch(
      "http://apitk.stdmcl.com:8099/restful/checkpbn?sophieu=" + this.detail.pbn
    );
    const json = await res.json();

    if (json.data.length > 0) {
      this.detail.ngaygiaohang = json.data[0].DeliveryDate;
      this.detail.ngaytaophieu = json.data[0].CreateDate;
      this.detail.mnvbanhang = json.data[0].EmployeeId;
      this.detail.tnvbanhang = json.data[0].EmployeeName;
      this.detail.tnvthungan = json.data[0].UserNameThuNgan;
    }

    this.is_loading = false;
  },
  methods: {
    statusTabs() {
      if (this.list_rate.length > 0) {
        const find = this.listRate.find((a) => a.id === this.list_rate[0]);
        if (find) {
          return true;
        }
        return false;
      }
      return true;
    },
    selectChange() {
      const newArr = [];
      this.listRateDefault.forEach((a) => {
        this.list_rate_name.forEach((b) => {
          if (a.name === b) {
            newArr.push(a.id);
          }
        });
      });
      this.list_rate = newArr;
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
          w: 400,
          h: 400,
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
      if (approved === 4 && this.note_user === "") {
        this.$notify({
          title: "Warning",
          message: "Nhập lý do hủy tại note xử lý !!",
          type: "warning",
        });
        return false;
      }

      this.loading = true;
      const formData = new FormData();
      formData.append("id", id);
      formData.append("approved", approved);
      formData.append("status", 1);
      formData.append("phone", this.phone);

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
          this.personnel_name !== "") ||
        (this.detail.approved === 2 &&
          Number(
            this.user.find((a) => a.split("=")[0] === "rule").split("=")[1]
          ) === 1 &&
          this.personnel_note !== "" &&
          this.personnel_name !== "")
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
          formData.append("personnel_name", this.personnel_name);
        }

        formData.append("personnel_note", this.personnel_note);

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
          Message({
            message: res.message,
            type: "success",
            duration: 5 * 1000,
          });
          this.closePopup();
          this.$parent.getLists(this.page);
          this.fileList = [];
          this.files = [];
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

      this.loading = true;
      fetch(
        this.processCall +
          "/webservice/checkExtension?extension=" +
          data.caseout_call,
        {
          method: "GET",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          if (res.stateDesc === "Idle") {
            fetch(
              this.processCall +
                "/webservice/clickToCall?username=" +
                data.username_call +
                "&passwd=" +
                data.password_call +
                "&srcTimeOut=" +
                data.timeout_call +
                "&src=" +
                data.caseout_call +
                "&dst=" +
                this.phone,
              {
                method: "POST",
              }
            )
              .then((responseChild) => {
                return responseChild.json();
              })
              .then((resChild) => {
                if (resChild.code === 200 || res.code === "200") {
                  const formData = new FormData();
                  formData.append("record", JSON.stringify(resChild));
                  formData.append("id", this.detail.id);
                  updateRecord(formData)
                    .then((res) => {
                      this.loading = false;
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
                } else {
                  this.loading = false;
                  Message({
                    message: resChild.message,
                    type: "error",
                    duration: 5 * 1000,
                  });
                }
              });
          } else {
            Message({
              message: "Đang trong cuộc gọi hoặc máy đang bận!!",
              type: "error",
              duration: 5 * 1000,
            });
            this.loading = false;
          }
        });
    },
    disabled() {
      if (this.personnel_note !== "" && this.personnel_name !== "") {
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
    handlePrint(status) {
      this.$parent.handlePrint(status);
    },
    changeMnv() {
      this.mnv = null;
    },
    handleDepartment(obj, e) {
      this.chooseDepartment = obj.$vnode.key;
    },
    async loadMnv(data) {
      if (data === "") {
        this.$notify({
          title: "Warning",
          message: "Mã NV không để trống",
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
        this.mnv = datares.data;
      }

      this.loading = false;
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
