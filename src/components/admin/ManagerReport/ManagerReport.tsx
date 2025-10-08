"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Space,
  Divider,
  DatePicker,
  Button,
  message,
} from "antd";
import { Line, Pie, Column } from "@ant-design/plots";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ManagerReport: React.FC = () => {
  // =====================
  // MOCK DATA GỐC
  // =====================
  const fullRevenueData = [
    { month: "2025-01", value: 120 },
    { month: "2025-02", value: 150 },
    { month: "2025-03", value: 180 },
    { month: "2025-04", value: 210 },
    { month: "2025-05", value: 300 },
    { month: "2025-06", value: 280 },
    { month: "2025-07", value: 350 },
    { month: "2025-08", value: 320 },
    { month: "2025-09", value: 370 },
    { month: "2025-10", value: 420 },
  ];

  const productData = [
    { type: "Điện thoại", value: 27 },
    { type: "Laptop", value: 25 },
    { type: "Phụ kiện", value: 18 },
    { type: "Máy lạnh", value: 15 },
    { type: "Khác", value: 15 },
  ];

  const fullSalesData = [
    { day: "2025-10-01", sales: 45 },
    { day: "2025-10-02", sales: 60 },
    { day: "2025-10-03", sales: 30 },
    { day: "2025-10-04", sales: 70 },
    { day: "2025-10-05", sales: 90 },
    { day: "2025-10-06", sales: 110 },
    { day: "2025-10-07", sales: 55 },
  ];

  // =====================
  // STATE LỌC
  // =====================
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [filteredRevenue, setFilteredRevenue] = useState(fullRevenueData);
  const [filteredSales, setFilteredSales] = useState(fullSalesData);

  // =====================
  // HANDLE FILTER
  // =====================
  const handleFilter = () => {
    if (!dateRange) {
      message.warning("Vui lòng chọn khoảng thời gian!");
      return;
    }
    const [start, end] = dateRange;

    const filteredRev = fullRevenueData.filter((item) => {
      const d = dayjs(item.month);
      return (
        d.isAfter(start.startOf("month")) && d.isBefore(end.endOf("month"))
      );
    });
    const filteredS = fullSalesData.filter((item) => {
      const d = dayjs(item.day);
      return d.isAfter(start.startOf("day")) && d.isBefore(end.endOf("day"));
    });

    setFilteredRevenue(filteredRev);
    setFilteredSales(filteredS);
  };

  // =====================
  // TÍNH TOÁN TỔNG
  // =====================
  const totalRevenue = useMemo(
    () => filteredRevenue.reduce((acc, cur) => acc + cur.value, 0),
    [filteredRevenue]
  );
  const totalOrders = useMemo(
    () => filteredSales.reduce((acc, cur) => acc + cur.sales, 0),
    [filteredSales]
  );

  // =====================
  // CẤU HÌNH BIỂU ĐỒ
  // =====================
  const lineConfig = {
    data: filteredRevenue,
    xField: "month",
    yField: "value",
    smooth: true,
    color: "#1677ff",
    point: { size: 5, shape: "diamond" },
    tooltip: { showMarkers: true },
  };

  const pieConfig = {
    data: productData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    label: { type: "outer", content: "{name} {percentage}" },
    interactions: [{ type: "element-active" }],
  };

  const columnConfig = {
    data: filteredSales,
    xField: "day",
    yField: "sales",
    color: "#52c41a",
    columnWidthRatio: 0.5,
  };

  // =====================
  // RENDER UI
  // =====================
  return (
    <div style={{ padding: 24, background: "#f5f6fa", minHeight: "100vh" }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        📊 Báo cáo & Thống kê bán hàng
      </Title>

      {/* Bộ lọc thời gian */}
      <Card style={{ marginBottom: 24 }}>
        <Space align="center" wrap>
          <span>Chọn khoảng thời gian:</span>
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(values) => setDateRange(values as any)}
          />
          <Button type="primary" onClick={handleFilter}>
            Xem báo cáo
          </Button>
        </Space>
      </Card>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu (triệu)"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Khách hàng mới"
              value={85}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tăng trưởng"
              value={((totalRevenue / 500) * 100).toFixed(1)}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Biểu đồ doanh thu và sản phẩm */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="📈 Doanh thu theo tháng" bordered={false}>
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="🏆 Tỷ lệ sản phẩm bán chạy" bordered={false}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="📦 Đơn hàng bán ra theo ngày" bordered={false}>
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerReport;
