import React from "react";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormDateTimePicker,
  ProFormGroup,
} from "@ant-design/pro-components";
import { GiftOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { createNewPromotion } from "../../../services/Promotion";
import { Promotion } from "../../../type/Promotion";

interface ModalAddNewProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reload?: () => void; // callback refresh danh sách
}

const ModalAddNew: React.FC<ModalAddNewProps> = ({ open, setOpen, reload }) => {
  return (
    <ModalForm<Promotion>
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-[#52c41a]">
          <GiftOutlined />
          Thêm khuyến mãi mới
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
        try {
          // map form values về interface Promotion
          const payload: Promotion = {
            promoCode: values.promoCode,
            description: values.description,
            discountType: values.discountType, // "percent" | "amount"
            discountValue: values.discountValue,
            startDate: dayjs(values.startDate).toISOString(),
            endDate: dayjs(values.endDate).toISOString(),
            minOrderAmount: values.minOrderAmount || 0,
            usageLimit: values.usageLimit || 0,
            usedCount: 0,
            status: values.status,
          };

          if (new Date(payload.endDate) < new Date(payload.startDate)) {
            toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
            return false;
          }

          await createNewPromotion(payload);
          toast.success("Thêm khuyến mãi thành công!");
          reload?.(); // refresh danh sách
          setOpen(false);
          return true;
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Lỗi server!");
          return false;
        }
      }}
    >
      <ProFormGroup title="Thông tin khuyến mãi">
        <ProFormText
          name="promoCode"
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

      <ProFormGroup title="Giảm giá">
        <ProFormSelect
          name="discountType"
          label="Loại giảm"
          colProps={{ span: 12 }}
          options={[
            { label: "% phần trăm", value: "percent" },
            { label: "Tiền mặt", value: "fixed" },
          ]}
          rules={[{ required: true, message: "Chọn loại giảm giá" }]}
        />
        <ProFormDigit
          name="discountValue"
          label="Giá trị"
          colProps={{ span: 12 }}
          min={0}
          rules={[{ required: true, message: "Nhập giá trị giảm" }]}
        />
      </ProFormGroup>

      <ProFormGroup title="Thời gian áp dụng">
        <ProFormDateTimePicker
          name="startDate"
          label="Ngày bắt đầu"
          colProps={{ span: 12 }}
          rules={[{ required: true }]}
        />
        <ProFormDateTimePicker
          name="endDate"
          label="Ngày kết thúc"
          colProps={{ span: 12 }}
          rules={[{ required: true }]}
        />
      </ProFormGroup>

      <ProFormGroup title="Điều kiện & trạng thái">
        <ProFormDigit
          name="minOrderAmount"
          label="Đơn tối thiểu"
          colProps={{ span: 12 }}
          min={0}
          initialValue={0}
        />
        <ProFormDigit
          name="usageLimit"
          label="Giới hạn sử dụng"
          colProps={{ span: 12 }}
          min={0}
          initialValue={0}
        />
        <ProFormSelect
          name="status"
          label="Trạng thái"
          colProps={{ span: 12 }}
          options={[
            { label: "Hoạt động", value: "active" },
            { label: "Ngừng", value: "inactive" },
          ]}
          initialValue="active"
        />
      </ProFormGroup>
    </ModalForm>
  );
};

export default ModalAddNew;
