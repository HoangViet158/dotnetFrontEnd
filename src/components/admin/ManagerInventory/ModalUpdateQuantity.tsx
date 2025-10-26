import React, { useState } from "react";
import { Modal, InputNumber, message } from "antd";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: any;
}

const ModalUpdateQuantity: React.FC<Props> = ({ open, setOpen, product }) => {
  const [quantity, setQuantity] = useState<number>(0);

  const handleOk = () => {
    if (quantity <= 0) {
      message.warning("Số lượng phải lớn hơn 0");
      return;
    }
    if (product) {
      const newQuantity = product.quantity + quantity;
      console.log(newQuantity);
      message.success(
        `
        thành công! Số lượng mới: ${newQuantity}`
      );
    }
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleOk}
      title={`Nhập hàng - ${product?.product_name || ""}`}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InputNumber
          min={1}
          style={{ width: "100%" }}
          placeholder="Nhập số lượng"
          value={quantity}
          onChange={(value) => setQuantity(value || 0)}
        />
      </div>
    </Modal>
  );
};

export default ModalUpdateQuantity;
