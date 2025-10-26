import React from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import type { ProductType } from "../../../type/ProductsType";

interface Category {
  categoryId: number;
  categoryName: string;
}

interface Supplier {
  supplierId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}
interface ModalAddNewProductProps {
  listCategories?: Category[];
  listSuppliers?: Supplier[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: ProductType) => void;
}

const ModalAddNewProduct: React.FC<ModalAddNewProductProps> = ({
  open,
  setOpen,
  onSubmit,
  listCategories,
  listSuppliers,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values); // Gửi dữ liệu ra ngoài component cha
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
          name="ProductName"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Mã vạch (Barcode)"
          name="Barcode"
          rules={[{ required: true, message: "Vui lòng nhập mã vạch!" }]}
        >
          <Input placeholder="Nhập mã vạch" />
        </Form.Item>

        <Form.Item
          label="Giá sản phẩm"
          name="Price"
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
          name="CategoryId"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select
            placeholder="Chọn danh mục"
            options={listCategories?.map((category) => ({
              label: category.categoryName,
              value: category.categoryId,
            }))}
          ></Select>
        </Form.Item>

        <Form.Item
          label="Nhà cung cấp"
          name="SupplierId"
          rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
        >
          <Select
            placeholder="Chọn nhà cung cấp"
            options={listSuppliers?.map((supplier) => ({
              label: supplier.name,
              value: supplier.supplierId,
            }))}
          ></Select>
        </Form.Item>

        <Form.Item
          label="Đơn vị tính"
          name="Unit"
          rules={[{ required: true, message: "Vui lòng nhập đơn vị tính!" }]}
        >
          <Input placeholder="Nhập đơn vị (ví dụ: chai, lon, hộp...)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddNewProduct;
