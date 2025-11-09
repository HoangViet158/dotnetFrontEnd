export interface InventoryType {
  inventoryId: number;
  productId: number;
  quantity: number;
  updatedAt: string;
}

export interface InventoryDisplayType extends InventoryType {
  categoryId: number;
  supplierId: number;
  productName: string;
  categoryName: string;
  supplierName: string;
}
