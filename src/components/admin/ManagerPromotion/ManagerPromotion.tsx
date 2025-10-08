"use client";
import React, { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Supplier {
  supplier_id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: "active" | "inactive";
}

const ManagerSupplier: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

  const [data, setData] = useState<Supplier[]>([
    {
      supplier_id: 1,
      name: "Công ty TNHH Điện Lạnh Xanh",
      phone: "0901234567",
      email: "contact@dienlanhxanh.vn",
      address: "123 Nguyễn Văn Linh, Q7, TP.HCM",
      status: "active",
    },
  ]);

  const [editData, setEditData] = useState<Supplier | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.supplier_id !== id));
  };

  const columns: ProColumns<Supplier>[] = [
    {
      title: "Mã NCC",
      dataIndex: "supplier_id",
      width: 80,
      align: "center",
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
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
            style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setEditData(record);
              setOpenEdit(true);
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

  return (
    <div>
      <ProTable<Supplier>
        headerTitle="Quản lý nhà cung cấp"
        columns={columns}
        rowKey="supplier_id"
        search={false}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setOpenAdd(true)}>
            + Thêm nhà cung cấp
          </Button>,
        ]}
      />
    </div>
  );
};

export default ManagerSupplier;
