import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import dayjs from "dayjs";

interface Log {
  log_id: number;
  change_type: string;
  quantity_change: number;
  note: string;
  created_at: string;
}

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: any;
}

const ModalInventoryLog: React.FC<Props> = ({ open, setOpen, product }) => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    if (product) {
      // Giả lập dữ liệu log
      setLogs([
        {
          log_id: 1,
          change_type: "IMPORT",
          quantity_change: 10,
          note: "Nhập từ phiếu PN001",
          created_at: "2025-10-05",
        },
        {
          log_id: 2,
          change_type: "SALE",
          quantity_change: -2,
          note: "Bán cho khách HD001",
          created_at: "2025-10-06",
        },
      ]);
    }
  }, [product]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      title={`Lịch sử thay đổi - ${product?.product_name || ""}`}
      width={700}
    >
      <Table
        dataSource={logs}
        rowKey="log_id"
        pagination={{ pageSize: 5 }}
        columns={[
          { title: "Loại thay đổi", dataIndex: "change_type" },
          { title: "Số lượng", dataIndex: "quantity_change" },
          { title: "Ghi chú", dataIndex: "note" },
          {
            title: "Ngày tạo",
            dataIndex: "created_at",
            render: (val) => dayjs(val).format("DD/MM/YYYY"),
          },
        ]}
      />
    </Modal>
  );
};

export default ModalInventoryLog;
