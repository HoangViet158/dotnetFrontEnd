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
import ModalEdit from "./ModalEdit";
import ModalAddNewUser from "./ModalAddNewUser";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: "admin" | "staff";
  created_at: string;
}

const ManagerUser: React.FC = () => {
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
        user_id: 1,
        username: "admin01",
        full_name: "Nguyễn Văn Quản Trị",
        role: "admin",
        created_at: "2025-10-01",
      },
      {
        user_id: 2,
        username: "staff01",
        full_name: "Trần Thị Nhân Viên",
        role: "staff",
        created_at: "2025-10-02",
      },
    ];
    setData(mockUsers);
    setFilteredData(mockUsers);
    setTotal(mockUsers.length);
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((u) => {
      const matchName = searchName
        ? u.full_name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchRole = searchRole ? u.role === searchRole : true;
      return matchName && matchRole;
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
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) =>
        role === "admin" ? (
          <span style={{ color: "#ff4d4f", fontWeight: 600 }}>Admin</span>
        ) : (
          <span style={{ color: "#1890ff" }}>Nhân viên</span>
        ),
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
          placeholder="Tìm theo họ tên"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          placeholder="Chọn vai trò"
          value={searchRole}
          onChange={(val) => setSearchRole(val)}
          allowClear
          style={{ width: 180 }}
          options={[
            { label: "Admin", value: "admin" },
            { label: "Staff", value: "staff" },
          ]}
        />
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
            Thêm người dùng
          </Button>,
        ]}
      />

      <ModalEdit
        open={openModalEdit}
        setOpen={setOpenModalEdit}
        data={editData}
      />
      <ModalAddNewUser open={openModalAdd} setOpen={setOpenModalAdd} />
    </div>
  );
};

export default ManagerUser;
