import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";

const { Option } = Select;

interface ModelEditProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: any;
}

const ModelEdit: React.FC<ModelEditProps> = ({ open, setOpen, data }) => {
  const [form] = Form.useForm();

  // Khi mở modal thì tự set dữ liệu người dùng cần sửa vào form
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleOk = async () => {};

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Chỉnh sửa người dùng"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu thay đổi"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input disabled /> {/* username thường không cho sửa */}
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mật khẩu" name="password">
          <Input.Password placeholder="Để trống nếu không muốn đổi" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="admin">Admin</Option>
            <Option value="staff">Nhân viên</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModelEdit;
