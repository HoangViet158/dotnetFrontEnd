import instance from "../API/AxiosClient";
import type { CategoryType } from "../type/CategoryType";

// Lấy tất cả danh mục
export const getAllCategories = () => {
  return instance.get("/category");
};

export const GetCategoryById = (id: number) => {
  return instance.get(`/category/${id}`);
};

export const CreateNewCategory = (data: CategoryType) => {
  return instance.post("/category", data);
};
