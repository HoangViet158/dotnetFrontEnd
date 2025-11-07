import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Modal,
  Form,
  Radio,
  Tooltip,
  QRCode,
  message,
  AutoComplete,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  QrcodeOutlined,
  GiftOutlined,
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

import Payment from "./Payment";
import type { Customer } from "../../type/Customer";
import type { Promotion } from "../../type/Promotion";
import type { CartItem, OrderResponse } from "../../type/OrderType";

import ModelConfirmPay from "./ModelComfirmPay";
import { createNewCustomer, getAllCustomers } from "../../services/Customer";
import { getAllPromotions } from "../../services/Promotion";
import { createOrder } from "../../services/Order";
import type { ResponseApi } from "../../type/axios";



interface CustomerSectionProps {
  cart: CartItem[];
  clearCart: () => void;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({ cart, clearCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form] = Form.useForm();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const clearCustomerState = () => {
    setSelectedCustomer(null);
    setSelectedPromo(null);
    setSearchValue("");
    setSearchPromo("");
  };
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [searchValue, setSearchValue] = useState<string | number>("");
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [promotion, setPromotion] = useState<Promotion[]>([]);
  const [searchPromo, setSearchPromo] = useState<string | "">("");
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);

  // 🧍 Fake dữ liệu khách hàng
  // const selectedCustomer = {
  //   name: "Nguyễn Văn A",
  //   phone: "0901234567",
  //   email: "nguyenvana@gmail.com",
  //   address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
  // };
  const fakeCreatedBy = "Admin Nguyễn";
  const fakeCreatedAt = "11/10/2025 14:35";

  const fetchCustomer = async () => {
    const res = await getAllCustomers();
    setCustomers(res.data);
    console.log(res.data)
  };

  const fetchPromotion = async () => {
    const res = await getAllPromotions();
    setPromotion(res.data);
  };

  //
  useEffect(() => {
    fetchCustomer();
    fetchPromotion();
  }, []);

  // 🔹 Lọc khách hàng theo từ khóa
  const searchStr = String(searchValue || "").toLowerCase();
  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchStr) ||
        c.customerId?.toString().toLowerCase().includes(searchStr)
    )
    .map((c) => ({
      value: c.customerId,
      label: `${c.customerId} - ${c.name}`,
      customer: c,
    }));

  const searchPromoStr = String(searchPromo || "").toLowerCase();
  const filteredPromotion = promotion
    .filter((p) => p.promoCode.toLowerCase().includes(searchPromoStr))
    .map((promo) => ({
      value: promo.promoId,
      label: `${promo.promoCode} - ${promo.description}`,
      promotion: promo,
    }));

  // ✅ Lưu thông tin khách hàng
  const handleOk = async () => {
    try {
      // // Validate form
      // const values = await form.validateFields();

      // // Gọi API tạo khách mới
      // const newCustomer = await createNewCustomer({
      //   name: values.name,
      //   phone: values.phone || null,
      //   email: values.email || null,
      //   address: values.address || null,
      // } as Customers);

      // // Thêm khách mới vào state
      // setCustomers((prev) => [...prev, newCustomer]);

      // // Chọn khách mới luôn
      // setSelectedCustomer(newCustomer);
      // setSearchValue(`${newCustomer.customerId} - ${newCustomer.name}`);

      // Reset form và đóng modal
      setIsModalOpen(false);
      form.resetFields();
      setPromoCode("");
      setDiscount(0);

      // message.success(`✅ Thêm khách hàng ${newCustomer.data} thành công!`);
      // console.log("Khách hàng mới:", newCustomer);
    } catch (error: any) {
      message.error(`❌ Thêm khách hàng thất bại: ${error.message || error}`);
      console.error(error);
    }
  };

  // const handlePaymentConfirm = () => {
  //   message.success("Thanh toán ví điện tử đã xác nhận!");
  //   setIsQRModalOpen(false);
  // };

  const handleSelectCustomer = (value: string | number, option: any) => {
    setSelectedCustomer(option.customer);
    message.success(`Đã chọn khách hàng: ${option.customer.name}`);
    setSearchValue(`${option.customer.customerId} - ${option.customer.name}`);
  };
  const handleSelectPromotion = (value: string | number, option: any) => {
    setSelectedPromo(option.promotion);
    setSearchPromo(
      `${option.promotion.promoCode} - ${option.promotion.description}`
    );
  };

  const fakeUserId = 5; //tạm thời hardcode, sau có thể lấy từ context hoặc session

  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      toast.error("Vui lòng chọn khách hàng trước khi thanh toán");
      return false;
    }

    if (cart.length === 0) {
      toast.error("Chưa có sản phẩm nào trong giỏ hàng");
      return false;
    }

    const orderData = {
      customerId: selectedCustomer.customerId,
      userId: fakeUserId,
      promoId: selectedPromo?.promoId,
      items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    };

    try {
      const res = await createOrder(orderData);
      if (paymentMethod == "bank_transfer") {
        setIsQRModalOpen(true);
      } else {
        setOpen(true);
      }

      setCreatedOrder(res.data);
      toast.success("Tạo đơn hàng thành công!");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error("Tạo đơn hàng thất bại!");
      return false;
    }
  };



  return (
    <>
      <Card title="KHÁCH HÀNG" size="small" className="shadow-md">
        <div className="flex gap-2 mb-2">
          <AutoComplete
            style={{ flex: 1 }}
            options={filteredCustomers}
            value={searchValue}
            onChange={setSearchValue}
            onSelect={handleSelectCustomer}
          >
            <Input
              placeholder="Nhập mã hoặc tên khách hàng (F4)"
              prefix={<UserOutlined />}
            />
          </AutoComplete>

          <Tooltip title="Thêm khách hàng mới">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
        </div>

        {/* Hiển thị khách hàng đã chọn */}
        {selectedCustomer && (
          <div className="bg-gray-50 p-2 rounded-md mb-3 text-sm">
            <div>
              <strong>Tên:</strong> {selectedCustomer.name}
            </div>
            <div>
              <strong>SDT:</strong> {selectedCustomer.phone}
            </div>
            <div>
              <strong>Email:</strong> {selectedCustomer.email}
            </div>
            <div>
              <strong>Địa chỉ:</strong> {selectedCustomer.address}
            </div>
          </div>
        )}

        {/* Ô nhập mã khuyến mãi */}
        <div className="flex gap-2 mb-3">
          <AutoComplete
            style={{ flex: 1 }}
            options={filteredPromotion}
            value={searchPromo}
            onChange={setSearchPromo}
            onSelect={handleSelectPromotion}
          >
            <Input
              placeholder="Nhập mã khuyến mãi"
              prefix={<GiftOutlined />}
            />
          </AutoComplete>

          <Button type="default">
            {/* <Button type="default" onClick={handleApplyPromo}> */}
            Áp dụng
          </Button>
        </div>
        {/* Hiển thị khuyến mãi đã chọn với nút X */}
        {selectedPromo && (
          <div
            className="mt-2 p-2 bg-gray-100 rounded flex items-center justify-between"
            style={{ maxWidth: 300 }}
          >
            <span>
              {selectedPromo.promoCode} - {selectedPromo.description}
            </span>
            <Button
              type="text"
              size="small"
              onClick={() => {
                setSelectedPromo(null);
                setSearchPromo("");
                setDiscount(0);
              }}
            >
              ×
            </Button>
          </div>
        )}

        {/* Phương thức thanh toán */}
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          className="mb-2 flex justify-between w-full "
        >
          <Radio value="cash"><DollarOutlined /> Tiền mặt</Radio>
          <Radio value="bank_transfer"><CreditCardOutlined /> Chuyển khoản</Radio>
        </Radio.Group>

        {paymentMethod === "bank_transfer" && (
          <Button
            // icon={<QrcodeOutlined />}
            type="primary"
            block
            style={{ marginTop: 12 }}
            // onClick={() => setIsQRModalOpen(true)}
            onClick={async () => {
              await handleCreateOrder()
            }}
          >
            Tạo hóa đơn
          </Button>
        )}

        {paymentMethod === "cash" && (
          <Button
            type="primary"
            block
            style={{ marginTop: 12 }}
            onClick={async () => {
              await handleCreateOrder()
            }}
          >
            Tạo hóa đơn
          </Button>
        )}
      </Card>

      {/* Modal Thêm khách hàng */}
      <Modal
        title="Thêm khách hàng mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên khách hàng"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng" },
            ]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Nhập email (nếu có)" />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input.TextArea placeholder="Nhập địa chỉ (nếu có)" rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thanh toán QR */}
      <Payment
        open={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        order={createdOrder}
        customer={selectedCustomer}
        createdBy={fakeCreatedBy}
        createdAt={fakeCreatedAt}
        clearCart={clearCart}
        clearCustomerState={clearCustomerState}
      />


      <ModelConfirmPay
        open={open}
        onCancel={() => setOpen(false)}
        order={createdOrder}
        customer={selectedCustomer}
        createdBy={fakeCreatedBy}
        createdAt={fakeCreatedAt}
        clearCart={clearCart}
        clearCustomerState={clearCustomerState}
      />
    </>
  );
};

export default CustomerSection;
