import { useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  QrcodeOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import Payment from "./Payment";
import ModelConfirmPay from "./ModelComfirmPay";

const CustomerSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form] = Form.useForm();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState(250000);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  // 🧍 Fake dữ liệu khách hàng
  const fakeCustomer = {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@gmail.com",
    address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
  };
  const fakeProduct = {
    name: "Tour Đà Lạt 3N2Đ",
    quantity: 2,
    price: 1750000,
    total: 3500000,
    startDate: "12/11/2025",
  };
  const fakeCreatedBy = "Admin Nguyễn";
  const fakeCreatedAt = "11/10/2025 14:35";
  const fakeProducts = [
    {
      key: "1",
      name: "Tour Đà Lạt 3N2Đ",
      image: "https://picsum.photos/80?1",
      quantity: 2,
      price: 1500000,
    },
    {
      key: "2",
      name: "Tour Phú Quốc 4N3Đ",
      image: "https://picsum.photos/80?2",
      quantity: 1,
      price: 2500000,
    },
    {
      key: "3",
      name: "Tour Nha Trang 2N1Đ",
      image: "https://picsum.photos/80?3",
      quantity: 3,
      price: 900000,
    },
  ];
  const customers = [
    {
      id: "KH001",
      name: "Nguyễn Văn A",
      phone: "0909123456",
      email: "vana@example.com",
      address: "Hà Nội",
    },
    {
      id: "KH002",
      name: "Trần Thị B",
      phone: "0988765432",
      email: "thib@example.com",
      address: "TP.HCM",
    },
    {
      id: "KH003",
      name: "Lê Văn C",
      phone: "0911222333",
      email: "vanc@example.com",
      address: "Đà Nẵng",
    },
  ];

  // 🔹 Lọc khách hàng theo từ khóa
  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.id.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map((c) => ({
      value: c.name,
      label: `${c.id} - ${c.name}`,
      customer: c,
    }));

  // 🔹 Dữ liệu QR
  const paymentInfo = {
    amount: amount - discount,
    accountName: "TenDev Web Design",
    bank: "MB Bank",
    accountNumber: "0123456789",
    qrValue: "https://img.vietqr.io/image/970422-0123456789-compact.png",
  };

  // ✅ Áp dụng khuyến mãi
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SALE50") {
      const discountValue = amount * 0.5;
      setDiscount(discountValue);
      message.success(
        `🎉 Áp dụng mã SALE50 - Giảm ${discountValue.toLocaleString()} VNĐ`
      );
    } else if (promoCode.trim().toUpperCase() === "SALE10") {
      const discountValue = amount * 0.1;
      setDiscount(discountValue);
      message.success(
        `🎉 Áp dụng mã SALE10 - Giảm ${discountValue.toLocaleString()} VNĐ`
      );
    } else {
      setDiscount(0);
      message.error("❌ Mã khuyến mãi không hợp lệ");
    }
  };

  // ✅ Lưu thông tin khách hàng
  const handleOk = () => {
    form.validateFields().then((values) => {
      const customerData = {
        name: values.name,
        phone: values.phone || null,
        email: values.email || null,
        address: values.address || null,
        payment_method: paymentMethod,
        promo_code: promoCode || null,
        total_price: amount - discount,
      };
      console.log("✅ Dữ liệu khách hàng mới:", customerData);
      setIsModalOpen(false);
      form.resetFields();
      setPromoCode("");
      setDiscount(0);
    });
  };

  const handlePaymentConfirm = () => {
    message.success("✅ Thanh toán ví điện tử đã xác nhận!");
    setIsQRModalOpen(false);
  };

  const handleSelectCustomer = (value: string, option: any) => {
    setSelectedCustomer(option.customer);
    message.success(`✅ Đã chọn khách hàng: ${option.customer.name}`);
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

        {/* 🔸 Hiển thị khách hàng đã chọn */}
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

        {/* 🔸 Ô nhập mã khuyến mãi */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Nhập mã khuyến mãi"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            prefix={<GiftOutlined />}
          />
          <Button type="default" onClick={handleApplyPromo}>
            Áp dụng
          </Button>
        </div>

        {/* 🔸 Hiển thị tổng tiền sau khuyến mãi */}
        <div className="text-right mb-3 font-semibold">
          <div>Giá gốc: {amount.toLocaleString()} VNĐ</div>
          {discount > 0 && (
            <div className="text-green-600">
              - Giảm: {discount.toLocaleString()} VNĐ
            </div>
          )}
          <div className="text-blue-600 text-lg">
            Tổng cộng: {(amount - discount).toLocaleString()} VNĐ
          </div>
        </div>

        {/* 🔸 Phương thức thanh toán */}
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          className="mb-2 flex justify-between w-full "
        >
          <Radio value="cash">💵 Tiền mặt</Radio>
          <Radio value="e-wallet">📱 Ví điện tử</Radio>
        </Radio.Group>

        {paymentMethod === "e-wallet" && (
          <Button
            icon={<QrcodeOutlined />}
            type="primary"
            block
            style={{ marginTop: 12 }}
            onClick={() => setIsQRModalOpen(true)}
          >
            Thanh toán qua ví
          </Button>
        )}

        {paymentMethod === "cash" && (
          <Button
            type="primary"
            block
            style={{ marginTop: 12 }}
            onClick={() => setOpen(true)}
          >
            Hoàn thành thanh toán
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
        onConfirm={handlePaymentConfirm}
        paymentInfo={paymentInfo}
        customer={fakeCustomer}
        createdBy={fakeCreatedBy}
        createdAt={fakeCreatedAt}
        product={fakeProduct}
      />

      <ModelConfirmPay
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => alert("Thanh toán thành công!")}
        products={fakeProducts}
        customer={fakeCustomer}
        createdBy={fakeCreatedBy}
        createdAt={fakeCreatedAt}
      />
    </>
  );
};

export default CustomerSection;
