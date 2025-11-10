import React, { useEffect } from "react";
import { Modal, Form, Input, message, Select } from "antd";
import { updateSupplier } from "../../../services/Suppliers";
import type { SupplierType } from "../../../type/SuppliersType";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: SupplierType | null;
  onSuccess?: () => void; // callback sau khi update thành công
}

const ModalEditSupplier: React.FC<Props> = ({
  open,
  setOpen,
  data,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [data, form]);
  console.log(data);

  const handleOk = async () => {
    try {
      const values: SupplierType = await form.validateFields();
      if (!data) return;

      await updateSupplier(Number(data.supplier_id), values); // gọi API update
      message.success("Cập nhật nhà cung cấp thành công");
      setOpen(false);
      if (onSuccess) onSuccess(); // reload danh sách
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Chỉnh sửa nhà cung cấp"
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
          <Input />
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditSupplier;
