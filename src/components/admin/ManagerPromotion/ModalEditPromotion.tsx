import React from "react";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormDateTimePicker,
  ProFormGroup,
} from "@ant-design/pro-components";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { updatePromotion } from "../../../services/Promotion";
import { Promotion } from "../../../type/Promotion";

interface ModalEditProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Promotion | null;
  reload?: () => void;
}

const ModalEditPromotion: React.FC<ModalEditProps> = ({
  open,
  setOpen,
  data,
  reload,
}) => {
  if (!data) return null;

  return (
    <ModalForm<Promotion>
      title={`Chỉnh sửa: ${data.promoCode}`}
      open={open}
      width={750}
      layout="horizontal"
      grid
      initialValues={{
        ...data,
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setOpen(false),
      }}
      onFinish={async (values) => {
        try {
          const payload: Promotion = {
            ...data,
            promoCode: values.promoCode,
            description: values.description,
            discountType: values.discountType,
            discountValue: values.discountValue,
            startDate: dayjs(values.startDate).toISOString(),
            endDate: dayjs(values.endDate).toISOString(),
            minOrderAmount: values.minOrderAmount || 0,
            usageLimit: values.usageLimit || 0,
            status: values.status,
            usedCount: data.usedCount,
          };

          if (new Date(payload.endDate) < new Date(payload.startDate)) {
            toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
            return false;
          }

          await updatePromotion(payload);
          toast.success("Cập nhật thành công!");
          reload?.();
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
          disabled
          colProps={{ span: 12 }}
        />
        <ProFormText name="description" label="Mô tả" colProps={{ span: 12 }} />
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
        />
        <ProFormDigit
          name="discountValue"
          label="Giá trị"
          min={0}
          colProps={{ span: 12 }}
        />
      </ProFormGroup>

      <ProFormGroup title="Thời gian áp dụng">
        <ProFormDateTimePicker
          name="startDate"
          label="Ngày bắt đầu"
          colProps={{ span: 12 }}
        />
        <ProFormDateTimePicker
          name="endDate"
          label="Ngày kết thúc"
          colProps={{ span: 12 }}
        />
      </ProFormGroup>

      <ProFormGroup title="Điều kiện & trạng thái">
        <ProFormDigit
          name="minOrderAmount"
          label="Đơn tối thiểu"
          min={0}
          colProps={{ span: 12 }}
        />
        <ProFormDigit
          name="usageLimit"
          label="Giới hạn sử dụng"
          min={0}
          colProps={{ span: 12 }}
        />
        <ProFormSelect
          name="status"
          label="Trạng thái"
          colProps={{ span: 12 }}
          options={[
            { label: "Hoạt động", value: "active" },
            { label: "Ngừng", value: "inactive" },
          ]}
        />
      </ProFormGroup>
    </ModalForm>
  );
};

export default ModalEditPromotion;
