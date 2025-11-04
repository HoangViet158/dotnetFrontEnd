import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import { Value } from "sass";
import { updateProduct } from "../../../services/Products";
import { toast } from "react-toastify";

const { Option } = Select;
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

interface ModalEditProductProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: any;
  listCategories?: Category[];
  listSuppliers?: Supplier[];
  fetchProducts: () => void;
}

const ModalEditProduct: React.FC<ModalEditProductProps> = ({
  open,
  setOpen,
  data,
  listCategories,
  listSuppliers,
  fetchProducts,
}) => {
  const [form] = Form.useForm();

  // Khi mở modal thì tự set dữ liệu người dùng cần sửa vào form
  useEffect(() => {
    console.log(data);
    if (data) {
      form.setFieldsValue({
        ...data,
        categoryId: data.category?.categoryId,
        supplierId: data.supplier?.supplierId,
      });
    } else {
      form.resetFields();
    }
  }, [data, form, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log({
        ...values,
        product_id: data.productId,
      });
      const res = await updateProduct({
        ...values,
        productId: data.productId,
      });
      console.log(res);
      toast.success("Cập nhật sản phẩm thành công");
      setOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Cập nhật sản phẩm thất bại");
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
          label="Tên sản phẩm"
          name="productName"
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
          name="categoryId"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select
            placeholder="Chọn danh mục"
            options={listCategories?.map((item) => ({
              value: item.categoryId,
              label: item.categoryName,
            }))}
          ></Select>
        </Form.Item>

        <Form.Item
          label="Nhà cung cấp"
          name="supplierId"
          rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
        >
          <Select
            placeholder="Chọn nhà cung cấp"
            options={listSuppliers?.map((item) => ({
              value: item.supplierId,
              label: item.name,
            }))}
          ></Select>
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
