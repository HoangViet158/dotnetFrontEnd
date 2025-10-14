import { Layout, Input, Select, Avatar, Dropdown, Space } from "antd";
import { SearchOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Option } = Select;

const HeaderPOS = () => {
  const menuItems = [
    { key: "1", label: "Tài khoản của tôi" },
    { key: "2", label: "Đăng xuất" },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* Logo */}
      <div className="text-xl font-bold text-blue-600 mr-6">GoStore</div>

      {/* Ô tìm kiếm */}
      <Input
        placeholder="Nhập mã hoặc tên hàng hóa (F2)"
        prefix={<SearchOutlined />}
        style={{ maxWidth: 400 }}
      />
      <div className="ml-2">
        <Select defaultValue="VN" style={{ width: 150 }}>
          <Option value="VN">🇻🇳 Việt Nam</Option>
          <Option value="EN">🇺🇸 English</Option>
        </Select>
      </div>

      {/* Avatar nhân viên */}
      <div className="ml-auto">
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Space className="cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <span>Nhân viên A</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderPOS;
