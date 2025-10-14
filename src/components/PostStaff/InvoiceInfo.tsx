import { Card, Typography } from "antd";

const { Text } = Typography;

const InvoiceInfo = () => {
  const total = 180000;

  return (
    <Card title="THÔNG TIN HÓA ĐƠN" size="small">
      <div className="flex justify-between mb-1">
        <Text>Tổng tiền hàng</Text>
        <Text>{total.toLocaleString()} đ</Text>
      </div>
      <div className="flex justify-between mb-1">
        <Text>Chiết khấu</Text>
        <Text>0 đ</Text>
      </div>
      <div className="flex justify-between font-semibold text-lg text-red-500">
        <Text>Tổng tiền hóa đơn</Text>
        <Text>{total.toLocaleString()} đ</Text>
      </div>
      <div className="flex justify-between mt-1">
        <Text>Tiền khách trả</Text>
        <Text>0 đ</Text>
      </div>
    </Card>
  );
};

export default InvoiceInfo;
