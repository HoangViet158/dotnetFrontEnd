import React, { useEffect } from "react";
import { Modal, Form, Input, message, Select } from "antd";

interface Supplier {
  supplier_id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  status: "active" | "inactive";
}

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: Supplier | null;
}

const ModalEditSupplier: React.FC<Props> = ({ open, setOpen, data }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  const handleOk = () => {
    form.validateFields().then(() => {
      message.success("Cập nhật nhà cung cấp thành công (demo)");
      setOpen(false);
    });
  };

  return (
    <Modal
      title="Chỉnh sửa nhà cung cấp"
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
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Select
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

export default ModalEditSupplier;
