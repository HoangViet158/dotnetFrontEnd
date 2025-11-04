export interface Promotion {
  promoId?: number;
  promoCode: string;
  description?: string;
  discountType: "percent" | "amount";
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  status: "active" | "inactive";
}
