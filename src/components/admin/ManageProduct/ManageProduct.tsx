import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Popconfirm, Space, message, Select } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import dayjs from "dayjs";
import ModalEdit from "./ModalEditProduct";
import ModalAddNew from "./ModalAddNewProduct";

interface Product {
  product_id: number;
  category_id: number;
  supplier_id: number;
  product_name: string;
  barcode: string;
  price: number;
  // category: string;
  unit: string;
  created_at: string;
}

const ManagerProduct: React.FC = () => {
  const tableRef = useRef<any>(null);

  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);

  const [searchName, setSearchName] = useState<string>("");
  const [searchCatogory, setsearchCatogory] = useState<string>("");
  const [searchSupplier, setsearchSupplier] = useState<string>("");

  useEffect(() => {
    const mockProducts: Product[] = [
      {
        product_id: 1,
        supplier_id: 1,
        category_id: 1,
        product_name: "Coca Cola lon",
        barcode: "8900000000001",
        price: 314838,
        unit: "hộp",
        created_at: "2025-10-01",
      },
      {
        product_id: 2,
        supplier_id: 3,
        category_id: 2,
        product_name: "Pepsi lon",
        barcode: "8900000000002",
        price: 114807,
        unit: "cái",
        created_at: "2025-10-01",
      },
      {
        product_id: 3,
        supplier_id: 3,
        category_id: 3,
        product_name: "Trà Xanh 0 độ",
        barcode: "8900000000003",
        price: 415725,
        unit: "tuýp",
        created_at: "2025-10-01",
      },
      {
        product_id: 4,
        supplier_id: 1,
        category_id: 1,
        product_name: "Sting dâu",
        barcode: "8900000000004",
        price: 351670,
        unit: "cái",
        created_at: "2025-10-01",
      },
      {
        product_id: 5,
        supplier_id: 2,
        category_id: 3,
        product_name: "Red Bull",
        barcode: "8900000000005",
        price: 402179,
        unit: "lon",
        created_at: "2025-10-01",
      },
      {
        product_id: 6,
        supplier_id: 2,
        category_id: 1,
        product_name: "Bánh Oreo",
        barcode: "8900000000006",
        price: 209283,
        unit: "chai",
        created_at: "2025-10-01",
      },
      {
        product_id: 7,
        supplier_id: 3,
        category_id: 4,
        product_name: "Bánh Chocopie",
        barcode: "8900000000007",
        price: 212528,
        unit: "lon",
        created_at: "2025-10-01",
      },
      {
        product_id: 8,
        supplier_id: 2,
        category_id: 2,
        product_name: "Kẹo Alpenliebe",
        barcode: "8900000000008",
        price: 34313,
        unit: "lon",
        created_at: "2025-10-01",
      },
      {
        product_id: 9,
        supplier_id: 1,
        category_id: 4,
        product_name: "Kẹo bạc hà",
        barcode: "8900000000009",
        price: 316289,
        unit: "cái",
        created_at: "2025-10-01",
      },
      {
        product_id: 10,
        supplier_id: 2,
        category_id: 2,
        product_name: "Socola KitKat",
        barcode: "8900000000010",
        price: 139959,
        unit: "chai",
        created_at: "2025-10-01",
      },
    ];

    setData(mockProducts);
    setFilteredData(mockProducts);
    setTotal(mockProducts.length);
  }, []);

  const handleShowSupplier = (supplier_id: number) => {
    if (supplier_id === 1) {
      return "Coca";
    } else if (supplier_id === 2) {
      return "Pepsi";
    } else {
      return "Lays";
    }
  };
  const handleShowCatogory = (category_id: number) => {
    if (category_id === 1) {
      return "Bánh kẹo";
    } else if (category_id === 2) {
      return "Đồ uống";
    } else if (category_id === 3) {
      return "Gia vị";
    } else {
      return "Mỹ phẩm";
    }
  };

  const handleSearch = () => {
    const filtered = data.filter((u) => {
      const matchName = searchName
        ? u.product_name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchCatogory = searchCatogory
        ? u.category_id === searchCatogory
        : true;
      const matchSupplier = searchSupplier
        ? u.supplier_id === searchSupplier
        : true;
      return matchName && matchCatogory && matchSupplier;
    });
    setFilteredData(filtered);
    setTotal(filtered.length);
  };

  // ================================
  // TABLE COLUMNS
  // ================================
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Mã vạch",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      key: "category_id",
      render: (val: number) => handleShowCatogory(val),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier_id",
      key: "supplier_id",
      render: (val: number) => handleShowSupplier(val),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (val: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(val),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: any, record: User) => (
        <Space>
          <EditOutlined
            style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setEditData(record);
              setOpenModalEdit(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => {}}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ================================
  // RENDER
  // ================================
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
        <Select
          placeholder="Chọn danh mục"
          value={searchCatogory}
          onChange={(val) => setsearchCatogory(val)}
          allowClear
          style={{ width: 180 }}
          options={[
            { label: "Bánh kẹo", value: 1 },
            { label: "Đồ uống", value: 2 },
            { label: "Gia vị", value: 3 },
            { label: "Mỹ phẩm", value: 4 },
          ]}
        />
        <Select
          placeholder="Chọn nhà cung cấp"
          value={searchSupplier}
          onChange={(val) => setsearchSupplier(val)}
          allowClear
          style={{ width: 180 }}
          options={[
            { label: "Coca", value: 1 },
            { label: "Pepsi", value: 2 },
            { label: "Lays", value: 3 },
          ]}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      {/* Table */}
      <ProTable<Product>
        columns={columns as ProColumns<Product, "text">[]}
        dataSource={filteredData}
        rowKey="product_id"
        search={false}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (page: number, size: number) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        headerTitle="Danh sách người dùng"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalAdd(true)}
          >
            Thêm sản phẩm
          </Button>,
        ]}
      />

      <ModalEdit
        open={openModalEdit}
        setOpen={setOpenModalEdit}
        data={editData}
      />

      <ModalAddNew
        open={openModalAdd}
        setOpen={setOpenModalAdd}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default ManagerProduct;
