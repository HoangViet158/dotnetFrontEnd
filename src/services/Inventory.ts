import instance from "../API/AxiosClient";
import type { ResponseApi } from "../type/axios";
import type { InventoryType } from "../type/InventoryType";

export const getProductQuantityInInventory = (): Promise<ResponseApi<InventoryType[]>> => {
  return instance.get("/inventory");
};

// Lấy tất cả danh mục
export const getAllInventories = (): Promise<ResponseApi<InventoryType[]>> => {
  return instance.get("/inventory");
};

export const GetInventoryById = (id: number) => {
  return instance.get(`/category/${id}`);
};

export const CreateNewCategory = (data: InventoryType) => {
  return instance.post("/category", data);
};