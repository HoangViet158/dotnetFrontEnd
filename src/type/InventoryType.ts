export interface InventoryType {
  inventoryId: number;
  productId: number;
  productName: string;
  quantity: number;
  updatedAt: string;
}

export interface InventoryDisplayType extends InventoryType {
  categoryId: number;
  supplierId: number;
  categoryName: string;
  supplierName: string;
}
