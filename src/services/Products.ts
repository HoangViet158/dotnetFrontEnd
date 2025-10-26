import instance from "../API/AxiosClient";
import type { ProductType } from "../type/ProductsType";
// Lấy tất cả sản phẩm, có phân trang và filter theo tên
export const getAllProducts = () => {
  return instance.get("/product");
};

// Thêm sản phẩm mới
export const createNewProduct = (data: ProductType) => {
  return instance.post("/product/add", data);
};

// Cập nhật sản phẩm
export const updateProduct = (data: ProductType) => {
  if (!data.productId) throw new Error("product_id is required for update");
  return instance.put(`/product/${data.productId}`, data);
};

// Xóa sản phẩm
export const deleteProduct = (id: number) => {
  return instance.delete(`/product/delete/${id}`);
};
