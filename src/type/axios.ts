export interface ResponseApi<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  errors: string;
  data: T;
}
