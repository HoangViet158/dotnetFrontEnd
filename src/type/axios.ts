export interface ResponseApi<T = any> {
  success: boolean;
  message: string;
  data: T;
}
