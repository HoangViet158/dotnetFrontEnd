import {
  Card,
  Row,
  Col,
  Button,
  Pagination,
  Image,
  Input,
  Select,
  Space,
} from "antd";
import { useState, useMemo, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { ProductType } from "../../type/ProductsType";
import { getAllProducts } from "../../services/Products";
import type { InventoryType } from "../../type/InventoryType";
import { getProductQuantityInInventory } from "../../services/Inventory";

const { Meta } = Card;
const { Option } = Select;

interface ProductListProps {
  productQuantity: InventoryType[]
  onAddToCart: (product: { productId: number; productName: string; price: number }) => void;
}
const ProductList: React.FC<ProductListProps> = ({ productQuantity, onAddToCart }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("default");
  const [productList, setProductList] = useState<ProductType[]>([]);

  const fetchDataProductList = async () => {
    const res = await getAllProducts();
    if (res.success && res.data) {
      setProductList(res.data);
    } else {
      console.error("Lỗi khi fetch products:", res.message, res.errors);
    }

  };


  useEffect(() => {
    fetchDataProductList();
    // fetchProductQuantity();
  }, []);

  // Lọc theo tên
  const filtered = useMemo(() => {
    let list = productList.filter((p) =>
      p.productName.toLowerCase().includes(search.toLowerCase())
    );

    if (sortType === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortType === "desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortType === "name")
      list = [...list].sort((a, b) => a.productName.localeCompare(b.productName));

    return list;
  }, [productList, search, sortType]);

  // Phân trang
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const displayProducts = filtered.slice(start, end);

  return (
    <div className="mt-4">
      {/* Thanh điều khiển */}
      <div className="mb-3 flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
        <Space>
          <Input
            placeholder="Tìm sản phẩm..."
            prefix={<SearchOutlined />}
            style={{ maxWidth: 250 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Select
            value={sortType}
            onChange={(v) => setSortType(v)}
            style={{ width: 150 }}
          >
            <Option value="default">Mặc định</Option>
            <Option value="name">Theo tên (A-Z)</Option>
            <Option value="asc">Giá tăng dần</Option>
            <Option value="desc">Giá giảm dần</Option>
          </Select>
          <Select
            value={pageSize}
            onChange={(v) => {
              setPageSize(v);
              setPage(1);
            }}
            style={{ width: 120 }}
          >
            <Option value={4}>4 / trang</Option>
            <Option value={8}>8 / trang</Option>
            <Option value={12}>12 / trang</Option>
          </Select>
        </Space>
      </div>

      {/* Grid sản phẩm */}
      <Row gutter={[12, 12]}>
        {displayProducts.map((p) => {
          const inventory = productQuantity.find(q => q.productId === p.productId);
          const quantity = inventory?.quantity ?? 0;
          return <Col xs={12} sm={8} md={6} lg={6} key={p.productId}>
            <Card
              hoverable
              size="small"
              cover={
                <div
                  style={{
                    width: "100%",
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    // src={p.image}
                    alt={p.productName}
                    preview={false}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              }
              style={{
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Meta
                title={
                  <div className="text-center text-sm font-semibold line-clamp-2">
                    {p.productName}
                  </div>
                }
                description={
                  <div className="text-center mt-1">
                    <div className="text-blue-600 font-semibold">
                      {p.price.toLocaleString()} đ
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      Số lượng:{" "}
                      <span className="font-medium">{quantity}</span>
                    </div>
                  </div>
                }
              />

              <Button
                type="primary"
                block
                size="middle"
                style={{ marginTop: 10 }}
                onClick={() => onAddToCart({ productId: p.productId, productName: p.productName, price: p.price })}
              >
                Chọn
              </Button>
            </Card>
          </Col>
        })}
      </Row>

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filtered.length}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ProductList;
