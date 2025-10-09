import React, {useState, useEffect} from "react";
import {Head, router} from "@inertiajs/react";
import {Container, Row, Col, Table, Form, Button, InputGroup, Dropdown, Badge, Modal} from "react-bootstrap";
import Layout from "../../Layouts";
import {useTranslation} from "react-i18next";
import {usePage} from "@inertiajs/react";
import axios from "axios";
import OrdersTable from "./OrdersTable";

interface OrderData {
    order_number: string;
    purchased_at: string;
    product_title: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    status: string;
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
    const {user, orders} = usePage().props as { user: any; orders?: OrdersData };

    const [ordersData, setOrdersData] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalEntries, setTotalEntries] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsTitle, setDetailsTitle] = useState<string>("");
    const [detailsItems, setDetailsItems] = useState<Array<{ product?: string; value?: string }>>([]);
    const [detailsOrderNumber, setDetailsOrderNumber] = useState<string>("");

    const fetchOrdersData = async () => {
        try {
            setLoading(true);
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
                    status: order.status
                }));
                setOrdersData(transformedOrders);
                setTotalEntries(response.data.orders.pagination?.total || 0);
                setCurrentPage(response.data.orders.pagination?.current_page || 1);
                setPerPage(response.data.orders.pagination?.per_page || 10);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
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
                status: order.status
            }));
            setOrdersData(transformedOrders);
            setTotalEntries(orders.pagination?.total || 0);
            setCurrentPage(orders.pagination?.current_page || 1);
            setPerPage(orders.pagination?.per_page || 10);
        } else {
            setOrdersData([]);
            setTotalEntries(0);
        }
    }, [orders]);


    const handleSearch = () => {
        setCurrentPage(1);
        fetchOrdersData();
    };

  // Fetch when pagination/filter changes
  useEffect(() => {
    // Avoid duplicate fetch on initial mount if no orders yet and totalEntries is 0
    // Still allows fetching when user changes page/perPage/category
    fetchOrdersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage, selectedCategory]);

    const handleViewOrder = async (orderNumber: string) => {
        setShowDetails(true);
        setDetailsLoading(true);
        setDetailsOrderNumber(orderNumber);
        try {
            const response = await axios.get(`/orders/${orderNumber}`);
            if (response.data.success) {
                const data = response.data.data || {};
                setDetailsTitle(data.product_title || "");
                // items from Accounts table: { key, data }
                const items = Array.isArray(data.items)
                    ? data.items.map((it: any) => ({product: it.key ?? "", value: it.data ?? ""}))
                    : [];
                setDetailsItems(items);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            setDetailsItems([]);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDownloadOrder = (orderNumber: string) => {
        // Trigger file download
        window.open(`/orders/${orderNumber}/download`, '_blank');
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <Badge bg="success">{ t("Completed") }</Badge>;
            case "PENDING":
                return <Badge bg="warning">{ t("Pending") }</Badge>;
            case "PROCESSING":
                return <Badge bg="info">{ t("Processing") }</Badge>;
            case "CANCELLED":
                return <Badge bg="danger">{ t("Cancelled") }</Badge>;
            case "FAILED":
                return <Badge bg="danger">{ t("Failed") }</Badge>;
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

    if (loading) {
        return (
            <React.Fragment>
                <Head title="Đơn hàng đã mua"/>
                <Container fluid className="custom-container">
                    <div className="d-flex justify-content-center align-items-center" style={{minHeight: "50vh"}}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </Container>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Head title="Đơn hàng đã mua"/>

            <div className="section job-hero-section pb-0" id="hero"
                 style={{background: "linear-gradient(180deg, #004577 0%, #122B3D 100%)"}}>
                <Container fluid className="custom-container">
                    <div className="d-flex align-items-center justify-content-between py-4">
                        <h3 className="display-8 fw-semibold text-capitalize mb-0 lh-base text-white">
                            Đơn hàng đã mua
                        </h3>
                    </div>
                </Container>
            </div>

            <Container fluid className="custom-container">
                <Row className="mb-4 mt-4">
                    <Col md={6}>
                        <div className="rounded-3 overflow-hidden border">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder={ t("Enter order number") }
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </Col>
                    <Col md={2}>
                        <Button variant="primary" onClick={handleSearch} className="rounded-3">
                            { t("Filter") }
                        </Button>
                    </Col>
                </Row>

                <OrdersTable
                    ordersData={ordersData}
                    loading={loading}
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
                        {t("Purchased order details")} {detailsOrderNumber && `#${detailsOrderNumber}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="fw-semibold">{detailsTitle}</div>
                        <div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleDownloadOrder(detailsOrderNumber)}
                                disabled={!detailsOrderNumber}
                            >
                                <i className="ri-download-line"></i> {t("Download order")}
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
                            {detailsLoading ? (
                                <tr>
                                    <td colSpan={2} className="text-center py-4">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">{t("Loading")}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : detailsItems.length > 0 ? (
                                detailsItems.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="text-truncate" style={{maxWidth: 280}} title={row.product}>
                                            {row.product}
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