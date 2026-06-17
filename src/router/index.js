import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout/";

export const constantRoutes = [
  {
    path: "/login",
    alwaysShow: false,
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/",
    alwaysShow: false,
    redirect: "/manage/dashboard",
  },
  {
    path: "/profile",
    component: Layout,
    alwaysShow: false,
    name: "Profile",
    meta: {
      title: "Profile",
      roles: [1, 2, 3, 4, 5],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/profile"),
        name: "Profilelayout",
        meta: {
          title: "Profile",
          roles: [1, 2, 3, 4, 5],
        },
      },
    ],
  },
  {
    path: "/manage/staff/:id",
    component: Layout,
    alwaysShow: false,
    name: "StaffDetail212",
    meta: {
      title: "Chi tiết quản lý ticket nhân viên",
      roles: [1, 2, 3, 4, 5, 6],
    },
    children: [
      {
        path: "/manage/staff/:id",
        component: () => import("@/views/staff/detail.vue"),
        name: "StaffDetailssa",
        meta: {
          isTabs: false,
          title: "Chi tiết quản lý ticket nhân viên",
          roles: [1, 2, 3, 4, 5, 6],
        },
      },
    ],
  },
  {
    path: "/manage/chart",
    component: Layout,
    alwaysShow: true,
    name: "Chart",
    id: 1,
    meta: {
      title: "Biểu đồ ticket",
      icon: "fa fa-signal",
      roles: [1, 2, 3],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/chart/"),
        name: "Chart",
        meta: {
          title: "Biểu đồ ticket",
          roles: [1, 2, 3],
        },
      },
    ],
  },
  {
    path: "/manage/dashboard",
    component: Layout,
    alwaysShow: true,
    name: "Dashboard121",
    id: 1,
    meta: {
      title: "Ticket đánh giá qua Zalo",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboard/"),
        name: "Dashboard",
        meta: {
          title: "Ticket đánh giá qua Zalo",
          roles: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      },
    ],
  },
  {
    path: "/manage/dashboard-nhanvien",
    component: Layout,
    alwaysShow: true,
    name: "Dashboardsasa",
    id: 1,
    meta: {
      title: "Ticket nhân viên qua Camera",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboard2/"),
        name: "Dashboard2x",
        meta: {
          title: "Ticket nhân viên qua Camera",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/dashboardqc",
    component: Layout,
    alwaysShow: true,
    name: "DashboardQC",
    id: 1,
    meta: {
      title: "Ticket đổi trả",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboard_qc/"),
        name: "DashboardQc",
        meta: {
          title: "Dashboard đổi trả",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/dashboardcall",
    component: Layout,
    alwaysShow: true,
    name: "Dashboardcall",
    id: 1,
    meta: {
      title: "Ticket cuộc gọi AI",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboardcall/"),
        name: "Dashboardcall",
        meta: {
          title: "Ticket cuộc gọi AI",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/dashboardinfo",
    component: Layout,
    alwaysShow: true,
    name: "Dashboardinfor",
    id: 1,
    meta: {
      title: "Ticket info - google",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboardinfo/"),
        name: "Dashboardinfor",
        meta: {
          title: "Ticket info",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/dashboardviolate",
    component: Layout,
    alwaysShow: true,
    name: "Dashboardviolate",
    id: 1,
    meta: {
      title: "Ticket GH không thành công",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboardviolate/"),
        name: "Dashboardviolate",
        meta: {
          title: "Ticket GH không thành công",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/dashboardonline",
    component: Layout,
    alwaysShow: true,
    name: "Dashboardonline",
    id: 1,
    meta: {
      title: "Ticket online",
      icon: "fa fa-align-left",
      roles: [1, 2, 8],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboardonline/"),
        name: "Dashboardonline",
        meta: {
          title: "Ticket online",
          roles: [1, 2, 8],
        },
      },
    ],
  },
  {
    path: "/manage/dashboardsupplies",
    component: Layout,
    alwaysShow: true,
    name: "Dashboardsupplies",
    id: 1,
    meta: {
      title: "Ticket vật tư",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboardsupplies/"),
        name: "Dashboardsupplies",
        meta: {
          title: "Ticket vật tư",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/dashboardurgent",
    component: Layout,
    alwaysShow: true,
    name: "Dashboardurgent",
    id: 1,
    meta: {
      title: "Ticket cuộc gọi khẩn",
      icon: "fa fa-align-left",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/dashboardurgent/"),
        name: "Dashboardurgent",
        meta: {
          title: "Ticket cuộc gọi khẩn",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/store",
    component: Layout,
    alwaysShow: true,
    name: "Quản lý chi nhánh",
    id: 1,
    meta: {
      title: "Quản lý chi nhánh",
      icon: "fa fa-hdd",
      roles: [1],
      not_show: [122],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/store/"),
        name: "Store",
        meta: {
          title: "Quản lý chi nhánh",
          roles: [1],
          not_show: [122],
        },
      },
    ],
  },
  {
    path: "/manage/user",
    component: Layout,
    alwaysShow: true,
    name: "UserLayout",
    id: 2,
    meta: {
      title: "Quản lý user",
      icon: "fa fa-user",
      roles: [1],
      not_show: [122],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/user/"),
        name: "User",
        meta: {
          title: "Quản lý user",
          roles: [1],
          not_show: [122],
        },
      },
    ],
  },
  {
    path: "/manage/userqc",
    component: Layout,
    alwaysShow: true,
    name: "UserQcLayout",
    id: 2,
    meta: {
      title: "Quản lý user QC",
      icon: "fa fa-user-circle",
      roles: [1],
      showid: [1, 255],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/userqc/"),
        name: "Userqc",
        meta: {
          title: "Quản lý user QC",
          roles: [1],
          showid: [1, 255],
        },
      },
    ],
  },
  {
    path: "/manage/department",
    component: Layout,
    alwaysShow: true,
    name: "Store121",
    id: 3,
    meta: {
      title: "Quản lý bộ phận",
      icon: "fa fa-cubes",
      roles: [1],
      not_show: [122],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/department/"),
        name: "Storewqwwq",
        meta: {
          title: "Quản lý bộ phận",
          roles: [1],
          not_show: [122],
        },
      },
    ],
  },
  {
    path: "/manage/rate",
    component: Layout,
    alwaysShow: true,
    name: "Ratemanage",
    id: 4,
    meta: {
      title: "Quản lý tiêu chí",
      icon: "fa fa-star",
      roles: [1],
      not_show: [122],
    },
    children: [
      {
        path: "",
        component: () => import("@/views/rate/"),
        name: "Rateviews",
        meta: {
          title: "Quản lý tiêu chí",
          roles: [1],
          not_show: [122],
        },
      },
    ],
  },
  {
    path: "/manage/ticket",
    pathparent: "/manage/dashboard",
    component: Layout,
    alwaysShow: false,
    name: "Ticketmanagea",
    id: 5,
    meta: {
      title: "Quản lý ticket khách hàng",
      icon: "fa fa-check-square",
    },
    children: [
      {
        path: "/manage/ticket",
        component: () => import("@/views/ticket/"),
        name: "Ticket",
        meta: {
          title: "Quản lý ticket KH",
          roles: [1, 2, 3, 4, 6], // or you can only set roles in sub nav
        },
      },
      {
        path: "/manage/new",
        component: () => import("@/views/new/"),
        name: "New",
        meta: {
          title: "Mới tạo ticket KH",
          roles: [1, 2, 3, 4, 6],
        },
      },
      {
        path: "/manage/request",
        component: () => import("@/views/request/"),
        name: "Request",
        meta: {
          title: "Cần thẩm định ticket KH",
          roles: [1, 2, 3, 4, 6],
        },
      },
      {
        path: "/manage/confirm",
        component: () => import("@/views/confirm/"),
        name: "Confirm",
        meta: {
          title: "Yêu cầu xử lý lại ticket KH",
          roles: [1, 2, 3, 4, 6],
        },
      },
      {
        path: "/manage/waitreport",
        component: () => import("@/views/wait_report/"),
        name: "Waitreport",
        meta: {
          title: "Đợi ra biên bản ticket KH",
          roles: [1, 2, 3, 4, 6],
        },
      },

      {
        path: "/manage/report",
        component: () => import("@/views/report/"),
        name: "Report",
        meta: {
          title: "Đã ra biên bản ticket KH",
          roles: [1, 2, 3, 4, 6],
        },
      },
      {
        path: "/manage/cancel",
        component: () => import("@/views/cancel/"),
        name: "Cancel",
        meta: {
          title: "Đã xử lý ticket KH",
          roles: [1, 2, 3, 4, 6],
        },
      },
    ],
  },
  {
    path: "/manage/staff",
    pathparent: "/manage/dashboard-nhanvien",
    component: Layout,
    alwaysShow: false,
    name: "Ticketstaff",
    id: 6,
    meta: {
      title: "Quản lý ticket nhân viên",
      icon: "fa fa-users",
    },
    children: [
      {
        path: "/manage/staff",
        component: () => import("@/views/staff/"),
        name: "Ticketstaffq",
        meta: {
          title: "Quản lý ticket NV",
          roles: [1, 2, 3, 4, 5, 6], // or you can only set roles in sub nav
        },
      },
      {
        path: "/manage/staffnew",
        component: () => import("@/views/staff/new.vue"),
        name: "Ticketstaffnew",
        meta: {
          title: "Mới tạo ticket NV",
          roles: [1, 2, 3, 4, 5, 6], // or you can only set roles in sub nav
        },
      },
      {
        path: "/manage/staffrequest",
        component: () => import("@/views/staff/request.vue"),
        name: "Requeststaff",
        meta: {
          title: "Cần thẩm định ticket NV",
          roles: [1, 2, 3, 4, 5, 6],
        },
      },
      {
        path: "/manage/staffconfirm",
        component: () => import("@/views/staff/confirm.vue"),
        name: "Confirmstaff",
        meta: {
          title: "Yêu cầu xử lý lại ticket NV",
          roles: [1, 2, 3, 4, 5, 6],
        },
      },
      {
        path: "/manage/staffwaitreport",
        component: () => import("@/views/staff/waitreport.vue"),
        name: "Waitreportstaff",
        meta: {
          title: "Đợi ra biên bản ticket NV",
          roles: [1, 2, 3, 4, 5, 6],
        },
      },
      {
        path: "/manage/staffreport",
        component: () => import("@/views/staff/report.vue"),
        name: "Reportstaff",
        meta: {
          title: "Đã ra biên bản ticket NV",
          roles: [1, 2, 3, 4, 5, 6],
        },
      },
      {
        path: "/manage/staffcancel",
        component: () => import("@/views/staff/cancel.vue"),
        name: "Cancelstaff",
        meta: {
          title: "Đã xử lý ticket NV",
          roles: [1, 2, 3, 4, 5, 6],
        },
      },
    ],
  },
  {
    path: "/manage/qc/ticket",
    pathparent: "/manage/dashboardqc",
    component: Layout,
    alwaysShow: false,
    name: "Ticketqc",
    id: 5,
    meta: {
      title: "Quản lý ticket đổi trả",
      icon: "fa fa-suitcase",
    },
    children: [
      {
        path: "/manage/qc/ticket",
        component: () => import("@/views/qc/ticket/"),
        name: "Ticketqcticket",
        meta: {
          title: "Quản lý ticket QC",
          roles: [1, 2, 3, 4, 5, 6, 7], // or you can only set roles in sub nav
        },
      },
      // {
      //   path: '/manage/qc/ticketdt',
      //   component: () => import('@/views/qc/ticketdt/'),
      //   name: 'DT đã trả hàng',
      //   meta: {
      //     title: 'DT đã trả hàng',
      //     roles: [1, 2, 3, 4, 7]// or you can only set roles in sub nav
      //   }
      // },
    ],
  },
  {
    path: "/manage/qc/caller",
    pathparent: "/manage/dashboardcall",
    component: Layout,
    alwaysShow: false,
    name: "Ticketcaller",
    id: 5,
    meta: {
      title: "Quản lý ticket cuộc gọi",
      icon: "fa fa-window-restore",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "/manage/qc/caller",
        component: () => import("@/views/qc/caller/index.vue"),
        name: "Ticketcallerchild",
        meta: {
          title: "Quản lý chất lượng cuộc gọi",
          roles: [1, 2, 3, 4, 5, 6, 7], // or you can only set roles in sub nav
        },
      },
      // {
      //   path: '/manage/qc/callerdt',
      //   component: () => import('@/views/qc/caller/indexdt'),
      //   name: 'callerdt',
      //   meta: {
      //     title: 'Chất lượng cuộc gọi',
      //     roles: [1, 2, 3, 4, 7]// or you can only set roles in sub nav
      //   }
      // },
    ],
  },
  {
    path: "/manage/qc/info",
    pathparent: "/manage/dashboardinfo",
    component: Layout,
    alwaysShow: false,
    name: "Ticketcallerqcinfo",
    id: 5,
    meta: {
      title: "Quản lý ticket info",
      icon: "fa fa-file-archive",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "/manage/qc/info",
        component: () => import("@/views/qc/info/index.vue"),
        name: "Ticketcallerinfo",
        meta: {
          title: "Quản lý ticket info",
          roles: [1, 2, 3, 4, 5, 6, 7], // or you can only set roles in sub nav
        },
      },
      // {
      //   path: '/manage/qc/infodt',
      //   component: () => import('@/views/qc/info/indexdt'),
      //   name: 'callerdtinfodt',
      //   meta: {
      //     title: 'Danh sách ticket info',
      //     roles: [1, 2, 3, 4, 7]// or you can only set roles in sub nav
      //   }
      // },
    ],
  },
  {
    path: "/manage/qc/violate",
    pathparent: "/manage/dashboardviolate",
    component: Layout,
    alwaysShow: false,
    name: "Ticketcallerqcviolate",
    id: 5,
    meta: {
      title: "Quản lý ticket giao hàng",
      icon: "fa fa-braille",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "/manage/qc/violate",
        component: () => import("@/views/qc/violate/index.vue"),
        name: "Ticketcallerqcviolate",
        meta: {
          title: "Quản lý ticket giao hàng",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/qc/online",
    pathparent: "/manage/dashboardonline",
    component: Layout,
    alwaysShow: false,
    name: "Ticketcallerqconline",
    id: 5,
    meta: {
      title: "Quản lý ticket online",
      icon: "fa fa-file-archive",
      roles: [1, 2, 8],
    },
    children: [
      {
        path: "/manage/qc/online",
        component: () => import("@/views/qc/online/index.vue"),
        name: "Ticketcallerqconline",
        meta: {
          title: "Quản lý ticket online",
          roles: [1, 2, 8],
        },
      },
    ],
  },
  {
    path: "/manage/supplies",
    pathparent: "/manage/dashboardsupplies",
    component: Layout,
    alwaysShow: false,
    name: "Ticketsupplies",
    id: 5,
    meta: {
      title: "Quản lý ticket vật tư",
      icon: "fa fa-newspaper",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "/manage/supplies",
        component: () => import("@/views/supplies/index.vue"),
        name: "TicketsuppliesViews",
        meta: {
          title: "Quản lý ticket vật tư",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/urgent",
    pathparent: "/manage/dashboardurgent",
    component: Layout,
    alwaysShow: false,
    name: "Ticketurgent",
    id: 5,
    meta: {
      title: "Quản lý ticket cuộc gọi khẩn",
      icon: "fa fa-newspaper",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "/manage/urgent",
        component: () => import("@/views/urgent/index.vue"),
        name: "TicketurgentViews",
        meta: {
          title: "Quản lý ticket cuộc gọi khẩn",
          roles: [1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  },
  {
    path: "/manage/record",
    component: Layout,
    alwaysShow: true,
    name: "Ticketcallerrecord",
    meta: {
      title: "Báo cáo thống kê",
      icon: "fa fa-columns",
      roles: [1, 2, 3, 4, 5, 6, 7],
    },
    children: [
      {
        path: "/manage/record/customer",
        component: () => import("@/views/record/"),
        name: "Recordcustomer",
        meta: {
          title: "Báo cáo ticket KH",
          roles: [1, 2, 3, 4],
        },
      },
      {
        path: "/manage/staffrecord",
        component: () => import("@/views/staff/record.vue"),
        name: "Recordstaffstaffrecord",
        meta: {
          title: "Báo cáo ticket NV",
          roles: [1, 2, 3, 4],
        },
      },
      {
        path: "/manage/qc/record",
        component: () => import("@/views/qc/record/"),
        name: "Recordqc",
        meta: {
          title: "Báo cáo ticket DT trả hàng",
          roles: [1, 2, 3, 4],
        },
      },
      {
        path: "/manage/qc/caller/record",
        component: () => import("@/views/qc/caller/record.vue"),
        name: "Recordcaller",
        meta: {
          title: "Báo cáo chất lượng cuộc gọi",
          roles: [1, 2, 3, 4],
        },
      },
      {
        path: "/manage/qc/info/record",
        component: () => import("@/views/qc/info/record.vue"),
        name: "Recordinfo",
        meta: {
          title: "Báo cáo ticket info",
          roles: [1, 2, 3, 4],
        },
      },
      {
        path: "/manage/recordgoogle",
        component: () => import("@/views/google/record.vue"),
        name: "Recordgoogle",
        meta: {
          title: "Báo cáo google",
          roles: [1, 2, 3, 4],
        },
      },
      {
        path: "/manage/record/supplies",
        component: () => import("@/views/supplies/record"),
        name: "Recordsupplies",
        meta: {
          title: "Báo cáo ticket vật tư",
          roles: [1, 2, 3, 4],
        },
      },
      {
        path: "/manage/record/urgent",
        component: () => import("@/views/urgent/record"),
        name: "Recordurgent",
        meta: {
          title: "Báo cáo ticket cuộc gọi khẩn",
          roles: [1, 2, 3, 4],
        },
      },
    ],
  },
  // {
  //   path: '/manage/staff',
  //   component: Layout,
  //   alwaysShow: true,
  //   name: 'Ticket',
  //   id: 6,
  //   meta: {
  //     title: 'Quản lý ticket nhân viên',
  //     icon: 'fa fa-users',
  //     roles: [1, 2, 3, 4, 5]
  //   },
  //   children: [
  //     {
  //       path: '/manage/staff',
  //       component: () => import('@/views/staff/'),
  //       name: 'Ticket',
  //       meta: {
  //         title: 'Quản lý ticket NV',
  //         roles: [1, 2, 3, 4, 5]// or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: '/manage/staffnew',
  //       component: () => import('@/views/staff/new.vue'),
  //       name: 'Ticketstaff',
  //       meta: {
  //         title: 'Mới tạo ticket NV',
  //         roles: [1, 2, 4]// or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: '/manage/staffrequest',
  //       component: () => import('@/views/staff/request.vue'),
  //       name: 'Requeststaff',
  //       meta: {
  //         title: 'Cần thẩm định ticket NV',
  //         roles: [1, 2, 3, 4]
  //       }
  //     },
  //     {
  //       path: '/manage/staffconfirm',
  //       component: () => import('@/views/staff/confirm.vue'),
  //       name: 'Confirmstaff',
  //       meta: {
  //         title: 'Yêu cầu xử lý lại ticket NV',
  //         roles: [1, 2, 4]

  //       }
  //     },
  //     {
  //       path: '/manage/staffwaitreport',
  //       component: () => import('@/views/staff/waitreport.vue'),
  //       name: 'Waitreportstaff',
  //       meta: {
  //         title: 'Đợi ra biên bản ticket NV',
  //         roles: [1, 4]
  //       }
  //     },
  //     {
  //       path: '/manage/staffreport',
  //       component: () => import('@/views/staff/report.vue'),
  //       name: 'Reportstaff',
  //       meta: {
  //         title: 'Đã ra biên bản ticket NV',
  //         roles: [1, 4]
  //       }
  //     },
  //     {
  //       path: '/manage/staffcancel',
  //       component: () => import('@/views/staff/cancel.vue'),
  //       name: 'Cancelstaff',
  //       meta: {
  //         title: 'Đã xử lý ticket NV',
  //         roles: [1, 4]
  //       }
  //     },
  //     {
  //       path: '/manage/staffrecord',
  //       component: () => import('@/views/staff/record.vue'),
  //       name: 'Recordstaff',
  //       meta: {
  //         title: 'Báo cáo ticket NV',
  //         roles: [1, 2, 3, 4]
  //       }
  //     },

  //   ]
  // },
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
