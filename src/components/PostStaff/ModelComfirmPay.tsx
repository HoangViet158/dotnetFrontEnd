import React, { useEffect } from "react";
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
import type { CartItem, OrderResponse } from "../../type/OrderType";
import type { ResponseApi } from "../../type/axios";
import { updateOrderStatus } from "../../services/Order";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface ModelConfirmPayProps {
  open: boolean;
  onCancel: () => void;
  order: OrderResponse | null;
  customer: CustomerInfo | null;
  createdBy: string;
  createdAt: string;
  clearCart: () => void;
  clearCustomerState: () => void;
  fetchProductQuantity: () => Promise<void>;
}

const ModelConfirmPay: React.FC<ModelConfirmPayProps> = ({
  open,
  onCancel,
  order,
  customer,
  createdBy,
  createdAt,
  clearCart,
  clearCustomerState,
  fetchProductQuantity,
}) => {
  const totalQuantity = order?.items.reduce((sum, p) => sum + p.quantity, 0);
  const totalAmount = order?.items.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const handleUpdateOrderStatus = async () => {
    if (!order?.orderId) {
      toast.error("Không tìm thấy ID đơn hàng!");
      return;
    }

    try {
      const res = await updateOrderStatus(order.orderId);
      if (res.success) {
        toast.success("Hoàn thành đơn hàng!");
        await fetchProductQuantity();
        onCancel();
        clearCart();
        clearCustomerState();
      }
     
    } catch (err: any) {
      console.error(err);
      toast.error("Lỗi!");
    }
  };

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
            <div>{customer?.name}</div>
            <div>{customer?.phone}</div>
            {customer?.email && <div>{customer?.email}</div>}
            {customer?.address && <div>{customer?.address}</div>}
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
        {order?.items.map((item) => (
          <Row
            key={item.productId}
            align="middle"
            style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
            gutter={16}
          >
            <Col flex="60px">
              <Image
                alt={item.productName}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 4 }}
                preview={false}
              />
            </Col>
            <Col flex="auto">
              <Row justify="space-between" align="middle">
                <Col>
                  <Text>{item.productName}</Text>
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
        <Text>{totalAmount?.toLocaleString()} ₫</Text>
      </Row>
      <Divider style={{ margin: "8px 0" }} />
      <Row justify="space-between">
        <Text strong>Tổng thanh toán:</Text>
        <Text strong style={{ color: "#1677ff" }}>
          {order?.totalAmount.toLocaleString()} ₫
        </Text>
      </Row>

      <Divider />

      {/* Nút hành động */}
      <Row justify="end">
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" onClick={handleUpdateOrderStatus}>
            Xác nhận thanh toán
          </Button>
        </Space>
      </Row>
    </Modal>
  );
};

export default ModelConfirmPay;
