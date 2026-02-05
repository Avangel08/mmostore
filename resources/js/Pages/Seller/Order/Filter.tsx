import React, {useState, useRef} from "react";
import {Row, Col, Form, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import {Vietnamese} from "flatpickr/dist/l10n/vn.js";
import {english} from "flatpickr/dist/l10n/default.js";
import {useQueryParams} from "../../../hooks/useQueryParam";
import SearchableSelect from "../../../Components/Common/SearchableSelect";

interface FilterProps {
    onFilter: (
        currentPage: number,
        perPage: number,
        filters: Filters
    ) => void;
    categories?: Array<{
        _id: string;
        name: string;
    }>;
    products?: Array<{
        _id: string;
        name: string;
        category_id: string;
        category?: {
            _id: string;
            name: string;
        };
    }>;
    customers?: Array<{
        _id: string;
        name: string;
        email: string;
    }>;
    statusConst?: Record<string, string>;
    paymentStatusConst?: Record<string, string>;
}

interface Filters {
    search: string;
    createdDateStart: string;
    createdDateEnd: string;
    status: string;
    payment_status: string;
    category_id: string;
    product_id: string;
    customer_id: string;
}

const Filter = ({onFilter, categories = [], products = [], customers = [], statusConst = {}, paymentStatusConst = {}}: FilterProps) => {
    const {t, i18n} = useTranslation();
    const flatpickrRef = useRef<any>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const paramsUrl = useQueryParams();
    const perPage = paramsUrl?.perPage ?? "10";

    const getInitialFilters = (): Filters => {
        return {
            search: paramsUrl?.search ?? "",
            createdDateStart: paramsUrl?.createdDateStart ?? "",
            createdDateEnd: paramsUrl?.createdDateEnd ?? "",
            status: paramsUrl?.status ?? "",
            payment_status: paramsUrl?.payment_status ?? "",
            category_id: paramsUrl?.category_id ?? "",
            product_id: paramsUrl?.product_id ?? "",
            customer_id: paramsUrl?.customer_id ?? "",
        };
    };

    const [filters, setFilters] = useState<Filters>(getInitialFilters());

    const getFlatpickrLocale = () => {
        switch (i18n.language) {
            case "vi":
                return Vietnamese;
            default:
                return english;
        }
    };

    const handleInputChange = (field: keyof Filters, value: string) => {
        setFilters((prev) => {
            const newFilters = {
                ...prev,
                [field]: value,
            };

            if (field === 'category_id') {
                newFilters.product_id = '';
            }

            return newFilters;
        });
    };

    const handleDateChange = (selectedDates: Date[]) => {
        const [start, end] = selectedDates;

        setFilters((prev) => ({
            ...prev,
            createdDateStart: start ? moment(start).format("YYYY-MM-DD") : "",
            createdDateEnd: end ? moment(end).format("YYYY-MM-DD") : "",
        }));
    };

    const handleFilter = () => {
        onFilter(1, Number(perPage), filters);
    };

    const hasActiveFilters = () => {
        return Boolean(
            (filters.search && filters.search.trim() !== "") ||
            (filters.createdDateStart && filters.createdDateStart !== "") ||
            (filters.createdDateEnd && filters.createdDateEnd !== "") ||
            (filters.status && filters.status !== "") ||
            (filters.payment_status && filters.payment_status !== "") ||
            (filters.category_id && filters.category_id !== "") ||
            (filters.product_id && filters.product_id !== "") ||
            (filters.customer_id && filters.customer_id !== "")
        );
    };

    const handleReset = () => {
        const resetFilters = {
            search: "",
            createdDateStart: "",
            createdDateEnd: "",
            status: "",
            payment_status: "",
            category_id: "",
            product_id: "",
            customer_id: ""
        };
        setFilters(resetFilters);

        if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
            flatpickrRef.current.flatpickr.clear();
        }

        onFilter(1, Number(perPage), resetFilters);
    };

    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    return (
        <div className="filter-container mb-5">
            <div className="mb-3 d-flex align-items-center gap-2">
                <Button
                    variant="outline-primary"
                    onClick={toggleFilterVisibility}
                    className="d-flex align-items-center"
                >
                    <i
                        className={`ri-filter-${
                            isFilterVisible ? "off" : "2"
                        }-line align-bottom me-2`}
                    ></i>
                    {isFilterVisible ? t("Hide Filters") : t("Show Filters")}
                </Button>

                {hasActiveFilters() && (
                    <Button
                        variant="outline-secondary"
                        onClick={handleReset}
                        className="d-flex align-items-center"
                    >
                        <i className="ri-refresh-line align-bottom me-1"></i>
                        {t("Reset")}
                    </Button>
                )}
            </div>

            {isFilterVisible && (
                <div className="p-3 border rounded bg-light">
                    <Row className="g-2 align-items-end" style={{ marginBottom: '10px' }}>
                        <Col md={2}>
                            <Form.Label htmlFor="filter-search">{t("Order number")}</Form.Label>
                            <Form.Control
                                type="text"
                                id="filter-search"
                                placeholder={t("Enter order number")}
                                value={filters.search}
                                onChange={(e) => handleInputChange("search", e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <SearchableSelect
                                id="filter-customer"
                                label={t("Customer")}
                                value={filters.customer_id}
                                onChange={(value) => handleInputChange("customer_id", value)}
                                placeholder={t("All Customers")}
                                searchEndpoint="/admin/filter/customers"
                                searchParam="search"
                                displayField="name"
                                valueField="id"
                                secondaryField="email"
                            />
                        </Col>

                        

                        <Col md={2}>
                            <Form.Label htmlFor="filter-date">
                                {t("Created Date Range")}
                            </Form.Label>
                            <Flatpickr
                                ref={flatpickrRef}
                                className="form-control"
                                id="filter-date"
                                placeholder={t("Select date range")}
                                options={{
                                    mode: "range",
                                    dateFormat: "d/m/Y",
                                    locale: getFlatpickrLocale(),
                                }}
                                value={
                                    filters.createdDateStart && filters.createdDateEnd
                                        ? [
                                            new Date(filters.createdDateStart),
                                            new Date(filters.createdDateEnd),
                                        ]
                                        : filters.createdDateStart
                                            ? [new Date(filters.createdDateStart)]
                                            : []
                                }
                                onChange={handleDateChange}
                            />
                        </Col>
                    </Row>
                    <Row className="g-2 align-items-end" style={{ marginBottom: '10px' }}>
                        <Col md={2}>
                            <Form.Label htmlFor="filter-status">{t("Status")}</Form.Label>
                            <Form.Select
                                id="filter-status"
                                value={filters.status}
                                onChange={(e) => handleInputChange("status", e.target.value)}
                            >
                                <option value="">{t("All Status")}</option>
                                {Object.entries(statusConst).map(([key, label]) => (
                                    <option key={key} value={key}>{t(label)}</option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Label htmlFor="filter-payment-status">{t("Payment Status")}</Form.Label>
                            <Form.Select
                                id="filter-payment-status"
                                value={filters.payment_status}
                                onChange={(e) => handleInputChange("payment_status", e.target.value)}
                            >
                                <option value="">{t("All Status")}</option>
                                {Object.entries(paymentStatusConst).map(([key, label]) => (
                                    <option key={key} value={key}>{t(label)}</option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Label htmlFor="filter-category">{t("Category")}</Form.Label>
                            <Form.Select
                                id="filter-category"
                                value={filters.category_id}
                                onChange={(e) => handleInputChange("category_id", e.target.value)}
                            >
                                <option value="">{t("All Categories")}</option>
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        {t("No categories available")}
                                    </option>
                                )}
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Label htmlFor="filter-product">{t("Product")}</Form.Label>
                            <Form.Select
                                id="filter-product"
                                value={filters.product_id}
                                onChange={(e) => handleInputChange("product_id", e.target.value)}
                            >
                                <option value="">{t("All Products")}</option>
                                {products && products.length > 0 ? (
                                    products
                                        .filter((product) =>
                                            !filters.category_id || product.category_id === filters.category_id
                                        )
                                        .map((product) => (
                                            <option key={product._id} value={product._id}>{product.name}</option>
                                        ))
                                ) : (
                                    <option value="" disabled>
                                        {t("No products available")}
                                    </option>
                                )}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Col md={1} className="d-flex gap-1">
                        <Button variant="primary" onClick={handleFilter}>
                            <i className="ri-search-line align-bottom me-1"></i>
                            {t("Filter")}
                        </Button>
                    </Col>
                </div>
            )}
        </div>
    );
};

export default Filter;
