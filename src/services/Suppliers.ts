import instance from "../API/AxiosClient";
import type { SupplierType } from "../type/SuppliersType";
import type { ResponseApi } from "../type/axios";

export const getAllSuppliers = (): Promise<ResponseApi<SupplierType[]>> => {
  return instance.get("/supplier");
};
export const createNewSupplier = (data: SupplierType): Promise<ResponseApi<SupplierType>> => {
  return instance.post("/supplier/add", data);
};

export const updateSupplier = (id: number, data: SupplierType): Promise<ResponseApi<SupplierType>> => {
  return instance.put(`/supplier/update/${id}`, data);
};

export const deleteSupplier = (id: number): Promise<ResponseApi<SupplierType>> => {
  return instance.delete(`/supplier/delete/${id}`);
};
