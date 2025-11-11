import React from "react";
import { Table, Button } from "react-bootstrap";

interface OrderData {
    order_number: string;
    purchased_at: string;
    product_title: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    status: string;
    notes?: string;
}

interface OrdersTableProps {
    ordersData: OrderData[];
    handleViewOrder: (orderNumber: string) => void;
    handleDownloadOrder: (orderNumber: string) => void;
    formatCurrency: (amount: number) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    fetchOrdersData: () => void;
    t: (key: string) => string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
    ordersData,
    handleViewOrder,
    handleDownloadOrder,
    formatCurrency,
    getStatusBadge,
    fetchOrdersData,
    t
}) => {
    return (
        <div className="card shadow-sm" style={{ minHeight: "50vh", borderRadius: 8, overflow: "hidden" }}>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <style>{`.orders-table tbody tr:last-child td { border-bottom: 0 !important; }`}</style>
                    <Table className="table table-nowrap mb-0 orders-table">
                        <thead className="table-light">
                            <tr>
                                <th>{t("Order number")}</th>
                                <th>{t("Purchase date")}</th>
                                <th>{t("Item")}</th>
                                <th>{t("Quantity")}</th>
                                <th>{t("Unit price")}</th>
                                <th>{t("Total amount")}</th>
                                <th>{t("Status")}</th>
                                <th>{t("Actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center text-muted py-4">
                                        {t("No orders yet")}
                                    </td>
                                </tr>
                            ) : (
                                ordersData.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order.order_number}</td>
                                        <td>{order.purchased_at}</td>
                                        <td className="text-wrap" style={{ maxWidth: "300px" }}>
                                            {order.product_title}
                                        </td>
                                        <td>{order.quantity}</td>
                                        <td>{formatCurrency(order.unit_price)}</td>
                                        <td>{formatCurrency(order.total_price)}</td>
                                        <td>{getStatusBadge(order.status)}</td>
                                        <td>
                                            {order.status === "COMPLETED" ? (
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleViewOrder(order.order_number)}
                                                        title={t("View order details")}
                                                    >
                                                        <i className="ri-eye-line"></i>
                                                    </Button>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => handleDownloadOrder(order.order_number)}
                                                        title={t("Download")}
                                                    >
                                                        <i className="ri-download-line"></i>
                                                    </Button>
                                                </div>
                                            ) : order.status === "FAILED" && order.notes ? (
                                                <span className="text-danger" title={t(order.notes)}>
                                                    {t(order.notes)}
                                                </span>
                                            ) : ("")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default OrdersTable;


