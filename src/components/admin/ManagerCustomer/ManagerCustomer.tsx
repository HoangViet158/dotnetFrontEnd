import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Popconfirm, Space } from "antd";
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
import {
  createNewCustomer,
  deleteCustomer,
  getAllCustomers,
} from "../../../services/Customer";
import { toast } from "react-toastify";
import type { Customer } from "../../../type/Customer";

const ManagerCustomer: React.FC = () => {
  // const tableRef = useRef<User>(null);

  const [data, setData] = useState<Customer[]>([]);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editData, setEditData] = useState<Customer | null>(null);

  const [searchName, setSearchName] = useState<string>("");
  const handleRefresh = async () => {
    await fetchCustomer();
    setSearchName("");
    setCurrentPage(1);
  };

  const handleAddCustomer = async (customer: Customer) => {
    const res = await createNewCustomer(customer);
    console.log(res);
    toast.success("Thêm người dùng thành công");
    fetchCustomer();
  };

  const fetchCustomer = async () => {
    const res = await getAllCustomers();
    console.log(res);
    setData(res.data);
    setFilteredData(res.data);
    // setTotal(res.data.);
  };
  useEffect(() => {
    fetchCustomer();
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
      render: (_: number, __: number, index: number) =>
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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: Customer, record: Customer) => (
        <Space>
          <EditOutlined
            style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setEditData(record);
              setOpenModalEdit(true);
            }}
          />
          {/* <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => {}}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            />
          </Popconfirm> */}
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
      <ProTable<Customer>
        columns={columns as ProColumns<Customer, "text">[]}
        dataSource={filteredData}
        rowKey="user_id"
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
        headerTitle="Danh sách người dùng"
        toolBarRender={() => [
          // <Button
          //   key="create"
          //   type="primary"
          //   icon={<PlusOutlined />}
          //   onClick={() => setOpenModalAdd(true)}
          // >
          //   Thêm khách hàng
          // </Button>,
        ]}
      />

      <ModalEdit
        open={openModalEdit}
        setOpen={setOpenModalEdit}
        data={editData}
        fetchCustomer={fetchCustomer}
      />
      <ModalAddNew
        open={openModalAdd}
        setOpen={setOpenModalAdd}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
};

export default ManagerCustomer;
