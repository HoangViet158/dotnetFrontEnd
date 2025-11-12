import instance from "../API/AxiosClient";
import type { Customer, CustomerResponse } from "../type/Customer";
import type { ResponseApi } from "../type/axios";

export const getAllCustomers = (): Promise<ResponseApi<CustomerResponse[]>> => {
  return instance.get("/customer");
};

export const createNewCustomer = (data: Customer): Promise<ResponseApi<CustomerResponse>> => {
  return instance.post("/customer", data);
};

// Cập nhật khách hàng theo ID
export const updateCustomer = (data: Customer) => {
  // if (!data.customerId) throw new Error("customerId is required for update");
  // return instance.put(`/customer/${data.customerId}`, data);
  return 1;
};

// Xóa khách hàng
export const deleteCustomer = (id: number) => {
  return instance.delete(`/customer/${id}`);
};
