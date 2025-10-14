import { Layout, Button, Input } from "antd";
import CartTable from "../components/PostStaff/CartTable";
import ProductList from "../components/PostStaff/ProductList";
import InvoiceInfo from "../components/PostStaff/InvoiceInfo";
import CustomerSection from "../components/PostStaff/CustomerSection";
import { useState } from "react";

const { Content, Sider } = Layout;

const PosLayout = () => {
  const [barcode, setBarcode] = useState("");
  const handleEnter = () => {
    if (!barcode.trim()) return;

    setBarcode(""); // clear sau khi quét
  };
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Bên trái */}
      <Content
        style={{
          padding: "10px",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden", // chặn tràn
        }}
      >
        <div className="flex justify-between mb-2 flex-shrink-0 gap-2">
          <div className="flex gap-2">
            <Button type="primary">Hóa đơn 1</Button>
            <Button>+ Thêm hóa đơn</Button>
          </div>
          <Input
            placeholder="Quét mã vạch..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onPressEnter={handleEnter}
            style={{ width: 250 }}
          />
        </div>

        <div className="flex-shrink-0">
          <CartTable />
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          <ProductList />
        </div>
      </Content>

      {/* Bên phải */}
      <Sider
        width={300}
        style={{
          background: "#f5f5f5",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          overflow: "hidden", // ⚡ ngắt scroll bên phải
        }}
      >
        <div>
          <InvoiceInfo />
          <div className="mt-3">
            <CustomerSection />
          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default PosLayout;
