import { Table, InputNumber, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { CartItem } from "../../type/OrderType";
import { calc } from "antd/es/theme/internal";


interface CartTableProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartTable: React.FC<CartTableProps> = ({ cart, setCart }) => {
  const columns: ColumnsType<CartItem> = [
    { title: "Tên hàng", dataIndex: "productName" },
    { title: "Đơn giá", dataIndex: "price", render: (v) => v.toLocaleString() },
    {
      title: "SL",
      dataIndex: "quantity",
      render: (value, record) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(v) =>
            setCart((prev) =>
              prev.map((p) =>
                p.productId === record.productId ? { ...p, quantity: v! } : p
              )
            )
          }
          style={{ width: 60 }}
        />
      ),
    },

    {
      title: "",
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() =>
            setCart((prev) =>
              prev.filter((p) => p.productId !== record.productId)
            )
          }
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cart}
      rowKey="productId"
      pagination={false}
      size="small"
      scroll={{ y: 'calc(100vh - 150px)' }}
    />
  );
};

export default CartTable;
