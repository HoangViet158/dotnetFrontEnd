import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";

const { Option } = Select;

interface ModalEditCustomerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: any;
}

const ModalEditCustomer: React.FC<ModalEditCustomerProps> = ({
  open,
  setOpen,
  data,
}) => {
  const [form] = Form.useForm();

  // Khi mở modal thì tự set dữ liệu người dùng cần sửa vào form
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [data, form, open]);

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
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
        >
          <Input placeholder="Nhập Email" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditCustomer;
