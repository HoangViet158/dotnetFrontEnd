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
import ModalEdit from "./ModalEditCustomer";
import ModalAddNew from "./ModalAddNewCustomer";

interface User {
  customer_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

const ManagerCustomer: React.FC = () => {
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
  const [searchRole, setSearchRole] = useState<string>("");

  useEffect(() => {
    const mockUsers: User[] = [
      {
        customer_id: 1,
        name: "Admin Quản Trị",
        phone: "0909000001",
        email: "admin@mail.com",
        address: "Lê Đức Thọ, Hà Nội",
        created_at: "2025-10-01",
      },
      {
        customer_id: 2,
        name: "Nhân Viên 01",
        phone: "0909000002",
        email: "staff@mail.com",
        address: "Lê Đức Thọ, Hà Nội",
        created_at: "2025-10-02",
      },
      {
        customer_id: 3,
        name: "Nguyễn Văn A",
        phone: "0909000003",
        email: "user1@mail.com",
        address: "Địa chỉ 3",
        created_at: "2025-10-03",
      },
    ];
    setData(mockUsers);
    setFilteredData(mockUsers);
    setTotal(mockUsers.length);
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((u) => {
      const matchName = searchName
        ? u.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      //   const matchRole = searchRole ? u.role === searchRole : true;
      //   return matchName && matchRole;
      return matchName;
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
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
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
          placeholder="Tìm theo họ tên"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        {/* <Select
          placeholder="Chọn vai trò"
          value={searchRole}
          onChange={(val) => setSearchRole(val)}
          allowClear
          style={{ width: 180 }}
          options={[
            { label: "Admin", value: "admin" },
            { label: "Staff", value: "staff" },
          ]}
        /> */}
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      {/* Table */}
      <ProTable<User>
        columns={columns as ProColumns<User, "text">[]}
        dataSource={filteredData}
        rowKey="user_id"
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
            Thêm khách hàng
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

export default ManagerCustomer;
