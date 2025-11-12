import React, { useEffect } from "react";
import {
  Modal,
  Divider,
  Typography,
  Row,
  Col,
  Button,
  Image,
} from "antd";
import type { OrderResponse } from "../../type/OrderType";
import { toast } from "react-toastify";
import { createPaymentUrlVnpay } from "../../services/Payment";
import { getOrderById } from "../../services/Order";

const { Title, Text } = Typography;

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface PaymentProps {
  open: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  customer: CustomerInfo | null;
  createdBy: string;
  createdAt: string;
  clearCart: () => void;
  clearCustomerState: () => void;
  fetchProductQuantity: () => Promise<void>;
}

const Payment: React.FC<PaymentProps> = ({
  open,
  onClose,
  order,
  customer,
  createdBy,
  createdAt,
  clearCart,
  clearCustomerState,
  fetchProductQuantity,
}) => {
  const handleCreatePaymentUrlVnpay = async () => {
    if (!order?.orderId) {
      toast.error("Không tìm thấy ID đơn hàng!");
      return;
    }
    const paymentInformation = {
      orderId: order.orderId,
      orderType: "topup",
      amount: order.totalAmount,
      orderDescription: "Thanh toán đơn hàng" + order.orderId,
      name: customer?.name
    };


    try {
      const res = await createPaymentUrlVnpay(paymentInformation);
      const paymentUrl = res.data?.paymentUrl;

      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
        toast.info("Vui lòng hoàn tất thanh toán trong cửa sổ VNPay.");

        // Bắt đầu polling trạng thái đơn hàng
        const interval = setInterval(async () => {
          try {
            const orderRes = await getOrderById(order.orderId);
            if (orderRes.data?.status === "paid") {
              await fetchProductQuantity();
              toast.success("Thanh toán thành công!");
              clearInterval(interval);
              onClose();
              clearCart();
              clearCustomerState();
            }
          } catch (err) {
            console.error("Lỗi khi kiểm tra trạng thái đơn hàng:", err);
          }
        }, 3000);
      } else {
        toast.error("Không nhận được liên kết thanh toán từ server!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Lỗi!");
    }
  };

  useEffect(() => {
    if (open) {
      handleCreatePaymentUrlVnpay();
    }
  }, [open]);

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
      {/* Thông tin sản phẩm */}
      <div>
        <Divider style={{ margin: "8px 0" }} />
        <Text strong>📦 Thông tin đơn hàng</Text>
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

      {/* Thông tin khách hàng */}
      <div style={{ marginBottom: 16 }}>

        <Text strong>👤 Thông tin khách hàng</Text>
        <p>
          <Text strong>Họ tên:</Text> {customer?.name}
        </p>
        <p>
          <Text strong>Điện thoại:</Text> {customer?.phone}
        </p>
        {customer?.email && (
          <p>
            <Text strong>Email:</Text> {customer?.email}
          </p>
        )}
        {customer?.address && (
          <p>
            <Text strong>Địa chỉ:</Text> {customer?.address}
          </p>
        )}
      </div>

      {/* Thông tin người tạo đơn */}
      <div>
        <Divider style={{ margin: "8px 0" }} />

        <Text strong>📦 Thông tin người tạo đơn</Text>
        <p>
          <Text strong>Người tạo:</Text> {createdBy}
        </p>
        <p>
          <Text strong>Ngày tạo:</Text> {createdAt}
        </p>
      </div>

      {/* Nút hành động */}
      <div style={{ marginTop: 20, textAlign: "right" }}>
          <Button onClick={onClose}>Hủy</Button>
      </div>
    </Modal>
  );
};

export default Payment;
