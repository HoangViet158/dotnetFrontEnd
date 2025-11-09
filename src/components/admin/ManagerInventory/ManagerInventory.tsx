import React, { useEffect, useState } from "react";
import { Button, Input, Space, Tag, message } from "antd";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import {
  EditOutlined,
  HistoryOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ModalUpdateQuantity from "./ModalUpdateQuantity";
import ModalInventoryLog from "./ModalInventoryLog";

import type { InventoryType, InventoryDisplayType } from "../../../type/InventoryType";
import type { ProductType } from "../../../type/ProductsType";
import type { SupplierType } from "../../../type/SuppliersType";
import type { CategoryType } from "../../../type/CategoryType";

import { getAllInventories } from "../../../services/Inventory";
import { getAllProducts } from "../../../services/Products";
import { getAllSuppliers } from "../../../services/Suppliers";
import { getAllCategories } from "../../../services/Category";

const ManagerInventory: React.FC = () => {
  const [data, setData] = useState<InventoryDisplayType[]>([]);
  const [filteredData, setFilteredData] = useState<InventoryDisplayType[]>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalLog, setOpenModalLog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryDisplayType | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchInventories = async () => {
    try {
      const [resInventories, resProducts, resSuppliers, resCategories] = await Promise.all([
        getAllInventories(),
        getAllProducts(),
        getAllSuppliers(),
        getAllCategories(),
      ]);

      const inventories: InventoryType[] = resInventories?.data || [];
      const products: ProductType[] = resProducts?.data || [];
      const suppliers: SupplierType[] = resSuppliers?.data || [];
      const categories: CategoryType[] = resCategories?.data || [];

      // 🔹 Map dữ liệu hiển thị
      const mapped: InventoryDisplayType[] = inventories.map((inv) => {
        const product = products.find((p) => p.productId === inv.productId);
        const category = categories.find((c) => c.category_id === product?.categoryId);
        const supplier = suppliers.find((s) => s.supplier_id === product?.supplierId);

        return {
          inventoryId: inv.inventoryId,
          productId: inv.productId,
          quantity: inv.quantity,
          updatedAt: inv.updatedAt,
          categoryId: product?.categoryId ?? 0,
          supplierId: product?.supplierId ?? 0,
          productName: product?.productName ?? "Không xác định",
          categoryName: category?.category_name ?? "Không xác định",
          supplierName: supplier?.name ?? "Không xác định",
        };
      });

      console.log(mapped)
      setData(mapped);
      setFilteredData(mapped);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      message.error("Không thể lấy danh sách tồn kho");
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  // ==============================
  // SEARCH
  // ==============================
  const handleSearch = () => {
    const filtered = data.filter((item) => {
      const matchName = searchName
        ? item.productName.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchCategory = searchCategory
        ? item.categoryName.toLowerCase().includes(searchCategory.toLowerCase())
        : true;
      const matchSupplier = searchSupplier
        ? item.supplierName.toLowerCase().includes(searchSupplier.toLowerCase())
        : true;

      return matchName && matchCategory && matchSupplier;
    });
    setFilteredData(filtered);
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns: ProColumns<InventoryDisplayType>[] = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "product_name",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryName",
      key: "category_name",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplier_name",
    },
    {
      title: "Số lượng tồn",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => {
        const isLow = record.quantity <= 10;
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
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (val?: string | Date) =>
        val ? dayjs(val).format("DD/MM/YYYY HH:mm") : "--",
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
      {/* 🔎 Thanh tìm kiếm */}
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

      {/* 📋 Bảng quản lý tồn kho */}
      <ProTable<InventoryDisplayType>
        columns={columns}
        dataSource={filteredData}
        rowKey="inventoryId"
        search={false}
        pagination={{ pageSize: 10 }}
        headerTitle="Quản lý tồn kho"
      />

      {/* Modal cập nhật nhập hàng */}
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
