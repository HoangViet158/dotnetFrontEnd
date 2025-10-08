import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message, InputNumber } from "antd";

const { Option } = Select;

interface ModalEditProductProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: any;
}

const ModalEditProduct: React.FC<ModalEditProductProps> = ({
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
            formatter={(value) =>
              ` ${value} ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value: string | undefined) =>
              value ? Number(value.replace(/₫|,|\s/g, "")) : 0
            }
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

export default ModalEditProduct;
