import axios from "axios";
import { message } from "antd";

const instance = axios.create({
  baseURL: "http://localhost:5247/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
     // Nếu header đánh dấu export PDF, trả nguyên response.data
    if (response.config?.headers?.["X-Bypass-JSON-Interceptor"]) {
      return response;
    }
    return response?.data ?? response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        message.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        // Xóa token cũ
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Chờ một chút để người dùng thấy thông báo
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else if (status === 403) {
        message.error("Bạn không có quyền truy cập!");
      } else if (status === 500) {
        message.error("Lỗi máy chủ. Vui lòng thử lại sau!");
      } else {
        message.error(error.response.data?.message || "Đã xảy ra lỗi!");
      }

      return Promise.reject(error.response.data);
    }

    message.error("Không thể kết nối đến máy chủ!");
    return Promise.reject(error);
  }
);

export default instance;
