import instance from "../API/AxiosClient";
import type { UserLogin } from "../type/Auth";

export const LoginAPI = (data: UserLogin) => {
  return instance.post("/login", data);
};
