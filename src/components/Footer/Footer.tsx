import { Layout } from "antd";

const { Footer } = Layout;

const FooterPOS = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        padding: "8px 16px",
        background: "#fff",
        borderTop: "1px solid #eee",
        fontSize: 13,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>© 2025 GoStore — All rights reserved.</span>
      <span>F2: Tìm hàng • F4: Khách hàng • F8: Thanh toán</span>
    </Footer>
  );
};

export default FooterPOS;
