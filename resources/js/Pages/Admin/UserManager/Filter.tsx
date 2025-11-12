import React, {useState, useRef, useEffect, useMemo} from "react";
import {Row, Col, Form, Button, InputGroup, FormControlProps} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import {NumericFormat} from "react-number-format";
import moment from "moment";
import {Vietnamese} from "flatpickr/dist/l10n/vn.js";
import {english} from "flatpickr/dist/l10n/default.js";
import {useQueryParams} from "../../../hooks/useQueryParam";

interface UserFilterProps {
    onFilter: (
        currentPage: number,
        perPage: number,
        filters: UserFilters
    ) => void;
    status?: any;
    type?: any;
    verifyStatus?: any;
}

interface UserFilters {
    name: string;
    email: string;
    type: string;
    createdDateStart: string;
    createdDateEnd: string;
    status: string;
    verifyStatus: string;
}

const UserFilter = ({ onFilter, status, type, verifyStatus }: UserFilterProps) => {
    const {t, i18n} = useTranslation();
    const flatpickrRef = useRef<any>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const paramsUrl = useQueryParams();
    const perPage = paramsUrl?.perPage ?? "10";

    const getInitialFilters = (): UserFilters => {
        return {
            name: paramsUrl?.name ?? "",
            email: paramsUrl?.email ?? "",
            type: paramsUrl?.type ?? "",
            createdDateStart: paramsUrl?.createdDateStart ?? "",
            createdDateEnd: paramsUrl?.createdDateEnd ?? "",
            status: paramsUrl?.status ?? "",
            verifyStatus: paramsUrl?.verifyStatus ?? "",
        };
    };

    const [filters, setFilters] = useState<UserFilters>(getInitialFilters());

    const typeOptions = useMemo(() => [
        {value: "", label: t("All")},
        ...Object.keys(type || {}).map(key => ({
            value: type[key],
            label: t(type[key])
        }))
    ], [type, t]);

    const statusOptions = useMemo(() => [
        {value: "", label: t("All")},
        ...Object.entries(status || {}).map(([key, value]) => ({
            value: key,
            label: t(key)
        }))
    ], [status, t]);

    const verifyStatusOptions: any = useMemo(() => [
        {value: "", label: t("All")},
        ...Object.entries(verifyStatus || {}).map(([key, value]) => ({
            value: value,
            label: t(key)
        }))
    ], [verifyStatus, t]);

    const [selectedType, setSelectedType] = useState({value: "", label: t("All")});
    const [selectedStatus, setSelectedStatus] = useState({value: "", label: t("All")});
    const [selectedVerifyStatus, setSelectedVerifyStatus] = useState({value: "", label: t("All")});

    useEffect(() => {
        if (typeOptions.length > 0) {
            setSelectedType(typeOptions[0]);
        }
        if (statusOptions.length > 0) {
            setSelectedStatus(statusOptions[0]);
        }
        if (verifyStatusOptions.length > 0) {
            setSelectedVerifyStatus(verifyStatusOptions[0]);
        }
    }, [typeOptions, statusOptions]);

    useEffect(() => {
        const urlType = paramsUrl?.type;
        if (urlType !== null) {
            const matchingType = typeOptions.find(
                (option) => option.value.toString() === urlType
            );
            if (matchingType) {
                setSelectedType(matchingType);
            }
        }

        const urlStatus = paramsUrl?.status;
        if (urlStatus !== null) {
            const matchingStatus = statusOptions.find(
                (option) => option.value.toString() === urlStatus
            );

            if (matchingStatus) {
                setSelectedStatus(matchingStatus);
            }
        }

        const urlVerifyStatus = paramsUrl?.verifyStatus;
        if (urlVerifyStatus !== null) {
            const matchingVerifyStatus = verifyStatusOptions.find(
                (option: any) => option.value.toString() === urlVerifyStatus
            );

            if (matchingVerifyStatus) {
                setSelectedVerifyStatus(matchingVerifyStatus);
            }
        }
    }, [paramsUrl?.type, paramsUrl?.status, paramsUrl?.verifyStatus, typeOptions, statusOptions, verifyStatusOptions]);


    const getFlatpickrLocale = () => {
        switch (i18n.language) {
            case "vi":
                return Vietnamese;
            default:
                return english;
        }
    };

    const handleInputChange = (field: keyof UserFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDateChange = (selectedDates: Date[]) => {
        const [start, end] = selectedDates;

        setFilters((prev) => ({
            ...prev,
            createdDateStart: start ? moment(start).format("YYYY-MM-DD") : "",
            createdDateEnd: end ? moment(end).format("YYYY-MM-DD") : "",
        }));
    };

    const handleTypeChange = (selected: any) => {
        setSelectedType(selected);
        handleInputChange("type", selected.value);
    };

    const handleStatusChange = (selected: any) => {
        setSelectedStatus(selected);
        handleInputChange("status", selected.value);
    };

    const handleVerifyStatusChange = (selected: any) => {
        setSelectedVerifyStatus(selected);
        handleInputChange("verifyStatus", selected.value);
    };

    const handleFilter = () => {
        onFilter(1, Number(perPage), filters);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleFilter();
        }
    };

    const hasActiveFilters = () => {
        const name = paramsUrl?.name || "";
        const email = paramsUrl?.email || "";
        const type = paramsUrl?.type || "";
        const createdDateStart = paramsUrl?.createdDateStart || "";
        const createdDateEnd = paramsUrl?.createdDateEnd || "";
        const status = paramsUrl?.status || "";
        const verifyStatus = paramsUrl?.verifyStatus || "";
        return (
            (name !== null && name !== "") ||
            (email !== null && email !== "") ||
            (type !== null && type !== "") ||
            (createdDateStart !== null && createdDateStart !== "") ||
            (createdDateEnd !== null && createdDateEnd !== "") ||
            (status !== null && status !== "") ||
            (verifyStatus !== null && verifyStatus !== "")
        );
    };

    const handleReset = () => {
        const resetFilters = {
            name: "",
            email: "",
            type: "",
            createdDateStart: "",
            createdDateEnd: "",
            status: "",
            verifyStatus: "",
        };
        setFilters(resetFilters);
        setSelectedType(typeOptions[0]);
        setSelectedStatus(statusOptions[0]);
        setSelectedVerifyStatus(verifyStatusOptions[0]);

        if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
            flatpickrRef.current.flatpickr.clear();
        }

        onFilter(1, Number(perPage), resetFilters);
    };

    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    return (
        <div className="filter-container mb-3">
            <div className="mb-3 d-flex align-items-center gap-2">
                <Button
                    variant="outline-primary"
                    onClick={toggleFilterVisibility}
                    className="d-flex align-items-center"
                >
                    <i
                        className={`ri-filter-${isFilterVisible ? "off" : "2"
                            }-line align-bottom me-2`}
                    ></i>
                    {isFilterVisible ? t("Hide Filters") : t("Show Filters")}
                </Button>

                {hasActiveFilters() && (
                    <Button
                        variant="outline-danger"
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
                    <Row className="g-3" style={{ marginBottom: "20px" }}>
                        <Col md={3}>
                            <Form.Label htmlFor="filter-name">{t("Name")}</Form.Label>
                            <Form.Control
                                type="text"
                                id="filter-name"
                                placeholder={t("Enter name")}
                                value={filters.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Label htmlFor="filter-email">{t("Email")}</Form.Label>
                            <Form.Control
                                type="text"
                                id="filter-email"
                                placeholder={t("Enter email")}
                                value={filters.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </Col>

                        <Col md={3}>
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
                                    filters.createdDateStart && filters.createdDateEnd ? [new Date(filters.createdDateStart), new Date(filters.createdDateEnd)] : filters.createdDateStart ? [new Date(filters.createdDateStart)] : []
                                }
                                onChange={handleDateChange}
                            />
                        </Col>
                    </Row>

                    <Row className="g-3">
                        <Col md={3}>
                            <Form.Label htmlFor="filter-type">{t("Type")}</Form.Label>
                            <Select
                                id="filter-type"
                                value={selectedType}
                                onChange={handleTypeChange}
                                options={typeOptions}
                                classNamePrefix="select"
                                isSearchable={true}
                                placeholder={t("Select type")}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({...base, zIndex: 9999}),
                                }}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Label htmlFor="filter-status">{t("Status")}</Form.Label>
                            <Select
                                id="filter-status"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                options={statusOptions}
                                classNamePrefix="select"
                                isSearchable={true}
                                placeholder={t("Select status")}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({...base, zIndex: 9999}),
                                }}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Label htmlFor="filter-verify-status">{t("Verify status")}</Form.Label>
                            <Select
                                id="filter-verify-status"
                                value={selectedVerifyStatus}
                                onChange={handleVerifyStatusChange}
                                options={verifyStatusOptions}
                                classNamePrefix="select"
                                isSearchable={true}
                                placeholder={t("Select verify status")}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                            />
                        </Col>

                        <Col md={12}>
                            <Button variant="primary" onClick={handleFilter}>
                                <i className="ri-search-line align-bottom me-1"></i>
                                {t("Filter")}
                            </Button>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default UserFilter;
