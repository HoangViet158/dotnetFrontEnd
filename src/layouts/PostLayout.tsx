import { Layout, Input } from "antd";
import CartTable from "../components/PostStaff/CartTable";
import ProductList from "../components/PostStaff/ProductList";
import InvoiceInfo from "../components/PostStaff/InvoiceInfo";
import CustomerSection from "../components/PostStaff/CustomerSection";
import { useEffect, useState } from "react";
import type { CartItem } from "../type/OrderType";
import type { InventoryType } from "../type/InventoryType";
import { getProductQuantityInInventory } from "../services/Inventory";
import type { Promotion } from "../type/Promotion";

const { Content, Sider } = Layout;

const PosLayout = () => {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const clearCart = () => setCart([]);
  const [productQuantity, setProductQuantity] = useState<InventoryType[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);


  const fetchProductQuantity = async () => {
    const res = await getProductQuantityInInventory();
    if (res.success && res.data) {
      setProductQuantity(res.data);
    } else {
      console.error("Lỗi khi fetch product quantity:", res.message, res.errors);
    }
  
  };

  const handleEnter = () => {
    if (!barcode.trim()) return;
    setBarcode(""); // clear sau khi quét
  };

  const handleAddToCart = (product: { productId: number; productName: string; price: number }) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.productId === product.productId);
      if (exist) {
        return prev.map((p) =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  useEffect(() => {
    fetchProductQuantity();
  }, []);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Content
        style={{
          padding: "10px",
          background: "#fff",
          display: "flex",
          flexDirection: "row",
          height: "100%",
          overflow: "hidden",
          gap: "10px",
        }}
      >
        {/* Bên trái - danh sách sản phẩm */}
        <div
          style={{
            flex: 2,
            overflowY: "auto",
            paddingRight: 4,
            borderRight: "1px solid #eee",
          }}
        >
          <div className="flex justify-between mb-2 flex-shrink-0 gap-2">
            <Input
              placeholder="Quét mã vạch..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onPressEnter={handleEnter}
              style={{ width: 250 }}
            />
          </div>

          <ProductList productQuantity={productQuantity} onAddToCart={handleAddToCart} />
        </div>

        {/* Giữa - giỏ hàng */}
        <div
          style={{
            flex: 1.2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CartTable cart={cart} setCart={setCart} />
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
          overflow: "hidden",
        }}
      >
        <div>
          <InvoiceInfo cart={cart} selectedPromo={selectedPromo} />
          <div className="mt-3">
            <CustomerSection
              cart={cart}
              clearCart={clearCart}
              fetchProductQuantity={fetchProductQuantity}
              selectedPromo={selectedPromo}
              setSelectedPromo={setSelectedPromo}
            />

          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default PosLayout;
