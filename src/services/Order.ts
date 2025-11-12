import instance from "../API/AxiosClient";
import type { ResponseApi } from "../type/axios";
import type { Order, OrderResponse } from "../type/OrderType";

export const createOrder = (data: Order): Promise<ResponseApi<OrderResponse>> => {
  return instance.post("/orders", data);
};

export const updateOrderStatus = (
  orderId: number
): Promise<ResponseApi<string>> => {
  return instance.put(`/orders/${orderId}`);
};

export const getOrderById = (orderId: number): Promise<ResponseApi<OrderResponse>> => {
  return instance.get(`/orders/${orderId}`);
};

export const exportOrderToPdf = async (orderId: number): Promise<void> => {
  const response = await instance.get(`/orders/${orderId}/export-pdf`, {
    responseType: "blob",
    headers: { "X-Bypass-JSON-Interceptor": "true" },
    transformResponse: [(data) => data],
  });

  // Lấy Blob từ response.data
  const blob = response.data as Blob;

  const fileURL = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", `Order_${orderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};


