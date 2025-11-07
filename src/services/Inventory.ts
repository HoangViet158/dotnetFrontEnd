import instance from "../API/AxiosClient";
import type { ResponseApi } from "../type/axios";
import type { InventoryType } from "../type/InventoryType";

export const getProductQuantityInInventory = () : Promise<ResponseApi<InventoryType[]>> => {
  return instance.get("/inventory");
};