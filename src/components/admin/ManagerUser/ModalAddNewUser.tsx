import React from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import {
  IdcardOutlined,
  LockOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CreateUser } from "../../../services/User";
import { toast } from "react-toastify";

const { Option } = Select;

interface ModalAddNewUserProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchAllUsers: () => Promise<void>;
}

const ModalAddNewUser: React.FC<ModalAddNewUserProps> = ({
  open,
  setOpen,
  fetchAllUsers,
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    try {
      const data = {
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        role: values.role,
      };

      const res = await CreateUser(data);

      if (res && res.data && res.success === true) {
        toast.success("Tạo người dùng thành công!");

        fetchAllUsers();
        form.resetFields();
        setOpen(false);
      }
    } catch (error: any) {
      toast.error("Người dùng đã tồn tại trong hệ thống");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm người dùng mới"
      open={open}
      onCancel={handleCancel}
      footer={null} // 🧹 bỏ nút OK/Hủy mặc định, dùng nút trong form
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
        style={{ padding: "10px 20px" }}
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập tên đăng nhập"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="Nhập họ tên đầy đủ"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò" size="large">
            <Option value="admin">Admin</Option>
            <Option value="staff">Nhân viên</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{
              width: "100%",
              borderRadius: 8,
              fontWeight: 600,
              letterSpacing: 0.3,
            }}
          >
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddNewUser;
