import instance from "../API/AxiosClient";
import type { ResponseApi } from "../type/axios";
import type { Promotion } from "../type/Promotion";

export const getAllPromotions = ():  Promise<ResponseApi<Promotion[]>> => {
  return instance.get("/promotion");
};

export const getPromotionsWithMinOrderAmountGreaterThanAsync = (minOrderAmount: number):  Promise<ResponseApi<Promotion[]>> => {
  return instance.get(`/promotion/min-order/${minOrderAmount}`);
};

export const createNewPromotion = (data: Promotion) => {
  console.log("data", data);
  return instance.post("/promotion", data);
};

export const updatePromotion = (data: Promotion) => {
  if (!data.promoId) throw new Error("promotionId is required for update");
  return instance.put(`/promotion/${data.promoId}`, data);
};

export const deletePromotion = (id: number) => {
  return instance.delete(`/promotion/${id}`);
};
