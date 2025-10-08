import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BugOutlined,
  UserOutlined,
  ShoppingOutlined,
  StockOutlined,
  TagsOutlined,
  FileOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar, Button } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Content, Sider } = Layout;

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("/admin");
  const location = useLocation();

  useEffect(() => {
    setActiveMenu(location.pathname || "/admin");
  }, [location.pathname]);

  const menuItems = [
    {
      label: <Link to="/admin/managerUser">Quản lí người dùng</Link>,
      key: "/managerUser",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/admin/managerCustomer">Quản lí khách hàng</Link>,
      key: "/managerCustomer",
      icon: <UsergroupAddOutlined />,
    },
    {
      label: <Link to="/admin/managerProduct">Quản lí sản phẩm</Link>,
      key: "/managerProduct",
      icon: <ShoppingOutlined />,
    },
    {
      label: <Link to="/admin/managerInventory">Quản lí tồn kho</Link>,
      key: "/managerInventory",
      icon: <StockOutlined />,
    },
    {
      label: <Link to="/admin/managerPromotion">Quản lí khuyến mãi</Link>,
      key: "/managerPromotion",
      icon: <TagsOutlined />,
    },
    {
      label: <Link to="/admin/managerReport">Quản lí báo cáo và thống kê</Link>,
      key: "/managerReport",
      icon: <FileOutlined />,
    },
    {
      label: <Link to="/admin/managerSupplier">Quản lí nhà cung cấp</Link>,
      key: "/managerSupplier",
      icon: <ShopOutlined />,
    },
    {
      label: <Link to="/admin/managerRole">Quản lí quyền</Link>,
      key: "/managerRole",
      icon: <ShopOutlined />,
    },
  ];

  const itemsDropdown = [
    {
      label: <Link to="/">Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Đăng xuất
        </span>
      ),
      key: "logout",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        width={250} // 👉 tăng chiều rộng menu
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 50,
            margin: 16,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <BugOutlined />
          ADMIN
        </div>

        <Menu
          selectedKeys={[activeMenu]}
          mode="inline"
          items={menuItems.map((item) => ({
            ...item,
            style: {
              paddingTop: 15, // 👉 cách trên
              paddingBottom: 15,
              textAlign: "left", // 👉 cách dưới
            },
          }))}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginRight: 20,
            padding: "0 1rem",
            alignItems: "center",
            height: 64,
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
            <Space style={{ cursor: "pointer" }}>
              Welcome Admin
              <Avatar>A</Avatar>
            </Space>
          </Dropdown>
        </div>

        {/* Content */}
        <Content
          style={{
            padding: "1rem",
            overflow: "hidden",
            height: "calc(100vh - 64px)",
          }}
        >
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              paddingRight: 8,
            }}
          >
            {location.pathname === "/" ? (
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1890ff",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    animation: "marquee 12s linear infinite",
                  }}
                >
                  🚀 Chào mừng bạn đến với trang quản trị – Quản lý dữ liệu dễ
                  dàng 🚀
                </div>
                <style>
                  {`
                    @keyframes marquee {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                    }
                  `}
                </style>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminSidebar;
