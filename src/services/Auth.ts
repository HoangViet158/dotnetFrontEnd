import { data } from "react-router-dom";
import instance from "../API/AxiosClient";
import type { UserLogin, UserRegister } from "../type/Auth";
import type { ResponseApi } from "../type/axios";

export const LoginAPI = (data: UserLogin): Promise<ResponseApi> => {
  return instance.post("/auth/login", data);
};
export const RegisterAPI = (data: UserRegister): Promise<ResponseApi> => {
  return instance.post("/auth/register", data);
};
