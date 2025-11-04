import instance from "../API/AxiosClient";
import type { Promotion } from "../type/Promotion";

// Lấy tất cả khuyến mãi, có phân trang / filter nếu backend hỗ trợ
export const getAllPromotions = () => {
  return instance.get("/promotion");
};

// Thêm khuyến mãi mới
export const createNewPromotion = (data: Promotion) => {
  console.log("data", data);
  return instance.post("/promotion", data);
};

// Cập nhật khuyến mãi theo ID
export const updatePromotion = (data: Promotion) => {
  if (!data.promoId) throw new Error("promotionId is required for update");
  return instance.put(`/promotion/${data.promoId}`, data);
};

// Xóa khuyến mãi
export const deletePromotion = (id: number) => {
  return instance.delete(`/promotion/${id}`);
};
