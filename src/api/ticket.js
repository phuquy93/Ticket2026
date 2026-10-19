import { request } from "@/utils/fetch";

export function postExcel(data) {
  return request({
    url: "/restful/importaddticket?",
    method: "post",
    data,
  });
}
export function postExcelqc(data) {
  return request({
    url: "/restful/importaddticket3?",
    method: "post",
    data,
  });
}

export function sendMail(data) {
  return request({
    url: "/restful/sendmailreply?",
    method: "post",
    data,
  });
}

export function getDashboard() {
  return request({
    url: "/restful/countapprovedticket?type=0",
    method: "get",
  });
}

export function getDashboard2() {
  return request({
    url: "/restful/countapprovedticket?type=1",
    method: "get",
  });
}

export function getDashboardinstall() {
  return request({
    url: "/restful/countapprovedticket?type=7",
    method: "get",
  });
}

export function getDashboardqc() {
  return request({
    url: "/restful/countapprovedticket?type=2&doitra=1",
    method: "get",
  });
}

export function getDashboardcall() {
  return request({
    url: "/restful/countapprovedticket?type=2&doitra=2",
    method: "get",
  });
}

export function getDashboardinfo() {
  return request({
    url: "/restful/countapprovedticket?type=2&doitra=3",
    method: "get",
  });
}
export function getDashboardviolate() {
  return request({
    url: "/restful/countapprovedticket?type=6",
    method: "get",
  });
}
export function getDashboardonline() {
  return request({
    url: "/restful/countapprovedticket?type=5",
    method: "get",
  });
}
export function getDashboardsupplies() {
  return request({
    url: "/restful/countapprovedticket?type=3",
    method: "get",
  });
}
export function getDashboardurgent() {
  return request({
    url: "/restful/countapprovedticket?type=4",
    method: "get",
  });
}

export function getCountTicketXuly() {
  return request({
    url: "/restful/countticketxuly?",
    method: "get",
  });
}

export function getLists(data) {
  let pbn = "";
  let id = "";
  let doitra = "";
  let rate_customer = "";
  let type_chat_luong_cuoc_goi = "";
  let status_cuoc_goi_den_hen = "";
  let sort = "";
  let sort_so_lan_gui_ticket = "";
  let sort_so_lan_hen_ticket = "";
  let device = "";

  if (data?.doitra !== undefined) {
    doitra = "&doitra=" + data.doitra;
  }
  if (data.status_cuoc_goi_den_hen) {
    status_cuoc_goi_den_hen =
      "&status_cuoc_goi_den_hen=" + data.status_cuoc_goi_den_hen;
  }
  if (data.id) {
    id = "&id=" + data.id;
  }

  if (data.sort !== undefined) {
    sort = "&o[id]=ASC";
    if (data.sort === false) {
      sort = "&o[id]=DESC";
    }
  }

  if (data.so_lan_gui_ticket !== undefined) {
    sort_so_lan_gui_ticket = "&o[so_lan_gui_ticket]=ASC";
    if (data.so_lan_gui_ticket === false) {
      sort_so_lan_gui_ticket = "&o[so_lan_gui_ticket]=DESC";
    }
  }

  if (data.so_lan_hen_ticket !== undefined) {
    sort_so_lan_hen_ticket = "&o[so_lan_hen_ticket]=ASC";
    if (data.so_lan_hen_ticket === false) {
      sort_so_lan_hen_ticket = "&o[so_lan_hen_ticket]=DESC";
    }
  }

  if (Number(data.type) === 1 || Number(data.type) === 7) {
    id = "&id=" + data.id;
  } else {
    if (data.pbn) pbn = "&pbn=" + data.pbn;
  }
  if (data.rate_customer) {
    rate_customer = "&rate_customer=" + data.rate_customer;
  }
  if (data.type_chat_luong_cuoc_goi) {
    type_chat_luong_cuoc_goi =
      "&type_chat_luong_cuoc_goi=" + data.type_chat_luong_cuoc_goi;
  }
  if (!!data.device) {
    device = "&device=" + data.device;
  }

  let description = "";
  if (data.description) {
    description = "&description=" + data.description;
  }
  return request({
    url:
      "/restful/listticket?page=" +
      data.page +
      rate_customer +
      "&approved=" +
      data.approved +
      "&" +
      (data.store_field || "store") +
      "=" +
      data.code_store +
      "&date_cre_date_start=" +
      data.date_cre_date_start +
      "&date_cre_date_end=" +
      data.date_cre_date_end +
      "&phone=" +
      data.phone +
      description +
      "&type=" +
      +data.type +
      pbn +
      id +
      doitra +
      type_chat_luong_cuoc_goi +
      status_cuoc_goi_den_hen +
      sort +
      sort_so_lan_gui_ticket +
      sort_so_lan_hen_ticket +
      "&tienphat=" +
      data.tienphat +
      device,
    method: "get",
  });
}
export function getListsrecord(data) {
  return request({
    url:
      "/restful/listticket?page=" +
      data.page +
      "&approved=" +
      data.approved +
      "&store=" +
      data.code_store +
      "&date_cre_date_start=" +
      data.date_cre_date_start +
      "&date_cre_date_end=" +
      data.date_cre_date_end +
      "&pbn=" +
      data.pbn +
      "&phone=" +
      data.phone,
    method: "get",
  });
}
export function getListsRecords(id) {
  return request({
    url: "/restful/listlogrecord?cid_ticket=" + id,
    method: "get",
  });
}

export function getStore() {
  return request({
    url: "/restful/liststore?&limit=999",
    method: "get",
  });
}
export function addTicketStaff(data) {
  return request({
    url: "/restful/addticket2?",
    method: "post",
    data,
  });
}
export function addTicketSupplies(data) {
  return request({
    url: "/restful/addticket6?",
    method: "post",
    data,
  });
}
export function addTicketQc(data) {
  return request({
    url: "/restful/addticket4?",
    method: "post",
    data,
  });
}
export function addTicketOnline(data) {
  return request({
    url: "/restful/addticket5?",
    method: "post",
    data,
  });
}
export function saveStore(data) {
  return request({
    url: "/restful/changecodestore?",
    method: "post",
    data,
  });
}
export function cloneticket(data) {
  return request({
    url: "/restful/cloneticket?",
    method: "post",
    data,
  });
}

export function updateTicket(data) {
  return request({
    url: "/restful/updateticket?",
    method: "post",
    data,
  });
}
export function luunotexuly(data) {
  return request({
    url: "/restful/updatenotexulychinhanh?",
    method: "post",
    data,
  });
}
export function updateRecord(data) {
  return request({
    url: "/restful/updateticketrecord?",
    method: "post",
    data,
  });
}
export function deleteTicketStaff(data) {
  return request({
    url: "/restful/removeticket?",
    method: "post",
    data,
  });
}
export function getLog(data) {
  let cid_ticket = "";
  let pbn = "";
  if (data.id) {
    cid_ticket = "&cid_ticket=" + data.id;
  }
  if (data.pbn) {
    pbn = "&pbn=" + data.pbn;
  }
  return request({
    url: "/restful/listlogticket?page=" + data.page + cid_ticket + pbn,
    method: "get",
  });
}

export function saveQcdanhgia(data) {
  return request({
    url: "/restful/qcchangenote?",
    method: "post",
    data,
  });
}
export function saverateCustomer(data) {
  return request({
    url: "/restful/qcchangerate?",
    method: "post",
    data,
  });
}
export function updateVattu(data, id) {
  return request({
    url: "/restful/appchangesoluongvattu?id=" + id,
    method: "post",
    data,
  });
}
