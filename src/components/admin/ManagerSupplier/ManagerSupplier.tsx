"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Popconfirm, Space, Select, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import ModalAddSupplier from "./ModalAddNew";
import ModalEditSupplier from "./ModalEdit";

interface Supplier {
  supplier_id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  status: "active" | "inactive";
}

const ManagerSupplier: React.FC = () => {
  const tableRef = useRef<any>(null);

  const [data, setData] = useState<Supplier[]>([]);
  const [filteredData, setFilteredData] = useState<Supplier[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editData, setEditData] = useState<Supplier | null>(null);

  const [searchName, setSearchName] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");

  // ==============================
  // MOCK DATA
  // ==============================
  useEffect(() => {
    const mockSuppliers: Supplier[] = [
      {
        supplier_id: 1,
        name: "Công ty TNHH Điện Lạnh Xanh",
        phone: "0901234567",
        email: "contact@dienlanhxanh.vn",
        address: "123 Nguyễn Văn Linh, Q7, TP.HCM",
        status: "active",
      },
      {
        supplier_id: 2,
        name: "Công ty Cổ phần Thiết Bị Công Nghiệp Việt",
        phone: "0909999999",
        email: "info@thietbicongnghiep.vn",
        address: "45 Lê Văn Lương, Hà Nội",
        status: "inactive",
      },
    ];
    setData(mockSuppliers);
    setFilteredData(mockSuppliers);
    setTotal(mockSuppliers.length);
  }, []);

  // ==============================
  // HANDLE SEARCH
  // ==============================
  const handleSearch = () => {
    const filtered = data.filter((s) => {
      const matchName = searchName
        ? s.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchStatus = searchStatus ? s.status === searchStatus : true;
      return matchName && matchStatus;
    });
    setFilteredData(filtered);
    setTotal(filtered.length);
  };

  // ==============================
  // HANDLE DELETE
  // ==============================
  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.supplier_id !== id));
    setFilteredData((prev) => prev.filter((item) => item.supplier_id !== id));
    message.success("Đã xóa nhà cung cấp");
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns: ProColumns<Supplier>[] = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (val: any) =>
        val === "active" ? (
          <span style={{ color: "green", fontWeight: 500 }}>Hoạt động</span>
        ) : (
          <span style={{ color: "red" }}>Ngừng</span>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: any, record: Supplier) => (
        <Space>
          <EditOutlined
            style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setEditData(record);
              setOpenModalEdit(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa nhà cung cấp này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.supplier_id)}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            />
          </Popconfirm>
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
          placeholder="Tìm theo tên nhà cung cấp"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          placeholder="Chọn trạng thái"
          value={searchStatus}
          onChange={(val) => setSearchStatus(val)}
          allowClear
          style={{ width: 180 }}
          options={[
            { label: "Hoạt động", value: "active" },
            { label: "Ngừng", value: "inactive" },
          ]}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      {/* Table */}
      <ProTable<Supplier>
        columns={columns}
        dataSource={filteredData}
        rowKey="supplier_id"
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
        headerTitle="Danh sách nhà cung cấp"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalAdd(true)}
          >
            Thêm nhà cung cấp
          </Button>,
        ]}
      />
      <ModalAddSupplier open={openModalAdd} setOpen={setOpenModalAdd} />
      <ModalEditSupplier
        open={openModalEdit}
        setOpen={setOpenModalEdit}
        data={editData}
      />
    </div>
  );
};

export default ManagerSupplier;
