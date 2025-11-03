import { data } from "react-router-dom";
import instance from "../API/AxiosClient";
import type { ResponseApi } from "../type/axios";
import type { UserRequest, UserUpdateRequest } from "../type/User";

export const GetUserAll = (): Promise<ResponseApi> => {
  return instance.get("/users");
};

export const CreateUser = (data: UserRequest): Promise<ResponseApi> => {
  return instance.post("/users", data);
};
export const DeleteUser = (id: number): Promise<ResponseApi> => {
  return instance.delete(`/users/${id}`);
};

export const UpdateUser = (data: UserUpdateRequest): Promise<ResponseApi> => {
  return instance.put(`/users/${data.id}`, data);
};
export const GetUserbyId = (): Promise<ResponseApi> => {
  return instance.get("/users");
};
