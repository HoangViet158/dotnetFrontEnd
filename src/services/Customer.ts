import instance from "../API/AxiosClient";
import type { Customer } from "../type/Customer";
import type { ResponseApi } from "../type/axios";

// Lấy tất cả khách hàng, có phân trang / filter nếu backend hỗ trợ
export const getAllCustomers = (): Promise<ResponseApi<Customer[]>> => {
  return instance.get("/customer");
};

// Thêm khách hàng mới
export const createNewCustomer = (data: Customer) => {
  return instance.post("/customer", data);
};

// Cập nhật khách hàng theo ID
export const updateCustomer = (data: Customer) => {
  if (!data.customerId) throw new Error("customerId is required for update");
  return instance.put(`/customer/${data.customerId}`, data);
};

// Xóa khách hàng
export const deleteCustomer = (id: number) => {
  return instance.delete(`/customer/${id}`);
};
