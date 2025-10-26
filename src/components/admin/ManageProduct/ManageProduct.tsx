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
import {
  getAllProducts,
  createNewProduct,
  deleteProduct,
} from "../../../services/Products";
import { getAllCategories } from "../../../services/Category";
import { getAllSuppliers } from "../../../services/Suppliers";
import type { ProductType } from "../../../type/ProductsType";
interface Product {
  productId: number;
  category: Category;
  supplier: Supplier;
  productName: string;
  barcode: string;
  price: number;
  // category: string;
  unit: string;
  createdAt: string;
}
interface Category {
  categoryId: number;
  categoryName: string;
}

interface Supplier {
  supplierId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

const ManagerProduct: React.FC = () => {
  const tableRef = useRef<any>(null);

  const [data, setData] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editData, setEditData] = useState<ProductType | null>(null);

  const [searchName, setSearchName] = useState<string>("");
  const [searchCatogory, setsearchCatogory] = useState<number | "">("");
  const [searchSupplier, setsearchSupplier] = useState<number | "">("");

  const fetchProducts = async () => {
    const res = await getAllProducts();
    const products = res.data;
    console.log("Fetched products:", products);
    setData(products);
    setFilteredData(products);
    setTotal(products.length);
  };
  const fetchCategories = async () => {
    const res = await getAllCategories();
    setCategoriesList(res.data);
    // console.log("Fetched categories:", res.data);
  };

  const fetchSuppliers = async () => {
    const res = await getAllSuppliers();
    setSuppliersList(res.data);
    console.log("Fetched suppliers:", res.data);
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const handleRefresh = () => {
    fetchProducts();
    setsearchCatogory("");
    setSearchName("");
    setsearchSupplier("");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const filtered = data.filter((u) => {
      const matchName = searchName
        ? u.productName.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchCatogory = searchCatogory
        ? u.category.categoryId === searchCatogory
        : true;
      const matchSupplier = searchSupplier
        ? u.supplier.supplierId === searchSupplier
        : true;
      return matchName && matchCatogory && matchSupplier;
    });
    setFilteredData(filtered);
    setTotal(filtered.length);
  };
  const handleAddProduct = async (data: ProductType) => {
    console.log("Adding product:", data);
    try {
      const res = await createNewProduct(data);
      console.log("Added product:", res.data);
      message.success("Thêm sản phẩm mới thành công!");
      fetchProducts();
    } catch (error) {
      message.error("Thêm sản phẩm thất bại!");
      console.error("Error adding product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    console.log("Deleting product with id:", id);
    try {
      await deleteProduct(id);
      message.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      message.error("Xóa sản phẩm thất bại!");
      console.error("Error deleting product:", error);
    }
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
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Mã vạch",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (val: Category) => val.categoryName,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (val: Supplier) => val.name,
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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: any, record: ProductType) => (
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
            // onConfirm={() => handleDelete(record.ProductId!)}
            onConfirm={() => handleDelete(record.productId)}
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
          options={categoriesList.map((cat) => ({
            label: cat.categoryName,
            value: cat.categoryId,
          }))}
        />
        <Select
          placeholder="Chọn nhà cung cấp"
          value={searchSupplier}
          onChange={(val) => setsearchSupplier(val)}
          allowClear
          style={{ width: 180 }}
          options={suppliersList.map((sup) => ({
            label: sup.name,
            value: sup.supplierId,
          }))}
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
        request={async () => {
          handleRefresh();
          return {
            data: filteredData,
            total: filteredData.length,
          };
        }}
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
        listCategories={categoriesList}
        listSuppliers={suppliersList}
        fetchProducts={fetchProducts}
      />

      <ModalAddNew
        open={openModalAdd}
        setOpen={setOpenModalAdd}
        onSubmit={handleAddProduct}
        listCategories={categoriesList}
        listSuppliers={suppliersList}
      />
    </div>
  );
};

export default ManagerProduct;
