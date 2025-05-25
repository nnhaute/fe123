import React from 'react';
import { Modal, Spin, Button } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import RobotoSerifRegular from '../../../../assets/fonts/Roboto/static/RobotoSerif-Regular.ttf';

const getReadableStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ thanh toán';
    case 'PAID':
      return 'Đã thanh toán';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
};

const InvoiceDetails = ({ visible, onClose, invoice }) => {
  const handleExportInvoice = () => {
    const doc = new jsPDF();
    doc.addFileToVFS('RobotoSerif-Regular.ttf', RobotoSerifRegular);
    doc.addFont('RobotoSerif-Regular.ttf', 'RobotoSerif', 'normal');
    doc.setFont('RobotoSerif-Regular');
    
    doc.text('Chi tiết hóa đơn', 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Thông tin', 'Chi tiết']],
      body: [
        ['Mã hóa đơn', invoice.code],
        ['Số hóa đơn', invoice.invoiceNumber],
        ['Số tiền', `${invoice.amount?.toLocaleString('vi-VN')} VND`],
        ['Ngày phát hành', new Date(invoice.issueDate).toLocaleDateString('vi-VN')],
        ['Trạng thái', getReadableStatus(invoice.status)],
        ['Mô tả', invoice.description],
        ['Ghi chú', invoice.note],
      ],
    });
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  return (
    <Modal
      title="Chi tiết hóa đơn"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="export" type="primary" onClick={handleExportInvoice}>
          Xuất hóa đơn
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      {invoice ? (
        <div style={{ padding: '20px', fontSize: '16px', lineHeight: '1.6' }}>
          <p><strong>Mã hóa đơn:</strong> {invoice.code}</p>
          <p><strong>Số hóa đơn:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Số tiền:</strong> {invoice.amount?.toLocaleString('vi-VN')} VND</p>
          <p><strong>Ngày phát hành:</strong> {new Date(invoice.issueDate).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> {getReadableStatus(invoice.status)}</p>
          <p><strong>Mô tả:</strong> {invoice.description}</p>
          <p><strong>Ghi chú:</strong> {invoice.note}</p>
        </div>
      ) : (
        <Spin size="large" />
      )}
    </Modal>
  );
};

export default InvoiceDetails; 