"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ProTable,
  type ProColumns,
  type ActionType,
} from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Input, Tag, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { getAllPromotions, deletePromotion } from "../../../services/Promotion";
import ModalAddNew from "./ModalAddNew";
import ModalEditPromotion from "./ModalEditPromotion";

interface Promotion {
  promoId: number;
  promoCode: string;
  description?: string;
  discountType: "percent" | "amount";
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  status: "active" | "inactive";
}

const ManagerPromotion: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

  const [data, setData] = useState<Promotion[]>([]);
  const [filteredData, setFilteredData] = useState<Promotion[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<Promotion | null>(null);

  const [searchName, setSearchName] = useState("");

  const fetchPromotion = async () => {
    const res = await getAllPromotions();
    setData(res.data);
    setFilteredData(res.data);
    // setTotal(res);
  };

  useEffect(() => {
    fetchPromotion();
  }, []);

  const handleRefresh = async () => {
    await fetchPromotion();
    setSearchName("");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const filtered = data.filter((u) => {
      const matchName = searchName
        ? u.promoCode.toLowerCase().includes(searchName.toLowerCase())
        : true;
      return matchName;
    });
    setFilteredData(filtered);
    setTotal(filtered.length);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePromotion(id);
      message.success("Xóa khuyến mãi thành công!");
      fetchPromotion();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xóa thất bại!");
    }
  };

  const columns: ProColumns<Promotion>[] = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Mã KM", dataIndex: "promoCode", width: 120 },
    { title: "Mô tả", dataIndex: "description", ellipsis: true },
    {
      title: "Loại giảm",
      dataIndex: "discountType",
      width: 100,
      render: (_, record) =>
        record.discountType === "percent" ? "%" : "Tiền mặt",
    },
    { title: "Giá trị", dataIndex: "discountValue", width: 100 },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      width: 100,
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      width: 100,
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minOrderAmount",
      width: 120,
      render: (value) => <b>{value} ₫</b>,
    },
    { title: "Giới hạn", dataIndex: "usageLimit", width: 100 },
    { title: "Đã dùng", dataIndex: "usedCount", width: 80 },
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

          {/* <Popconfirm
            title="Bạn có chắc muốn xóa khuyến mãi này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.promoId)}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Search */}
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
          placeholder="Tìm theo mã khuyến mãi"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 220 }}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      <ProTable<Promotion>
        columns={columns}
        dataSource={filteredData}
        rowKey="promoId"
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
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        headerTitle="Danh sách khuyến mãi"
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={() => setOpenAdd(true)}>
            + Thêm khuyến mãi
          </Button>,
        ]}
      />

      {/* MODAL ADD */}
      <ModalAddNew
        open={openAdd}
        setOpen={setOpenAdd}
        reload={fetchPromotion}
      />

      {/* MODAL EDIT */}
      <ModalEditPromotion
        open={openEdit}
        setOpen={setOpenEdit}
        data={editData}
        reload={fetchPromotion}
      />
    </div>
  );
};

export default ManagerPromotion;
