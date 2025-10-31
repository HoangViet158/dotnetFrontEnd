import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Popconfirm, Space, message, Select } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import dayjs from "dayjs";
import ModalEdit from "./ModalEdit";
import ModalAddNewUser from "./ModalAddNewUser";
import { DeleteUser, GetUserAll } from "../../../services/User";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: "admin" | "staff";
  created_at: string;
}

const ManagerUser: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchName, setSearchName] = useState<string>("");
  const [searchRole, setSearchRole] = useState<string>("");

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // ================================
  // FETCH USERS
  // ================================
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await GetUserAll();
      if (res && res.success && res.data) {
        setData(res.data);
        setFilteredData(res.data); // ✅ hiển thị ban đầu
      } else {
        message.error("Không tải được danh sách người dùng!");
      }
    } catch (err) {
      message.error("Lỗi khi tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // ================================
  // HANDLE SEARCH
  // ================================
  const handleSearch = () => {
    const filtered = data.filter((u) => {
      const matchName = searchName
        ? u.fullName.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchRole = searchRole ? u.role === searchRole : true;
      return matchName && matchRole;
    });
    setFilteredData(filtered);
  };

  // ================================
  // HANDLE DELETE
  // ================================
  const handleDelete = async (user: User) => {
    try {
      const res = await DeleteUser(user.id);
      if (res && res.success) {
        toast.success("Xóa người dùng thành công!");
        fetchAllUsers();
      } else {
        toast.error(res.message || "Không thể xóa người dùng!");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa người dùng!");
    }
  };

  // ================================
  // TABLE COLUMNS
  // ================================
  const columns: ProColumns<User>[] = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Tên đăng nhập", dataIndex: "username", key: "username" },
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (_: any, record: User) =>
        record.role === "admin" ? (
          <span style={{ color: "#ff4d4f", fontWeight: 600 }}>Admin</span>
        ) : (
          <span style={{ color: "#1890ff" }}>Nhân viên</span>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (_: any, record: User) =>
        dayjs(record.created_at).format("DD/MM/YYYY "),
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
            onConfirm={() => handleDelete(record)}
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
            { label: "Nhân viên", value: "staff" },
          ]}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      {/* Table */}
      <ProTable<User>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="user_id"
        search={false}
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredData.length,
          showSizeChanger: true,
          onChange: (page, size) => {
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
          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            onClick={fetchAllUsers} // gọi lại API để refresh
          >
            Làm mới
          </Button>,
        ]}
      />

      <ModalEdit
        open={openModalEdit}
        setOpen={setOpenModalEdit}
        data={editData}
        fetchAllUsers={fetchAllUsers}
      />
      <ModalAddNewUser
        open={openModalAdd}
        setOpen={setOpenModalAdd}
        fetchAllUsers={fetchAllUsers}
      />
    </div>
  );
};

export default ManagerUser;
