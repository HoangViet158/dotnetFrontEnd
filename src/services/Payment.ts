import instance from "../API/AxiosClient";
import type { ResponseApi } from "../type/axios";
import type { VnPayRequest } from "../type/PaymentType";

export const createPaymentUrlVnpay = (
  data: VnPayRequest
): Promise<ResponseApi<{ paymentUrl: string }>> => {
  return instance.post("/payment/create-vnpay", data);
};