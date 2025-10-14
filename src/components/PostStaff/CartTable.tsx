import { Table, InputNumber, Input, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface CartItem {
  key: string;
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

const CartTable = () => {
  const data: CartItem[] = [
    {
      key: "1",
      barcode: "8931234567890",
      name: "Bánh Chocopie",
      price: 30000,
      quantity: 1,
      discount: 0,
      total: 30000,
    },
    {
      key: "2",
      barcode: "8939876543210",
      name: "Rượu Vodka",
      price: 65000,
      quantity: 1,
      discount: 0,
      total: 65000,
    },
    {
      key: "3",
      barcode: "8934567890123",
      name: "Bia Sài Gòn",
      price: 15000,
      quantity: 1,
      discount: 0,
      total: 15000,
    },
  ];

  const columns: ColumnsType<CartItem> = [
    { title: "Mã vạch", dataIndex: "barcode" },
    { title: "Tên hàng", dataIndex: "name" },
    { title: "Đơn giá", dataIndex: "price", render: (v) => v.toLocaleString() },
    {
      title: "SL",
      dataIndex: "quantity",
      render: (value) => (
        <InputNumber min={1} defaultValue={value} style={{ width: 60 }} />
      ),
    },
    {
      title: "CK",
      dataIndex: "discount",
      render: (value) => (
        <InputNumber
          min={0}
          max={100}
          defaultValue={value}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      render: (v) => v.toLocaleString(),
    },
    {
      title: "",
      render: () => <Button danger type="text" icon={<DeleteOutlined />} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
      scroll={{ y: 300 }}
    />
  );
};

export default CartTable;
