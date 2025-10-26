import instance from "../API/AxiosClient";
import type { Supplier } from "../type/SuppliersType";

export const getAllSuppliers = () => {
  return instance.get("/supplier");
};
export const createNewSupplier = (data: Supplier) => {
  return instance.post("/supplier/add", data);
};

export const updateSupplier = (id: number, data: Supplier) => {
  return instance.put(`/supplier/update/${id}`, data);
};

export const deleteSupplier = (id: number) => {
  return instance.delete(`/supplier/delete/${id}`);
};
