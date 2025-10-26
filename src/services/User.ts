import instance from "../API/AxiosClient";
import type { ResponseApi } from "../type/axios";

export const GetUserAll = (): Promise<ResponseApi> => {
  return instance.get("/user");
};
