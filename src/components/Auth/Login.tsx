import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { LoginAPI } from "../../services/Auth";
import Image from "../../assets/1.jpg";

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await LoginAPI({
        username: values.email,
        password: values.password,
      });
      console.log(res);
      message.success("Đăng nhập thành công!");
    } catch (err) {
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-50">
        <img src={Image} alt="illustration" className="w-2/3 mb-6" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          Receive payments from any banking system
        </h2>
        <p className="text-gray-500 text-center max-w-xs">
          Connect your bank card, and create accounts in the selected currency.
        </p>
        <div className="flex space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <div className="text-2xl">👋</div>
            <Title level={2}>Welcome back!</Title>
            <Text type="secondary">Please login to access your account.</Text>
          </div>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              label="E-mail or phone number"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Type your e-mail or phone number" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Type your password" />
            </Form.Item>

            <div className="text-right mb-2">
              <Link href="#">Forgot Password?</Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Log In
              </Button>
            </Form.Item>

            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-600">
                Sign Up
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
