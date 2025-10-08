"use client";
import React, { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, Space, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ModalAddNewRole from "./ModalAddNewRole";

// Giao diện dữ liệu vai trò
interface Role {
  role_id: number;
  name: string;
  description?: string;
  permissions: string[];
  status: "active" | "inactive";
}

const ManagerRole: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [data, setData] = useState<Role[]>([
    {
      role_id: 1,
      name: "Quản trị viên",
      description: "Toàn quyền quản lý hệ thống",
      permissions: ["Thêm người dùng", "Xóa người dùng", "Xem báo cáo"],
      status: "active",
    },
    {
      role_id: 2,
      name: "Nhân viên bán hàng",
      description: "Quản lý đơn hàng và sản phẩm tại quầy",
      permissions: ["Xem sản phẩm", "Tạo đơn hàng"],
      status: "active",
    },
    {
      role_id: 3,
      name: "Kế toán",
      description: "Theo dõi doanh thu và công nợ",
      permissions: ["Xem báo cáo", "Xuất hóa đơn"],
      status: "inactive",
    },
  ]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<Role | null>(null);

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((r) => r.role_id !== id));
  };

  const columns: ProColumns<Role>[] = [
    {
      title: "Tên vai trò",
      dataIndex: "name",
      width: 180,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Quyền hạn",
      dataIndex: "permissions",
      render: (_, record) =>
        record.permissions.map((p, i) => (
          <Tag key={i} color="blue" style={{ marginBottom: 4 }}>
            {p}
          </Tag>
        )),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (_, record) =>
        record.status === "active" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngưng</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ color: "#1677ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setEditData(record);
              setOpenEdit(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa vai trò này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.role_id)}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <ProTable<Role>
        headerTitle="Quản lý vai trò"
        columns={columns}
        dataSource={data}
        rowKey="role_id"
        search={false}
        pagination={{ pageSize: 5 }}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            icon={<PlusOutlined />}
            onClick={() => setOpenAdd(true)}
          >
            Thêm vai trò
          </Button>,
        ]}
      />

      <ModalAddNewRole open={openAdd} setOpen={setOpenAdd} />

      {/* TODO: Modal thêm/sửa vai trò (bạn có thể thêm sau) */}
      {/* <ModalAddRole open={openAdd} setOpen={setOpenAdd} /> */}
      {/* <ModalEditRole open={openEdit} setOpen={setOpenEdit} data={editData} /> */}
    </div>
  );
};

export default ManagerRole;
