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
import { getAllSuppliers, deleteSupplier } from "../../../services/Suppliers";
import type { Supplier } from "../../../type/SuppliersType";

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

  // ==============================
  // GET DATA FROM API
  // ==============================
  const fetchSuppliers = async () => {
    try {
      const res = await getAllSuppliers();
      const suppliers: Supplier[] = res.data; // giả sử API trả về data ở res.data
      setData(suppliers);
      setFilteredData(suppliers);
      setTotal(suppliers.length);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      message.error("Không thể lấy danh sách nhà cung cấp");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ==============================
  // HANDLE SEARCH
  // ==============================
  const handleSearch = () => {
    const filtered = data.filter((s) => {
      const matchName = searchName
        ? s.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchPhone = searchName
        ? s.phone?.toLowerCase().includes(searchName.toLowerCase())
        : true;
      return matchName || matchPhone; // nếu tên hoặc số điện thoại khớp
    });
    setFilteredData(filtered);
    setTotal(filtered.length);
  };

  const handleRefresh = () => {
    fetchSuppliers();
    setSearchName("");
    setCurrentPage(1);
  };
  // ==============================
  // HANDLE DELETE
  // ==============================
  const handleDelete = async (id: number) => {
    console.log(id);
    try {
      await deleteSupplier(id);
      message.success("Đã xóa nhà cung cấp");
      fetchSuppliers(); // reload data sau khi xóa
    } catch (error) {
      console.error(error);
      message.error("Xóa nhà cung cấp thất bại");
    }
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
            onConfirm={() => handleDelete(record.supplierId)}
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
        request={async () => {
          handleRefresh();
          return {
            data: filteredData,
            total: filteredData.length,
          };
        }}
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

      <ModalAddSupplier
        open={openModalAdd}
        setOpen={setOpenModalAdd}
        onSuccess={fetchSuppliers} // reload sau khi thêm
      />
      <ModalEditSupplier
        open={openModalEdit}
        setOpen={setOpenModalEdit}
        data={editData}
        onSuccess={fetchSuppliers} // reload sau khi sửa
      />
    </div>
  );
};

export default ManagerSupplier;
