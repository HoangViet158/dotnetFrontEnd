import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Modal,
  Form,
  Radio,
  Tooltip,
  message,
  AutoComplete,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  GiftOutlined,
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import Payment from "./Payment";
import type { CustomerResponse } from "../../type/Customer";
import type { Promotion } from "../../type/Promotion";
import type { CartItem, OrderResponse } from "../../type/OrderType";
import ModelConfirmPay from "./ModelComfirmPay";
import { createNewCustomer, getAllCustomers } from "../../services/Customer";
import { createOrder } from "../../services/Order";
import { getPromotionsWithMinOrderAmountGreaterThanAsync } from "../../services/Promotion";

interface CustomerSectionProps {
  cart: CartItem[];
  clearCart: () => void;
  fetchProductQuantity: () => Promise<void>;
  selectedPromo?: Promotion | null;
  setSelectedPromo: React.Dispatch<React.SetStateAction<Promotion | null>>;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({ 
  cart, 
  clearCart, 
  fetchProductQuantity ,
  selectedPromo,
  setSelectedPromo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form] = Form.useForm();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);
  const clearCustomerState = () => {
    setSelectedCustomer(null);
    setSelectedPromo(null);
    setSearchValue("");
    setSearchPromo("");
  };
  const [searchValue, setSearchValue] = useState<string | number>("");
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [promotion, setPromotion] = useState<Promotion[]>([]);
  const [searchPromo, setSearchPromo] = useState<string | "">("");
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);
  const fakeCreatedBy = "Admin Nguyễn";
  const fakeCreatedAt = "11/10/2025 14:35";

  const fetchCustomer = async () => {
    const res = await getAllCustomers();
    if (res.success && res.data) {
      setCustomers(res.data);
    } else {
      console.error("Lỗi khi fetch customers:", res.message, res.errors);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fetchPromotion = async () => {
    const res = await getPromotionsWithMinOrderAmountGreaterThanAsync(totalPrice);
    if (res.success && res.data){
      setPromotion(res.data);
    } else {
      console.error("Lỗi khi fetch promotions:", res.message, res.errors);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchPromotion();
  }, [cart]);

  // Lọc khách hàng theo từ khóa
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

  // Lưu thông tin khách hàng
  const handleCreateCustomer = async () => {
    try {
      const values = await form.validateFields();

      const customerData = {
        name: values.name,
        phone: values.phone,
        email: values.email || null,
        address: values.address || null,
      };

      const res = await createNewCustomer(customerData);

      setCustomers((prev) => [...prev, res.data]);
      setSelectedCustomer(res.data);
      setSearchValue(`${res.data.customerId} - ${res.data.name} - ${res.data.phone}`);
      setIsModalOpen(false);
      form.resetFields();
      toast.success('Thêm khách hàng  ${res.data.name} thành công!');
    } catch (error: any) {
      message.error(`Thêm khách hàng thất bại: ${error.message || error}`);
      console.error(error);
    }
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
          <div className="bg-gray-50 p-3 rounded-md mb-3 text-sm shadow-sm">
            {[
              { label: "Tên", value: selectedCustomer.name },
              { label: "SDT", value: selectedCustomer.phone },
              { label: "Email", value: selectedCustomer.email },
              { label: "Địa chỉ", value: selectedCustomer.address },
            ].map((item, index) => (
              <div key={index} className="flex justify-between py-1 border-b last:border-none">
                <strong>{item.label}:</strong>
                <span className="text-gray-700">{item.value}</span>
              </div>
            ))}
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
        onOk={handleCreateCustomer}
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
        fetchProductQuantity={fetchProductQuantity}
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
        fetchProductQuantity={fetchProductQuantity}
      />
    </>
  );
};

export default CustomerSection;
