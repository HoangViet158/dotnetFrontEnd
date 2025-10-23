import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { RegisterAPI } from "../../services/Auth";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const confirmPassword = formData.get("confirm-password")?.toString().trim();

    if (!username || !password) {
      message.error("Vui lòng nhập username và mật khẩu!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    try {
      const res = await RegisterAPI({ username, password });

      if (res?.success) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        message.error(res?.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      console.error(err);
      message.error("Không thể kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h2 className="text-xl text-center font-bold text-gray-900 dark:text-white">
              Create an account
            </h2>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  className="w-full border rounded-lg p-2.5"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="w-full border rounded-lg p-2.5"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  required
                  className="w-full border rounded-lg p-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5"
              >
                {loading ? "Đang xử lý..." : "Create an account"}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
