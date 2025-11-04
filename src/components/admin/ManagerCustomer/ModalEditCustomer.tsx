import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { updateCustomer } from "../../../services/Customer";
import { toast } from "react-toastify";

const { Option } = Select;

interface ModalEditCustomerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: any;
  fetchCustomer: () => void;
}

const ModalEditCustomer: React.FC<ModalEditCustomerProps> = ({
  open,
  setOpen,
  data,
  fetchCustomer,
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log({
        ...values,
        cusomterId: data.cusomterId,
      });
      const res = await updateCustomer({
        ...values,
        cusomterId: data.cusomterId,
      });
      console.log(res);
      toast.success("Cập nhật khách hàng thành công");
      setOpen(false);
      fetchCustomer();
    } catch (error) {
      toast.error("Cập nhật khách hàng thất bại");
      console.error(error);
    }
  };

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
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(0|\+84)[0-9]{9,10}$/,
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
            { required: true, message: "Vui lòng nhập Email!" },
            { type: "email", message: "Email không hợp lệ!" }, // kiểm tra định dạng
          ]}
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
