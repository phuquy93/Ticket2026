// Màu cho từng mã trạng thái (approved) - dùng chung cho tất cả dashboard
export const STATUS_COLORS = {
  0: "#9ca3af", // Mới tạo
  2: "#f59e0b", // Cần thẩm định
  5: "#f87171", // Yêu cầu xử lý lại
  3: "#3b82f6", // Đợi ra biên bản
  6: "#7cc47c", // Đã ra biên bản
  4: "#22c55e", // Đã xử lý
  9: "#8b5cf6", // (tuỳ trang: Đổi trả / Cuộc gọi / Đã trả hàng / Vật tư ...)
  10: "#14b8a6", // Hợp lệ
  11: "#ec4899",
  12: "#f97316",
  13: "#06b6d4",
};

// Tạo 1 cấu hình trạng thái: { key, approved, label, path, color }
export function makeStatus(approved, label, path) {
  return {
    key: "s" + approved,
    approved,
    label,
    path,
    color: STATUS_COLORS[approved] || "#64748b",
  };
}
