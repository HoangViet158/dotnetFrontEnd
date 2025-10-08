import React from "react";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormDatePicker,
  ProFormGroup,
} from "@ant-design/pro-components";
import { GiftOutlined } from "@ant-design/icons";
import { Tag } from "antd";

interface Promotion {
  promo_id: number;
  promo_code: string;
  description?: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  start_date: string;
  end_date: string;
  min_order_amount: number;
  usage_limit: number;
  used_count: number;
  status: "active" | "inactive";
}

interface ModalEditPromotionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: Promotion | null;
}

const ModalEditPromotion: React.FC<ModalEditPromotionProps> = ({
  open,
  setOpen,
  data,
}) => {
  return (
    <ModalForm<Promotion>
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-[#1677ff]">
          <GiftOutlined />
          {data ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
        </div>
      }
      width={750}
      open={open}
      layout="horizontal"
      modalProps={{
        onCancel: () => setOpen(false),
        destroyOnClose: true,
        centered: true,
      }}
      grid
      rowProps={{ gutter: [16, 8] }}
      onFinish={async (values) => {
        console.log("✅ Dữ liệu gửi đi:", values);
        setOpen(false);
        return true;
      }}
      initialValues={data ?? {}}
    >
      {/* Thông tin cơ bản */}
      <ProFormGroup title="Thông tin khuyến mãi">
        <ProFormText
          name="promo_code"
          label="Mã khuyến mãi"
          placeholder="VD: SUMMER2025"
          colProps={{ span: 12 }}
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}
        />
        <ProFormText
          name="description"
          label="Mô tả"
          placeholder="VD: Giảm giá mùa hè"
          colProps={{ span: 12 }}
        />
      </ProFormGroup>

      {/* Giảm giá */}
      <ProFormGroup title="Giảm giá">
        <ProFormSelect
          name="discount_type"
          label="Loại giảm"
          valueEnum={{
            percent: "Giảm %",
            fixed: "Giảm số tiền",
          }}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: "Chọn loại giảm giá" }]}
        />
        <ProFormDigit
          name="discount_value"
          label="Giá trị"
          min={0}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: "Nhập giá trị giảm" }]}
        />
      </ProFormGroup>

      {/* Thời gian */}
      <ProFormGroup title="Thời gian áp dụng">
        <ProFormDatePicker
          name="start_date"
          label="Ngày bắt đầu"
          colProps={{ span: 12 }}
          rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
        />
        <ProFormDatePicker
          name="end_date"
          label="Ngày kết thúc"
          colProps={{ span: 12 }}
          rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
        />
      </ProFormGroup>

      {/* Điều kiện & Trạng thái */}
      <ProFormGroup title="Điều kiện & Trạng thái">
        <ProFormDigit
          name="min_order_amount"
          label="Đơn hàng tối thiểu"
          min={0}
          placeholder="0 nếu không giới hạn"
          colProps={{ span: 12 }}
        />
        <ProFormDigit
          name="usage_limit"
          label="Giới hạn sử dụng"
          min={0}
          placeholder="0 nếu không giới hạn"
          colProps={{ span: 12 }}
        />
        <ProFormSelect
          name="status"
          label="Trạng thái"
          valueEnum={{
            active: <Tag color="green">Hoạt động</Tag>,
            inactive: <Tag color="red">Ngưng</Tag>,
          }}
          colProps={{ span: 12 }}
        />
      </ProFormGroup>
    </ModalForm>
  );
};

export default ModalEditPromotion;
