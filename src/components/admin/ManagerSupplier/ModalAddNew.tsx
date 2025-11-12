import React from "react";
import { Modal, Form, Input, message, Select } from "antd";
import { createNewSupplier } from "../../../services/Suppliers";
import type { SupplierType } from "../../../type/SuppliersType";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSuccess?: () => void; // gọi sau khi thêm thành công
}

const ModalAddSupplier: React.FC<Props> = ({ open, setOpen, onSuccess }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values: SupplierType = await form.validateFields();
      await createNewSupplier(values);
      message.success("Thêm nhà cung cấp thành công");
      setOpen(false);
      form.resetFields();
      if (onSuccess) onSuccess(); // reload dữ liệu
    } catch (error: any) {
      console.error(error);
      message.error("Thêm nhà cung cấp thất bại");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm nhà cung cấp"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên nhà cung cấp"
          name="name"
          rules={[{ required: true, message: "Nhập tên nhà cung cấp" }]}
        >
          <Input placeholder="VD: Công ty TNHH ABC" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(0|\+84)[0-9]{9}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea placeholder="Nhập địa chỉ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddSupplier;
