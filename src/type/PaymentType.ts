export interface VnPayRequest {
  orderId: number,
  orderType: string,
  amount: number,
  orderDescription: string,
  name?: string
}