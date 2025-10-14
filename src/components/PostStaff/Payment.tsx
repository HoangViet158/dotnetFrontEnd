import React from "react";
import {
  Modal,
  QRCode,
  Divider,
  Typography,
  Row,
  Col,
  Button,
  Space,
} from "antd";

const { Title, Text } = Typography;

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface ProductInfo {
  name: string;
  quantity: number;
  price: number;
  total: number;
  startDate?: string;
}

interface PaymentProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentInfo: {
    amount: number;
    accountName: string;
    bank: string;
    accountNumber: string;
    qrValue: string;
  };
  product: ProductInfo;
  customer: CustomerInfo;
  createdBy: string;
  createdAt: string;
}

const Payment: React.FC<PaymentProps> = ({
  open,
  onClose,
  onConfirm,
  paymentInfo,
  product,
  customer,
  createdBy,
  createdAt,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={640}
      title={
        <Title level={4} style={{ textAlign: "center", margin: 0 }}>
          Xác nhận thanh toán
        </Title>
      }
    >
      {/* QR + Số tiền */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <QRCode value={paymentInfo.qrValue} size={200} bordered={false} />
        <div
          style={{
            marginTop: 12,
            fontSize: 24,
            fontWeight: 600,
            color: "#16a34a",
          }}
        >
          {paymentInfo.amount.toLocaleString()} VNĐ
        </div>
        <Text type="secondary" style={{ fontStyle: "italic" }}>
          📌 Quét mã để thanh toán nhanh chóng
        </Text>
      </div>

      <Divider />

      {/* Thông tin tài khoản ngân hàng */}
      <div style={{ marginBottom: 16 }}>
        <Text strong>🏦 Thông tin chuyển khoản</Text>
        <Divider style={{ margin: "8px 0" }} />
        <p>
          <Text strong>Ngân hàng:</Text> {paymentInfo.bank}
        </p>
        <p>
          <Text strong>Số tài khoản:</Text> {paymentInfo.accountNumber}
        </p>
        <p>
          <Text strong>Chủ tài khoản:</Text> {paymentInfo.accountName}
        </p>
      </div>

      {/* Thông tin sản phẩm */}
      <div style={{ marginBottom: 16 }}>
        <Text strong>🧾 Thông tin sản phẩm</Text>
        <Divider style={{ margin: "8px 0" }} />
        <Row>
          <Col span={12}>
            <p>
              <Text strong>Tên:</Text> {product.name}
            </p>
            {product.startDate && (
              <p>
                <Text strong>Ngày khởi hành:</Text> {product.startDate}
              </p>
            )}
            <p>
              <Text strong>Số lượng:</Text> {product.quantity}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <Text strong>Giá:</Text> {product.price.toLocaleString()} VNĐ
            </p>
            <p>
              <Text strong>Tổng tiền:</Text> {product.total.toLocaleString()}{" "}
              VNĐ
            </p>
          </Col>
        </Row>
      </div>

      {/* Thông tin khách hàng */}
      <div style={{ marginBottom: 16 }}>
        <Text strong>👤 Thông tin khách hàng</Text>
        <Divider style={{ margin: "8px 0" }} />
        <p>
          <Text strong>Họ tên:</Text> {customer.name}
        </p>
        <p>
          <Text strong>Điện thoại:</Text> {customer.phone}
        </p>
        {customer.email && (
          <p>
            <Text strong>Email:</Text> {customer.email}
          </p>
        )}
        {customer.address && (
          <p>
            <Text strong>Địa chỉ:</Text> {customer.address}
          </p>
        )}
      </div>

      {/* Thông tin người tạo đơn */}
      <div>
        <Text strong>📦 Thông tin đơn hàng</Text>
        <Divider style={{ margin: "8px 0" }} />
        <p>
          <Text strong>Người tạo:</Text> {createdBy}
        </p>
        <p>
          <Text strong>Ngày tạo:</Text> {createdAt}
        </p>
      </div>

      {/* Nút hành động */}
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={onConfirm}>
            Xác nhận đã chuyển
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default Payment;
