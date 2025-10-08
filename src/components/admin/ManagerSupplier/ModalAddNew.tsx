import React from "react";
import { Modal, Form, Input, message, Select } from "antd";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const ModalAddSupplier: React.FC<Props> = ({ open, setOpen }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(() => {
      message.success("Thêm nhà cung cấp thành công (demo)");
      setOpen(false);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Thêm nhà cung cấp"
      open={open}
      onCancel={() => setOpen(false)}
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
        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Select
            placeholder="Chọn trạng thái"
            options={[
              { label: "Hoạt động", value: "active" },
              { label: "Ngừng", value: "inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddSupplier;
