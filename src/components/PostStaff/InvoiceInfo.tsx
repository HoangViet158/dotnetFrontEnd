import { Card } from "antd";
import type { CartItem } from "../../type/OrderType";
import { useMemo } from "react";

interface InvoiceInfoProps {
  cart: CartItem[];
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({ cart }) => {
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);
  return (
    <Card title="THÔNG TIN HÓA ĐƠN" size="small">
      <div className="flex justify-between">
        <span>Tổng số lượng:</span>
        <span>{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
      </div>
      <div className="flex justify-between mt-1 font-semibold text-blue-600">
        <span>Tổng tiền:</span>
        <span>{total.toLocaleString()} đ</span>
      </div>
      {/* <div className="flex justify-between mb-1">
        <Text>Chiết khấu</Text>
        <Text>0 đ</Text>
      </div> */}
      {/* <div className="flex justify-between mt-1">
        <Text>Tiền khách trả</Text>
        <Text>0 đ</Text>
      </div> */}
    </Card>
  );
};

export default InvoiceInfo;
