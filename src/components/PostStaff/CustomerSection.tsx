import { use, useEffect, useState } from "react";
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
} from "@ant-design/icons";
import Payment from "./Payment";
import ModelConfirmPay from "./ModelComfirmPay";
import { createNewCustomer, getAllCustomers } from "../../services/Customer";
import { Customers } from "../../type/Customer";
import { Promotion } from "../../type/Promotion";
import { getAllProducts } from "../../services/Products";
import { getAllPromotions } from "../../services/Promotion";
import { describe } from "node:test";
import { toast } from "react-toastify";
const CustomerSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form] = Form.useForm();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState(250000);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [searchValue, setSearchValue] = useState<string | number>("");
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [promotion, setPromotion] = useState<Promotion[]>([]);
  const [searchPromo, setSearchPromo] = useState<string | "">("");

  // 🧍 Fake dữ liệu khách hàng
  // const selectedCustomer = {
  //   name: "Nguyễn Văn A",
  //   phone: "0901234567",
  //   email: "nguyenvana@gmail.com",
  //   address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
  // };
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
  const fetchCustomer = async () => {
    const res = await getAllCustomers();
    setCustomers(res);
    console.log(res);
  };
  const fetchPromotion = async () => {
    const res = await getAllPromotions();

    const now = Date.now();

    const promotionData = res.filter((promo) => {
      const start = new Date(promo.startDate).getTime();
      const end = new Date(promo.endDate).getTime();

      return start <= now && end >= now && promo.status === "active";
    });

    setPromotion(promotionData);
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
        c.customerId.toString().toLowerCase().includes(searchStr)
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
    if (!selectedPromo) {
      setDiscount(0);
      message.error("❌ Vui lòng chọn mã khuyến mãi hợp lệ");
      return;
    }

    const now = Date.now();
    const start = new Date(selectedPromo.startDate).getTime();
    const end = new Date(selectedPromo.endDate).getTime();

    if (start <= now && now <= end && selectedPromo.status === "active") {
      if (selectedPromo.minOrderAmount > amount) {
        toast.warning("Đơn hàng chưa đủ giá trị để áp dụng");
        return;
      }
      if (
        selectedPromo.usageLimit <= selectedPromo.usedCount &&
        selectedPromo.usageLimit != 0
      ) {
        toast.warning("Khuyến mãi đã đạt số lần sử dụng tối đa");
        return;
      }
      let discountValue = 0;

      if (selectedPromo.discountType === "percent") {
        // Giảm theo phần trăm
        discountValue = amount * (selectedPromo.discountValue / 100);
      } else if (selectedPromo.discountType === "fixed") {
        // Giảm theo số tiền cố định
        discountValue = selectedPromo.discountValue;
      }

      setDiscount(discountValue);
      message.success(
        `🎉 Áp dụng mã ${
          selectedPromo.promoCode
        } - Giảm ${discountValue.toLocaleString()} VNĐ`
      );
    } else {
      setDiscount(0);
      message.error("❌ Mã khuyến mãi đã hết hạn hoặc không còn hiệu lực");
    }
  };

  // ✅ Lưu thông tin khách hàng
  const handleOk = async () => {
    try {
      // Validate form
      const values = await form.validateFields();

      // Gọi API tạo khách mới
      const newCustomer = await createNewCustomer({
        name: values.name,
        phone: values.phone || null,
        email: values.email || null,
        address: values.address || null,
      } as Customers);

      // Thêm khách mới vào state
      setCustomers((prev) => [...prev, newCustomer]);

      // Chọn khách mới luôn
      setSelectedCustomer(newCustomer);
      setSearchValue(`${newCustomer.customerId} - ${newCustomer.name}`);

      // Reset form và đóng modal
      setIsModalOpen(false);
      form.resetFields();
      setPromoCode("");
      setDiscount(0);

      message.success(`✅ Thêm khách hàng ${newCustomer.name} thành công!`);
      console.log("Khách hàng mới:", newCustomer);
    } catch (error: any) {
      message.error(`❌ Thêm khách hàng thất bại: ${error.message || error}`);
      console.error(error);
    }
  };

  const handlePaymentConfirm = () => {
    message.success("✅ Thanh toán ví điện tử đã xác nhận!");
    setIsQRModalOpen(false);
  };

  const handleSelectCustomer = (value: string, option: any) => {
    setSelectedCustomer(option.customer);
    message.success(`✅ Đã chọn khách hàng: ${option.customer.name}`);
    setSearchValue(`${option.customer.customerId} - ${option.customer.name}`);
  };
  const handleSelectPromotion = (value: string, option: any) => {
    setSelectedPromo(option.promotion);
    setSearchPromo(
      `${option.promotion.promoCode} - ${option.promotion.description}`
    );
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
          <AutoComplete
            style={{ flex: 1 }}
            options={filteredPromotion}
            value={searchPromo}
            onChange={setSearchPromo}
            onSelect={handleSelectPromotion}
          >
            {/* <Input
              placeholder="Nhập mã hoặc tên khách hàng (F4)"
              prefix={<UserOutlined />}
            /> */}
            <Input
              placeholder="Nhập mã khuyến mãi"
              // value={promoCode}
              // onChange={(e) => setPromoCode(e.target.value)}
              prefix={<GiftOutlined />}
            />
          </AutoComplete>

          <Button type="default" onClick={handleApplyPromo}>
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
        customer={selectedCustomer}
        createdBy={fakeCreatedBy}
        createdAt={fakeCreatedAt}
        product={fakeProduct}
      />

      <ModelConfirmPay
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => alert("Thanh toán thành công!")}
        products={fakeProducts}
        customer={selectedCustomer}
        createdBy={fakeCreatedBy}
        createdAt={fakeCreatedAt}
      />
    </>
  );
};

export default CustomerSection;
