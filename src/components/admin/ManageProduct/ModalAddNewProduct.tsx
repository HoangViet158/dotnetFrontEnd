import React from "react";
import { Modal, Form, Input, Select, message, InputNumber } from "antd";

const { Option } = Select;

interface ModalAddNewProductProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: any) => void;
}

const ModalAddNewProduct: React.FC<ModalAddNewProductProps> = ({
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
          label="Tên sản phẩm"
          name="product_name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Mã vạch (Barcode)"
          name="barcode"
          rules={[{ required: true, message: "Vui lòng nhập mã vạch!" }]}
        >
          <Input placeholder="Nhập mã vạch" />
        </Form.Item>

        <Form.Item
          label="Giá sản phẩm"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập giá sản phẩm"
          />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category_id"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select placeholder="Chọn danh mục">
            <Option value={1}>Bánh kẹo</Option>
            <Option value={2}>Đồ uống</Option>
            <Option value={3}>Gia vị</Option>
            <Option value={4}>Mỹ phẩm</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Nhà cung cấp"
          name="supplier_id"
          rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
        >
          <Select placeholder="Chọn nhà cung cấp">
            <Option value={1}>Coca</Option>
            <Option value={2}>Pepsi</Option>
            <Option value={3}>Lays</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Đơn vị tính"
          name="unit"
          rules={[{ required: true, message: "Vui lòng nhập đơn vị tính!" }]}
        >
          <Input placeholder="Nhập đơn vị (ví dụ: chai, lon, hộp...)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddNewProduct;
