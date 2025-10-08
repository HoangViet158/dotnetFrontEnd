import React from "react";
import { Modal, Form, Input, Select, message } from "antd";

const { Option } = Select;

interface ModalAddNewCustomerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: any) => void;
}

const ModalAddNewCustomer: React.FC<ModalAddNewCustomerProps> = ({
  open,
  setOpen,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values); // Gửi dữ liệu ra ngoài component cha
      message.success("Thêm người dùng mới thành công!");
      form.resetFields();
      setOpen(false);
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm khách hàng mới"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Thêm"
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

export default ModalAddNewCustomer;
