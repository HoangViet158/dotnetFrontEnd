import React, { useEffect, useState } from "react";
import { Button, Input, Space, Tag, message, Select } from "antd";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import {
  EditOutlined,
  HistoryOutlined,
  PlusOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ModalUpdateQuantity from "./ModalUpdateQuantity";
import ModalInventoryLog from "./ModalInventoryLog";

interface Product {
  inventory_id: number;
  product_id: number;
  product_name: string;
  category: string;
  supplier: string;
  quantity: number;
  minimum_quantity: number;
  updated_at: string;
}

const ManagerInventory: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalLog, setOpenModalLog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");

  useEffect(() => {
    // Giả lập dữ liệu tồn kho
    const mock: Product[] = [
      {
        inventory_id: 1,
        product_id: 101,
        product_name: "Áo Thun Nam Basic",
        category: "Áo thun",
        supplier: "Nhà cung cấp A",
        quantity: 8,
        minimum_quantity: 10,
        updated_at: "2025-10-08",
      },
      {
        inventory_id: 2,
        product_id: 102,
        product_name: "Quần Jean Nữ",
        category: "Quần jean",
        supplier: "Nhà cung cấp B",
        quantity: 20,
        minimum_quantity: 5,
        updated_at: "2025-10-07",
      },
    ];
    setData(mock);
    setFilteredData(mock);
  }, []);

  // ==============================
  // SEARCH
  // ==============================
  const handleSearch = () => {
    const filtered = data.filter((p) => {
      const matchName = searchName
        ? p.product_name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchCategory = searchCategory
        ? p.category.toLowerCase().includes(searchCategory.toLowerCase())
        : true;
      const matchSupplier = searchSupplier
        ? p.supplier.toLowerCase().includes(searchSupplier.toLowerCase())
        : true;
      return matchName && matchCategory && matchSupplier;
    });
    setFilteredData(filtered);
  };

  // ==============================
  // COLUMNS
  // ==============================
  const columns: ProColumns<Product>[] = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Số lượng tồn",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => {
        const isLow = record.quantity <= record.minimum_quantity;
        return (
          <span style={{ color: isLow ? "#ff4d4f" : "inherit" }}>
            {record.quantity}{" "}
            {isLow && (
              <Tag color="red" icon={<WarningOutlined />}>
                Tồn thấp
              </Tag>
            )}
          </span>
        );
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedItem(record);
              setOpenModalUpdate(true);
            }}
          >
            Nhập hàng
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => {
              setSelectedItem(record);
              setOpenModalLog(true);
            }}
          >
            Lịch sử
          </Button>
        </Space>
      ),
    },
  ];

  // ==============================
  // RENDER
  // ==============================
  return (
    <div>
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="Tìm theo tên sản phẩm"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Input
          placeholder="Tìm theo loại sản phẩm"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Input
          placeholder="Tìm theo nhà cung cấp"
          value={searchSupplier}
          onChange={(e) => setSearchSupplier(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      <ProTable<Product>
        columns={columns}
        dataSource={filteredData}
        rowKey="inventory_id"
        search={false}
        pagination={{ pageSize: 5 }}
        headerTitle="Quản lý tồn kho"
        // toolBarRender={() => [
        //   <Button key="create" type="primary" icon={<PlusOutlined />}>
        //     Thêm sản phẩm
        //   </Button>,
        // ]}
      />

      {/* Modal cập nhật nhập / bán hàng */}
      <ModalUpdateQuantity
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        product={selectedItem}
      />

      {/* Modal xem lịch sử */}
      <ModalInventoryLog
        open={openModalLog}
        setOpen={setOpenModalLog}
        product={selectedItem}
      />
    </div>
  );
};

export default ManagerInventory;
