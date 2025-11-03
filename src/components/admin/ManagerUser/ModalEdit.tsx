import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { UpdateUser } from "../../../services/User";
import { toast } from "react-toastify";

const { Option } = Select;

interface ModelEditProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: any;
  fetchAllUsers: () => Promise<void>;
}

const ModelEdit: React.FC<ModelEditProps> = ({
  open,
  setOpen,
  data,
  fetchAllUsers,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && data) {
      // ✅ Gán dữ liệu chính xác theo field form
      form.setFieldsValue({
        username: data.username || "",
        fullName: data.fullName || data.full_name || "",
        password: data.password || "",
        role: data.role || "",
      });
    } else {
      form.resetFields();
    }
  }, [open, data, form]);

  // ✅ Hàm xử lý lưu
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(data.id);
      console.log(values);

      let dataRequest = {
        id: data.id,
        username: values.username,
        fullName: values.fullName,
        role: values.role,
      };
      let res = await UpdateUser(dataRequest);

      if (res && res.data && res.success === true) {
        toast.success("Sửa người dùng thành công!");
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mật khẩu" name="password">
          <Input.Password disabled />
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
