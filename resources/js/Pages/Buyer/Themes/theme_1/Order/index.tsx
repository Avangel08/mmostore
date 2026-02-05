import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Container, Row, Col, Table, Form, Button, InputGroup, Dropdown, Badge, Modal } from "react-bootstrap";
import Layout from "../../Layouts";
import PageHeader from "../PageHeader/PageHeader";
import { useThemeConfig } from "../../hooks/useThemeConfig";

import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import OrdersTable from "./OrdersTable";
import { changeLayoutTheme } from "../../../../../slices/layouts/thunk";
import { useDispatch } from "react-redux";

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

interface OrdersData {
    rows: any[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

const Index: React.FC = () => {
    const {t} = useTranslation();
    const theme = useThemeConfig();
    const {user, orders} = usePage().props as { user: any; orders?: OrdersData };

    const dispatch: any = useDispatch();
    const [ordersData, setOrdersData] = useState<OrderData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalEntries, setTotalEntries] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [detailsTitle, setDetailsTitle] = useState<string>("");
    const [detailsItems, setDetailsItems] = useState<Array<{ product?: string; value?: string }>>([]);
    const [detailsOrderNumber, setDetailsOrderNumber] = useState<string>("");

    const fetchOrdersData = async () => {
        try {
            const response = await axios.get('/order', {
                params: {
                    page: currentPage,
                    per_page: perPage,
                    search: searchTerm,
                    category: selectedCategory
                },
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.data && response.data.orders) {
                const transformedOrders = response.data.orders.rows.map((order: any) => ({
                    order_number: order.order_number,
                    purchased_at: order.purchased_at ? new Date(order.purchased_at).toLocaleString('vi-VN') : '',
                    product_title: order.product_title,
                    quantity: order.quantity,
                    unit_price: order.unit_price,
                    total_price: order.total_price,
                    status: order.status,
                    notes: order.notes
                }));
                setOrdersData(transformedOrders);
                setTotalEntries(response.data.orders.pagination?.total || 0);
                setCurrentPage(response.data.orders.pagination?.current_page || 1);
                setPerPage(response.data.orders.pagination?.per_page || 10);
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        if (orders && orders.rows) {
            const transformedOrders = orders.rows.map((order: any) => ({
                order_number: order.order_number,
                purchased_at: order.purchased_at ? new Date(order.purchased_at).toLocaleString('vi-VN') : '',
                product_title: order.product_title,
                quantity: order.quantity,
                unit_price: order.unit_price,
                total_price: order.total_price,
                status: order.status,
                notes: order.notes
            }));
            setOrdersData(transformedOrders);
            setTotalEntries(orders.pagination?.total || 0);
            setCurrentPage(orders.pagination?.current_page || 1);
            setPerPage(orders.pagination?.per_page || 10);
        } else {
            setOrdersData([]);
            setTotalEntries(0);
        }

        if (theme) {
            dispatch(changeLayoutTheme(theme?.theme));
        }
    }, [orders, theme, dispatch]);


    const handleSearch = () => {
        setCurrentPage(1);
        fetchOrdersData();
    };

    useEffect(() => {
        fetchOrdersData();
    }, [currentPage, perPage, selectedCategory]);

    const handleViewOrder = async (orderNumber: string) => {
        setShowDetails(true);
        setDetailsOrderNumber(orderNumber);
        try {
            const response = await axios.get(`/order/${orderNumber}`);
            if (response.data.success) {
                const data = response.data.data || {};
                setDetailsTitle(data.product_title || "");
                const items = Array.isArray(data.items) ? data.items.map((it: any) => ({
                    product: it.key ?? "",
                    value: it.data ?? ""
                })) : [];
                setDetailsItems(items);
            }
        } catch (error) {
            setDetailsItems([]);
        }
    };

    const handleDownloadOrder = (orderNumber: string) => {
        window.open(`/order/${orderNumber}/download`, '_blank');
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <Badge bg="success">{t("Completed")}</Badge>;
            case "PENDING":
                return <Badge bg="warning">{t("Pending")}</Badge>;
            case "PROCESSING":
                return <Badge bg="info">{t("Processing")}</Badge>;
            case "CANCELLED":
                return <Badge bg="danger">{t("Cancelled")}</Badge>;
            case "FAILED":
                return <Badge bg="danger">{t("Failed")}</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const generatePaginationItems = () => {
        const items = [];
        const totalPages = Math.ceil(totalEntries / perPage);

        items.push(
            <Button
                key={1}
                variant={currentPage === 1 ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => setCurrentPage(1)}
                className="me-1"
            >
                1
            </Button>
        );

        for (let i = 2; i <= Math.min(5, totalPages); i++) {
            items.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                    className="me-1"
                >
                    {i}
                </Button>
            );
        }

        if (totalPages > 5) {
            items.push(<span key="ellipsis" className="me-1">...</span>);
            items.push(
                <Button
                    key={totalPages}
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                >
                    {totalPages}
                </Button>
            );
        }

        return items;
    };


    return (
        <React.Fragment>
            <PageHeader theme={theme}/>
            <Head title={`${t("Order history")} - ${theme?.storeName ?? ""}`} />

            <Container fluid className="custom-container">
                <Row className="mb-4 mt-4 align-items-center">
                    <Col md={6}>
                        <h4 className="mb-0" style={{fontSize: '30px', fontWeight: 'bold', color: 'black'}}>{t("Purchased order")}</h4>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end">
                            <div className="rounded-3 overflow-hidden border me-2" style={{width: '250px'}}>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder={t("Enter order number")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                            <Button variant="primary" onClick={handleSearch} className="rounded-3">
                                {t("Filter")}
                            </Button>
                        </div>
                    </Col>
                </Row>

                <OrdersTable
                    ordersData={ordersData}
                    handleViewOrder={handleViewOrder}
                    handleDownloadOrder={handleDownloadOrder}
                    formatCurrency={formatCurrency}
                    getStatusBadge={getStatusBadge}
                    fetchOrdersData={fetchOrdersData}
                    t={t}
                />

                <Row className="mt-3">
                    <Col md={6}>
                        <p className="text-muted mb-0"></p>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end align-items-center">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-1"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                <i className="ri-arrow-left-line"></i>
                            </Button>

                            {generatePaginationItems()}

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="ms-1"
                                disabled={currentPage === Math.ceil(totalEntries / perPage)}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                <i className="ri-arrow-right-line"></i>
                            </Button>

                            <Dropdown className="ms-3">
                                <Dropdown.Toggle variant="outline-secondary" size="sm">
                                    Show {perPage}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setPerPage(10)}>10</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setPerPage(25)}>25</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setPerPage(50)}>50</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setPerPage(100)}>100</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal show={showDetails} onHide={() => setShowDetails(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t("Order")} {detailsOrderNumber && `#${detailsOrderNumber}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="fw-semibold">{detailsOrderNumber}.txt</div>
                        <div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleDownloadOrder(detailsOrderNumber)}
                                disabled={!detailsOrderNumber}
                            >
                                <i className="ri-download-line"></i> {t("Download")}
                            </Button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <Table className="table align-middle">
                            <thead className="table-light">
                            <tr>
                                <th style={{width: 280}}>{t("Product")}</th>
                                <th>{t("Value")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {detailsItems.length > 0 ? (
                                detailsItems.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="text-truncate" style={{maxWidth: 280}} title={row.product}>
                                            {detailsTitle}
                                        </td>
                                        <td className="text-break" style={{wordBreak: 'break-all'}}>
                                            {row.value}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center text-muted py-4">
                                        {t("No data")}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetails(false)}>
                        {t("Close")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

const OrderPage = Index as any;
OrderPage.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default OrderPage;