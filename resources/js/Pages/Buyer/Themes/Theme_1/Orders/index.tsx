import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';

type OrderRow = {
  order_code: string;
  purchased_at: string | null;
  product_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
};

const OrdersPage: React.FC = () => {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`/buyer/orders?page=${page}&per_page=${perPage}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(r => r.json())
      .then(res => {
        if (res?.success) {
          setRows(res.data.rows);
          setTotal(res.data.pagination.total);
        }
      })
      .catch(() => {});
  }, [page, perPage]);

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Đơn hàng đã mua</h5>
        </div>
        <div className="card-body">
          <Table hover responsive className="align-middle table-nowrap mb-0">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày mua</th>
                <th>Mặt hàng</th>
                <th style={{ textAlign: 'right' }}>Số lượng</th>
                <th style={{ textAlign: 'right' }}>Đơn giá</th>
                <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.order_code}>
                  <td>{r.order_code}</td>
                  <td>{r.purchased_at ? new Date(r.purchased_at).toLocaleString() : '-'}</td>
                  <td>{r.product_title}</td>
                  <td style={{ textAlign: 'right' }}>{r.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{r.unit_price}</td>
                  <td style={{ textAlign: 'right' }}>{r.total_price}</td>
                  <td><span className="badge bg-success">Hoàn thành</span></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, total)} of {total} entries</div>
            <div className="btn-group">
              <button className="btn btn-light" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>{'<'}</button>
              <button className="btn btn-light" disabled={(page * perPage) >= total} onClick={() => setPage(p => p + 1)}>{'>'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;


