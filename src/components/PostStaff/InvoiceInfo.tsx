import { Card } from "antd";
import type { CartItem } from "../../type/OrderType";
import { useMemo } from "react";
import type { Promotion } from "../../type/Promotion";

interface InvoiceInfoProps {
  cart: CartItem[];
  selectedPromo?: Promotion | null;
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({ cart, selectedPromo }) => {
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);
  const discount = selectedPromo
  ? selectedPromo.discountType === "percent"
    ? (total * selectedPromo.discountValue) / 100
    : selectedPromo.discountValue
  : 0;

const totalAfterDiscount = total - discount;

  return (
    <Card title="THÔNG TIN HÓA ĐƠN" size="small">
      <div className="flex justify-between">
        <span>Tổng số lượng:</span>
        <span>{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
      </div>
      <div className="flex justify-between mb-1 text-gray-700">
        <span>Tổng tiền hàng:</span>
        <span>{total.toLocaleString()}₫</span>
      </div>

      {selectedPromo && (
        <div className="flex justify-between mb-1 text-green-600">
          <span>
            Giảm giá{" "}
            <span className="text-gray-500">
              ({selectedPromo.promoCode})
            </span>
            :
          </span>
          <span>-{discount.toLocaleString()}₫</span>
        </div>
      )}

      <div className="border-t border-gray-200 my-2"></div>

      <div className="flex justify-between text-lg font-semibold text-blue-600">
        <span>Thành tiền:</span>
        <span>{totalAfterDiscount.toLocaleString()}₫</span>
      </div>
    </Card>
  );
};

export default InvoiceInfo;
