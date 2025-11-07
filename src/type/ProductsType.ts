export interface ProductType {
  productId: number;
  productName: string;
  barcode: string;
  price: number;
  categoryId: number;
  categoryName: string;
  supplierId: number;
  supplierName?: string | null;
  unit: string;
  currentStock?: number | null;
  createdAt: string;
}
