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
