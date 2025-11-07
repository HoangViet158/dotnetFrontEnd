export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}


export interface Item{
  productId: number;
  quantity: number;
}

export interface Order {
  customerId: number;
  userId: number;
  promoId?: number;
  items: Item[];
}


export interface OrderResponse {
  orderId: number;
  customerId: number;
  customerName?: string | null;
  userId: number;
  userName?: string | null;
  promoId?: number | null;
  promoCode?: string | null;
  orderDate: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  items: OrderItemResponse[];
  payment?: any | null;
}

export interface OrderItemResponse {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}
