import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Dropdown, Nav, Tab, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import useChartColors from "../../../Components/Common/useChartColors";
import { useTranslation } from "react-i18next";
import Layout from "../../../CustomSellerLayouts";
import { allRevenueData, monthRevenueData, halfYearRevenueData, yearRevenueData, bestSellingProducts, recentOrders } from "../../../common/data/dashboardEcommerce";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import "flatpickr/dist/flatpickr.min.css";
import english from "flatpickr/dist/l10n/default";
import Vietnamese from "flatpickr/dist/l10n/vn";

interface DashboardProps {
    metrics?: {
        total_earnings: { value: number; previous: number; percentage_change: number };
        total_orders: { value: number; previous: number; percentage_change: number };
        total_customers: { value: number; previous: number; percentage_change: number };
        new_customers: { value: number; previous: number; percentage_change: number };
    };
    revenue_metrics?: {
        orders: { value: number; previous: number; percentage_change: number };
        earnings: { value: number; previous: number; percentage_change: number };
        refunds: { value: number; previous: number; percentage_change: number };
        conversion_ratio: { value: number; previous: number; percentage_change: number };
    };
    best_selling_products?: {
        data: Array<{
            id: string;
            label: string;
            orders: number;
            price: number;
            amount: number;
        }>;
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    recent_orders?: {
        data: Array<{
            id: string;
            order_number: string;
            customer_name: string;
            product_name: string;
            amount: number;
            status: string;
            payment_status: string;
            notes?: string;
            created_at: string;
        }>;
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    daily_chart_data?: {
        [key: string]: {
            date: string;
            earnings: number;
            orders: number;
            deposits: number;
            new_customers: number;
        };
    };
    filters?: {
        start_date: string;
        end_date: string;
    };
}

const Dashboard = ({ 
    metrics: serverMetrics, 
    revenue_metrics: serverRevenueMetrics,
    best_selling_products: serverBestSellingProducts,
    recent_orders: serverRecentOrders,
    daily_chart_data: serverDailyChartData,
    filters: serverFilters 
}: DashboardProps) => {
    const { t, i18n } = useTranslation();
    const page = usePage();
    const subdomain = (page.props as any).subdomain;
    const [currentPageProducts, setCurrentPageProducts] = useState<number>(1);
    const [currentPageOrders, setCurrentPageOrders] = useState<number>(1);
    
    // Date range filter
    const flatpickrRef = useRef<any>(null);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: new Date(),
        end: new Date()
    });
    
    const getFlatpickrLocale = () => {
        switch (i18n.language) {
            case "vi":
                return Vietnamese;
            default:
                return english;
        }
    };
    
    const handleDateChange = (selectedDates: Date[]) => {
        const [start, end] = selectedDates;
        setDateRange({
            start: start || null,
            end: end || null
        });
    };
    
    const handlePresetDateRange = (preset: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let start: Date, end: Date;
        
        switch (preset) {
            case 'today':
                start = new Date(today);
                end = new Date(today);
                break;
            case 'yesterday':
                start = new Date(today);
                start.setDate(start.getDate() - 1);
                end = new Date(today);
                end.setDate(end.getDate() - 1);
                break;
            case 'last7days':
                start = new Date(today);
                start.setDate(start.getDate() - 6);
                end = new Date(today);
                break;
            case 'last30days':
                start = new Date(today);
                start.setDate(start.getDate() - 29);
                end = new Date(today);
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            default:
                start = new Date(today);
                end = new Date(today);
        }
        
        setDateRange({ start, end });
        
        if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
            flatpickrRef.current.flatpickr.setDate([start, end]);
        }
    };
    
    const handleApplyFilter = () => {
        if (dateRange.start && dateRange.end) {
            router.get(`/admin/dashboard`, {
                start_date: moment(dateRange.start).format('YYYY-MM-DD'),
                end_date: moment(dateRange.end).format('YYYY-MM-DD'),
                product_page: 1,
                order_page: 1
            }, {
                preserveState: true,
                preserveScroll: true
            });
            setCurrentPageProducts(1);
            setCurrentPageOrders(1);
        }
    };

    const handleProductPageChange = (page: number) => {
        setCurrentPageProducts(page);
        if (dateRange.start && dateRange.end) {
            router.get(`/admin/dashboard`, {
                start_date: moment(dateRange.start).format('YYYY-MM-DD'),
                end_date: moment(dateRange.end).format('YYYY-MM-DD'),
                product_page: page,
                order_page: currentPageOrders
            }, {
                preserveState: true,
                preserveScroll: false
            });
        }
    };

    const handleOrderPageChange = (page: number) => {
        setCurrentPageOrders(page);
        if (dateRange.start && dateRange.end) {
            router.get(`/admin/dashboard`, {
                start_date: moment(dateRange.start).format('YYYY-MM-DD'),
                end_date: moment(dateRange.end).format('YYYY-MM-DD'),
                product_page: currentPageProducts,
                order_page: page
            }, {
                preserveState: true,
                preserveScroll: false
            });
        }
    };

    // Initialize date range from server or default to today
    useEffect(() => {
        if (serverFilters && serverFilters.start_date && serverFilters.end_date) {
            const start = moment(serverFilters.start_date).toDate();
            const end = moment(serverFilters.end_date).toDate();
            setDateRange({ start, end });
            if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
                flatpickrRef.current.flatpickr.setDate([start, end]);
            }
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            setDateRange({ start: today, end: today });
            if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
                flatpickrRef.current.flatpickr.setDate([today, today]);
            }
        }
    }, [serverFilters]);

    // Initialize pagination from server
    useEffect(() => {
        if (serverBestSellingProducts?.current_page) {
            setCurrentPageProducts(serverBestSellingProducts.current_page);
        }
        if (serverRecentOrders?.current_page) {
            setCurrentPageOrders(serverRecentOrders.current_page);
        }
    }, [serverBestSellingProducts, serverRecentOrders]);

    const getSubdomain = () => {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length >= 3) {
            const subdomain = parts[0];
            return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
        }
        return 'Merdify';
    };

    const titleWeb = t("Dashboard") + " - " +  getSubdomain();

    const revenueChartColors = useChartColors("revenueChart");

    // Generate chart data from daily data for 4 separate charts
    const getChartDataFromDailyData = () => {
        if (!serverDailyChartData || Object.keys(serverDailyChartData).length === 0) {
            return {
                earningsChart: [{ name: t("Earning"), type: "line", data: [] }],
                ordersChart: [{ name: t("Order"), type: "line", data: [] }],
                depositsChart: [{ name: t("Deposit"), type: "line", data: [] }],
                customersChart: [{ name: t("New customer"), type: "line", data: [] }],
                categories: [],
                maxEarnings: 0,
                maxOrders: 0,
                maxDeposits: 0,
                maxCustomers: 0
            };
        }

        const dates = Object.values(serverDailyChartData).map(item => item.date);
        const earningsData = Object.values(serverDailyChartData).map(item => item.earnings);
        const ordersData = Object.values(serverDailyChartData).map(item => item.orders);
        const depositsData = Object.values(serverDailyChartData).map(item => item.deposits);
        const customersData = Object.values(serverDailyChartData).map(item => item.new_customers);

        // Calculate max values for each dataset
        const maxEarnings = Math.max(...earningsData, 0);
        const maxOrders = Math.max(...ordersData, 0);
        const maxDeposits = Math.max(...depositsData, 0);
        const maxCustomers = Math.max(...customersData, 0);

        return {
            earningsChart: [{ name: t("Earning"), type: "line", data: earningsData }],
            ordersChart: [{ name: t("Order"), type: "line", data: ordersData }],
            depositsChart: [{ name: t("Deposit"), type: "line", data: depositsData }],
            customersChart: [{ name: t("New customer"), type: "line", data: customersData }],
            categories: dates,
            maxEarnings,
            maxOrders,
            maxDeposits,
            maxCustomers
        };
    };

    const chartData = getChartDataFromDailyData();

    // Use server best selling products if available, otherwise empty array
    const bestSellingProductsData = serverBestSellingProducts?.data || [];
    const bestSellingProductsPagination = serverBestSellingProducts || {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
    };

    // Use server recent orders if available, otherwise empty array
    const recentOrdersData = serverRecentOrders?.data || [];
    const recentOrdersPagination = serverRecentOrders || {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
    };

    // Revenue metrics data - use server data if available
    const getRevenueMetrics = () => {
        if (!serverRevenueMetrics) {
            return [
                { id: 1, label: "Orders", value: 0, decimals: 0 },
                { id: 2, label: "Earnings", value: 0, prefix: "$", suffix: "", decimals: 2 },
                { id: 3, label: "Refunds", value: 0, decimals: 0 },
                { id: 4, label: "Conversion Ratio", value: 0, suffix: "%", decimals: 2 }
            ];
        }

        const formatValue = (value: number, decimals: number = 0) => {
            if (value >= 1000) {
                return (value / 1000).toFixed(decimals);
            }
            return value.toFixed(decimals);
        };

        const getSuffix = (value: number) => {
            if (value >= 1000) {
                return "k";
            }
            return "";
        };

        return [
            { 
                id: 1, 
                label: "Orders", 
                value: serverRevenueMetrics.orders.value, 
                decimals: 0 
            },
            { 
                id: 2, 
                label: "Earnings", 
                value: formatValue(serverRevenueMetrics.earnings.value, 2), 
                prefix: "$", 
                suffix: getSuffix(serverRevenueMetrics.earnings.value), 
                decimals: 2 
            },
            { 
                id: 3, 
                label: "Refunds", 
                value: serverRevenueMetrics.refunds.value, 
                decimals: 0 
            },
            { 
                id: 4, 
                label: "Conversion Ratio", 
                value: serverRevenueMetrics.conversion_ratio.value, 
                suffix: "%", 
                decimals: 2 
            }
        ];
    };

    const revenueMetrics = getRevenueMetrics();

    // Chart options for daily line charts
    const getChartOptions = (formatter: (y: any) => string, maxValue?: number) => {
        // Calculate y-axis min and max based on maxValue
        let yaxisConfig: any = {
            labels: {
                formatter: formatter
            },
            tickAmount: 5,
            forceNiceScale: true
        };

        if (maxValue !== undefined && maxValue > 0) {
            // If there's data, set min to 0 and max to next round number above maxValue
            const nextRoundNumber = Math.ceil((maxValue + 1) / 10) * 10;
            yaxisConfig.min = 0;
            yaxisConfig.max = Math.max(nextRoundNumber, 10);
        } else {
            // If no data, set default range
            yaxisConfig.min = 0;
            yaxisConfig.max = 10;
        }

        return {
            chart: {
                type: 'line',
                height: 280,
                toolbar: {
                    show: false,
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: chartData.categories,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            yaxis: yaxisConfig,
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true,
                }
            },
            yaxis: {
                lines: {
                    show: true,
                }
            },
            padding: {
                top: 0,
                right: -2,
                bottom: 15,
                left: 10
            }
        },
        legend: {
            show: false
        },
        colors: revenueChartColors,
        tooltip: {
            shared: false,
            intersect: false,
            x: {
                show: true,
                formatter: function(value: number) {
                    return chartData.categories[value];
                }
            },
            y: {
                formatter: formatter
            }
        }
        };
    };

    const formatCompactNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toFixed(0);
    };

    const earningsChartOptions = getChartOptions((y: any) => {
        if (typeof y !== "undefined") {
            return formatCompactNumber(y);
        }
        return "0";
    }, chartData.maxEarnings);

    const ordersChartOptions = getChartOptions((y: any) => {
        if (typeof y !== "undefined") {
            return y.toFixed(0);
        }
        return "0";
    }, chartData.maxOrders);

    const depositsChartOptions = getChartOptions((y: any) => {
        if (typeof y !== "undefined") {
            return formatCompactNumber(y);
        }
        return "0";
    }, chartData.maxDeposits);

    const customersChartOptions = getChartOptions((y: any) => {
        if (typeof y !== "undefined") {
            return y.toFixed(0);
        }
        return "0";
    }, chartData.maxCustomers);


    // Dashboard metrics data - use server data if available, otherwise use defaults
    const getDashboardMetrics = () => {
        if (!serverMetrics) {
            // Return default data if no server metrics
            return [
                {
                    id: 1,
                    label: t("Earning"),
                    counter: 0,
                    icon: "bx bx-dollar-circle",
                    iconClass: "success-subtle",
                    iconColor: "success",
                    decimals: 2,
                    prefix: "",
                    suffix: ""
                },
                {
                    id: 2,
                    label: t("Order"),
                    counter: 0,
                    icon: "bx bx-shopping-bag",
                    iconClass: "info-subtle",
                    iconColor: "info",
                    decimals: 0,
                    prefix: "",
                    separator: ",",
                    suffix: ""
                },
                {
                    id: 3,
                    label: t("Deposit"),
                    counter: 0,
                    icon: "bx bx-dollar-circle",
                    iconClass: "warning-subtle",
                    iconColor: "warning",
                    decimals: 2,
                    prefix: "",
                    suffix: ""
                },
                {
                    id: 4,
                    label: t("New customer"),
                    counter: 0,
                    icon: "bx bx-user-plus",
                    iconClass: "primary-subtle",
                    iconColor: "primary",
                    decimals: 0,
                    prefix: "",
                    separator: ",",
                    suffix: ""
                }
            ];
        }

        return [
            {
                id: 1,
                label: t("Earning"),
                counter: serverMetrics.total_earnings.value,
                icon: "bx bx-dollar-circle",
                iconClass: "success-subtle",
                iconColor: "success",
                decimals: 2,
                prefix: "",
                suffix: ""
            },
            {
                id: 2,
                label: t("Order"),
                counter: serverMetrics.total_orders.value,
                icon: "bx bx-shopping-bag",
                iconClass: "info-subtle",
                iconColor: "info",
                decimals: 0,
                prefix: "",
                separator: ",",
                suffix: ""
            },
            {
                id: 3,
                label: t("Deposit"),
                counter: serverMetrics.total_customers.value,
                icon: "bx bx-dollar-circle",
                iconClass: "warning-subtle",
                iconColor: "warning",
                decimals: 2,
                prefix: "",
                suffix: ""
            },
            {
                id: 4,
                label: t("New customer"),
                counter: serverMetrics.new_customers.value,
                icon: "bx bx-user-plus",
                iconClass: "primary-subtle",
                iconColor: "primary",
                decimals: 0,
                prefix: "",
                separator: ",",
                suffix: ""
            }
        ];
    };

    const dashboardMetrics = getDashboardMetrics();

    // Utility function for money formatting
    const formatMoney = (num: number) => {
        if (typeof num !== 'number') num = Number(num);
        // If the decimal part is 0, don't show .00
        if (num % 1 === 0) {
            return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
        } else {
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    };

    // Utility function for status formatting (capitalize first letter, lowercase rest)
    const formatStatus = (status: string) => {
        if (!status) return '';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    return (
        <React.Fragment>
            <Head title={ titleWeb } />
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center gap-2">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-secondary">
                                            <i className="ri-calendar-line me-1"></i>
                                            {dateRange.start && dateRange.end ? (
                                                <>
                                                    {moment(dateRange.start).format('DD/MM/YYYY')} - {moment(dateRange.end).format('DD/MM/YYYY')}
                                                </>
                                            ) : (
                                                'Chọn khoảng thời gian'
                                            )}
                                            <i className="ri-arrow-down-s-line ms-1"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handlePresetDateRange('today')}>Hôm nay</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePresetDateRange('yesterday')}>Hôm qua</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePresetDateRange('last7days')}>7 ngày gần nhất</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePresetDateRange('last30days')}>30 ngày gần nhất</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePresetDateRange('thisMonth')}>Tháng này</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePresetDateRange('lastMonth')}>Tháng trước</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <div className="px-3 py-2">
                                                <Form.Label className="small text-muted mb-1">Chọn khoảng thời gian tùy chỉnh</Form.Label>
                                                <Flatpickr
                                                    ref={flatpickrRef}
                                                    className="form-control form-control-sm"
                                                    placeholder="Chọn khoảng thời gian"
                                                    options={{
                                                        mode: "range",
                                                        dateFormat: "d/m/Y",
                                                        locale: getFlatpickrLocale(),
                                                    }}
                                                    value={
                                                        dateRange.start && dateRange.end
                                                            ? [dateRange.start, dateRange.end]
                                                            : []
                                                    }
                                                    onChange={handleDateChange}
                                                />
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Button variant="primary" onClick={handleApplyFilter}>
                                        <i className="ri-search-line me-1"></i>
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        {dashboardMetrics.map((item: any) => (
                            <Col xl={3} md={6} key={item.id}>
                                <Card className="card-animate">
                                    <Card.Body>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <p className="text-uppercase fw-medium mb-0 text-muted">
                                                    {item.label}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-end justify-content-between mt-4">
                                            <div>
                                                <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                                                    <span className="counter-value">
                                                        <CountUp
                                                            start={0}
                                                            end={item.counter}
                                                            duration={2}
                                                            formatter={(value: number) => {
                                                                if (item.decimals === 2) {
                                                                    // For money values (Earnings, Deposits)
                                                                    // If the decimal part is 0, don't show .00
                                                                    if (value % 1 === 0) {
                                                                        return value.toLocaleString(undefined, { 
                                                                            maximumFractionDigits: 0 
                                                                        });
                                                                    } else {
                                                                        return value.toLocaleString(undefined, { 
                                                                            minimumFractionDigits: 2, 
                                                                            maximumFractionDigits: 2 
                                                                        });
                                                                    }
                                                                } else {
                                                                    // For counts (Orders, New Customers)
                                                                    return value.toLocaleString(undefined, { 
                                                                        maximumFractionDigits: 0 
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </span>
                                                </h4>
                                            </div>
                                            <div className="avatar-sm flex-shrink-0">
                                                <span className={`avatar-title material-shadow rounded fs-3 bg-${item.iconClass}`}>
                                                    <i className={`${item.icon} text-${item.iconColor}`}></i>
                                                </span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Revenue Section */}
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <Card.Body>
                                    {/* Revenue Charts - 4 separate charts in one row */}
                                    <Row>
                                        <Col xl={3} md={6}>
                                            <Card className="mb-3">
                                                <Card.Body>
                                                    <h6 className="mb-3">{t("Earning")}</h6>
                                                    <div id="earningsChart">
                                                        <ReactApexChart
                                                            dir="ltr"
                                                            options={earningsChartOptions}
                                                            series={chartData.earningsChart}
                                                            type="line"
                                                            height="280"
                                                            className="apex-charts"
                                                        />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xl={3} md={6}>
                                            <Card className="mb-3">
                                                <Card.Body>
                                                    <h6 className="mb-3">{t("Order")}</h6>
                                                    <div id="ordersChart">
                                                        <ReactApexChart
                                                            dir="ltr"
                                                            options={ordersChartOptions}
                                                            series={chartData.ordersChart}
                                                            type="line"
                                                            height="280"
                                                            className="apex-charts"
                                                        />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xl={3} md={6}>
                                            <Card className="mb-3">
                                                <Card.Body>
                                                    <h6 className="mb-3">{t("Deposit")}</h6>
                                                    <div id="depositsChart">
                                                        <ReactApexChart
                                                            dir="ltr"
                                                            options={depositsChartOptions}
                                                            series={chartData.depositsChart}
                                                            type="line"
                                                            height="280"
                                                            className="apex-charts"
                                                        />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xl={3} md={6}>
                                            <Card className="mb-3">
                                                <Card.Body>
                                                    <h6 className="mb-3">{t("New customer")}</h6>
                                                    <div id="customersChart">
                                                        <ReactApexChart
                                                            dir="ltr"
                                                            options={customersChartOptions}
                                                            series={chartData.customersChart}
                                                            type="line"
                                                            height="280"
                                                            className="apex-charts"
                                                        />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Products and Orders Tabs Section */}
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <Card.Body>
                                    <Tab.Container defaultActiveKey="best-selling">
                                        <Nav variant="pills" className="nav-pills-bordered mb-3" role="tablist">
                                            <Nav.Item>
                                                <Nav.Link eventKey="best-selling">
                                                    {t("Product")}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="recent-orders">
                                                    {t("Order")}
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>

                                        <Tab.Content>
                                            <Tab.Pane eventKey="best-selling">
                                                <div className="table-responsive">
                                                    <table className="table table-hover align-middle mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">{t("Product name")}</th>
                                                                <th scope="col">{t("Price")}</th>
                                                                <th scope="col">{t("Total order")}</th>
                                                                <th scope="col">{t("Total Price")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bestSellingProductsData.length > 0 ? (
                                                                bestSellingProductsData.map((product: any) => (
                                                                    <tr key={product.id}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                {product.img && <img src={product.img} alt="" className="avatar-sm rounded me-2" />}
                                                                                <div>
                                                                                    <h6 className="mb-0">{product.label}</h6>
                                                                                    {product.date && <p className="text-muted mb-0 fs-13">{product.date}</p>}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>{formatMoney(product.price)}</td>
                                                                        <td>{product.orders}</td>
                                                                        <td>{formatMoney(product.amount)}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={5} className="text-center py-4 text-muted">{t("No data")}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {bestSellingProductsPagination.total > 0 && (
                                                    <div className="d-flex align-items-center justify-content-between mt-3">
                                                        <div className="text-muted">
                                                            Hiển thị {(bestSellingProductsPagination.current_page - 1) * bestSellingProductsPagination.per_page + 1} đến {Math.min(bestSellingProductsPagination.current_page * bestSellingProductsPagination.per_page, bestSellingProductsPagination.total)} trong số {bestSellingProductsPagination.total} kết quả
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                disabled={bestSellingProductsPagination.current_page === 1}
                                                                onClick={() => handleProductPageChange(bestSellingProductsPagination.current_page - 1)}
                                                            >
                                                                <i className="ri-arrow-left-line"></i>
                                                            </Button>
                                                            {Array.from({ length: Math.min(bestSellingProductsPagination.last_page, 10) }, (_, i) => i + 1).map((page) => (
                                                                <Button
                                                                    key={page}
                                                                    variant={bestSellingProductsPagination.current_page === page ? "primary" : "outline-secondary"}
                                                                    size="sm"
                                                                    onClick={() => handleProductPageChange(page)}
                                                                >
                                                                    {page}
                                                                </Button>
                                                            ))}
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                disabled={bestSellingProductsPagination.current_page === bestSellingProductsPagination.last_page}
                                                                onClick={() => handleProductPageChange(bestSellingProductsPagination.current_page + 1)}
                                                            >
                                                                <i className="ri-arrow-right-line"></i>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="recent-orders">
                                                <div className="table-responsive">
                                                    <table className="table table-hover align-middle mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">{t("Order number")}</th>
                                                                <th scope="col">{t("Customer")}</th>
                                                                <th scope="col">{t("Product name")}</th>
                                                                <th scope="col">{t("Amount")}</th>
                                                                <th scope="col">{t("Order status")}</th>
                                                                <th scope="col">{t("Purchase date")}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {recentOrdersData.length > 0 ? (
                                                                recentOrdersData.map((order: any) => (
                                                                    <tr key={order.id || order.orderId}>
                                                                        <td style={{ width: '300px' }}>{order.order_number}</td>
                                                                        <td style={{ width: '250px' }}>{order.customer_name}</td>
                                                                        <td style={{ width: '400px' }}>{order.product_name}</td>
                                                                        <td>{formatMoney(order.amount)}</td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <span className={`badge bg-${order.status?.toLowerCase() === 'completed' ? 'success' : order.status?.toLowerCase() === 'cancelled' ? 'danger' : order.status?.toLowerCase() === 'failed' ? 'danger' : 'warning'}-subtle text-${order.status?.toLowerCase() === 'completed' ? 'success' : order.status?.toLowerCase() === 'cancelled' ? 'danger' : order.status?.toLowerCase() === 'failed' ? 'danger' : 'warning'}`} style={{ display: 'inline-block', width: '40%', textAlign: 'center' }}>
                                                                                    {formatStatus(t(order.status))}
                                                                                </span>
                                                                                {order.status?.toLowerCase() === 'failed' && order.notes && (
                                                                                    <OverlayTrigger
                                                                                        placement="top"
                                                                                        overlay={
                                                                                            <Tooltip id={`tooltip-${order.id}`}>
                                                                                                {order.notes}
                                                                                            </Tooltip>
                                                                                        }
                                                                                    >
                                                                                        <i className="ri-error-warning-line text-danger" style={{ cursor: 'pointer' }}></i>
                                                                                    </OverlayTrigger>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <span className="text-muted">
                                                                                {order.created_at ? moment(order.created_at).format('DD-MM-YYYY HH:mm:ss') : '-'}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={7} className="text-center py-4 text-muted">{t("No data")}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {recentOrdersPagination.total > 0 && (
                                                    <div className="d-flex align-items-center justify-content-between mt-3">
                                                        <div className="text-muted">
                                                            Hiển thị {(recentOrdersPagination.current_page - 1) * recentOrdersPagination.per_page + 1} đến {Math.min(recentOrdersPagination.current_page * recentOrdersPagination.per_page, recentOrdersPagination.total)} trong số {recentOrdersPagination.total} kết quả
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                disabled={recentOrdersPagination.current_page === 1}
                                                                onClick={() => handleOrderPageChange(recentOrdersPagination.current_page - 1)}
                                                            >
                                                                <i className="ri-arrow-left-line"></i>
                                                            </Button>
                                                            {Array.from({ length: Math.min(recentOrdersPagination.last_page, 10) }, (_, i) => i + 1).map((page) => (
                                                                <Button
                                                                    key={page}
                                                                    variant={recentOrdersPagination.current_page === page ? "primary" : "outline-secondary"}
                                                                    size="sm"
                                                                    onClick={() => handleOrderPageChange(page)}
                                                                >
                                                                    {page}
                                                                </Button>
                                                            ))}
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                disabled={recentOrdersPagination.current_page === recentOrdersPagination.last_page}
                                                                onClick={() => handleOrderPageChange(recentOrdersPagination.current_page + 1)}
                                                            >
                                                                <i className="ri-arrow-right-line"></i>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};
Dashboard.layout = (page: any) => <Layout children={page} />;
export default Dashboard;
