import React from "react";
import {
  Modal,
  Typography,
  Row,
  Col,
  Divider,
  Image,
  Button,
  Space,
} from "antd";

const { Title, Text } = Typography;

interface ProductItem {
  key: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface ModelConfirmPayProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  products: ProductItem[];
  customer: CustomerInfo;
  createdBy: string;
  createdAt: string;
}

const ModelConfirmPay: React.FC<ModelConfirmPayProps> = ({
  open,
  onCancel,
  onConfirm,
  products,
  customer,
  createdBy,
  createdAt,
}) => {
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
      title={<Title level={4}>Xác nhận thanh toán</Title>}
    >
      {/* Thông tin khách hàng & người tạo đơn */}
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text strong>Khách hàng:</Text>
            <div>{customer.name}</div>
            <div>{customer.phone}</div>
            {customer.email && <div>{customer.email}</div>}
            {customer.address && <div>{customer.address}</div>}
          </Col>
          <Col span={12}>
            <Text strong>Người tạo đơn:</Text>
            <div>{createdBy}</div>
            <div>Ngày tạo: {createdAt}</div>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Danh sách sản phẩm */}
      <div>
        {products.map((item) => (
          <Row
            key={item.key}
            align="middle"
            style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
            gutter={16}
          >
            <Col flex="60px">
              <Image
                src={item.image}
                alt={item.name}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 4 }}
                preview={false}
              />
            </Col>
            <Col flex="auto">
              <Row justify="space-between" align="middle">
                <Col>
                  <Text>{item.name}</Text>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Số lượng: {item.quantity}
                  </div>
                </Col>
                <Col>
                  <Text>{(item.price * item.quantity).toLocaleString()} ₫</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        ))}
      </div>

      <Divider />

      {/* Tổng tiền */}
      <Row justify="space-between" style={{ marginBottom: 4 }}>
        <Text>Tổng số lượng:</Text>
        <Text>{totalQuantity}</Text>
      </Row>
      <Row justify="space-between" style={{ marginBottom: 4 }}>
        <Text>Tổng tiền hàng:</Text>
        <Text>{totalPrice.toLocaleString()} ₫</Text>
      </Row>
      <Divider style={{ margin: "8px 0" }} />
      <Row justify="space-between">
        <Text strong>Tổng thanh toán:</Text>
        <Text strong style={{ color: "#1677ff" }}>
          {totalPrice.toLocaleString()} ₫
        </Text>
      </Row>

      <Divider />

      {/* Nút hành động */}
      <Row justify="end">
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" onClick={onConfirm}>
            Xác nhận thanh toán
          </Button>
        </Space>
      </Row>
    </Modal>
  );
};

export default ModelConfirmPay;
