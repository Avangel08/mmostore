import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import moment from "moment";
import axios from "axios";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../../hooks/useQueryParam";
import { AsyncPaginate } from "react-select-async-paginate";

interface ProductAccountFilterProps {
  onFilter: (
    accountPage: number,
    accountPerPage: number,
    filters: ProductAccountFilters
  ) => void;
  subProductId?: string;
}

interface ProductAccountFilters {
  product: string;
  createdDateStart: string;
  createdDateEnd: string;
  status: string;
  orderNumber: string;
  sellStatus: string;
}

const SellerAccountFilter = ({ onFilter, subProductId }: ProductAccountFilterProps) => {
  const { t, i18n } = useTranslation();

  const flatpickrRef = useRef<any>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const paramsUrl = useQueryParams();

  const accountPerPage = paramsUrl?.accountPerPage ?? "10";

  const getInitialFilters = (): ProductAccountFilters => {
    return {
      product: paramsUrl?.product ?? "",
      createdDateStart: paramsUrl?.createdDateStart ?? "",
      createdDateEnd: paramsUrl?.createdDateEnd ?? "",
      status: paramsUrl?.status ?? "",
      orderNumber: paramsUrl?.orderNumber ?? "",
      sellStatus: paramsUrl?.sellStatus ?? "unsold",
    };
  };

  const [filters, setFilters] = useState<ProductAccountFilters>(getInitialFilters());

  const statusOptions = [
    { value: "", label: t("All") },
  ];

  const sellStatusOptions = [
    { value: "", label: t("All") },
    { value: "unsold", label: t("Unsold") },
    { value: "sold", label: t("Sold") },
  ];

  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [selectedSellStatus, setSelectedSellStatus] = useState(sellStatusOptions[0]);

  useEffect(() => {
    const urlStatus = paramsUrl?.status;
    if (urlStatus && subProductId) {
      axios.get(route("seller.account.status-options", { sub_product_id: subProductId, search: "", page: 1 }))
        .then((response) => {
          const statuses = response?.data?.results ?? [];
          const matchingStatus = statuses.find(
            (option: any) => option.value.toString() === urlStatus
          );
          if (matchingStatus) {
            setSelectedStatus({ value: matchingStatus.value, label: t(matchingStatus.label) });
          } else {
            setSelectedStatus({ value: urlStatus, label: urlStatus });
          }
        })
        .catch(() => {
          setSelectedStatus({ value: urlStatus, label: urlStatus });
        });
    }

    const urlSellStatus = paramsUrl?.sellStatus ?? "unsold";
    const matchingSellStatus = sellStatusOptions.find(
      (option) => option.value === urlSellStatus
    );
    if (matchingSellStatus) {
      setSelectedSellStatus(matchingSellStatus);
    }
  }, [subProductId]);

  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const handleInputChange = (field: keyof ProductAccountFilters, value: string) => {
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

  const handleStatusChange = (selected: any) => {
    setSelectedStatus(selected);
    handleInputChange("status", selected.value);
  };

  const handleSellStatusChange = (selected: any) => {
    setSelectedSellStatus(selected);
    handleInputChange("sellStatus", selected.value);
  };

  const handleFilter = () => {
    onFilter(1, Number(accountPerPage), filters);
  };

  const hasActiveFilters = () => {
    const product = paramsUrl?.product;
    const createdDateStart = paramsUrl?.createdDateStart;
    const createdDateEnd = paramsUrl?.createdDateEnd;
    const status = paramsUrl?.status;
    const orderNumber = paramsUrl?.orderNumber;
    const sellStatus = paramsUrl?.sellStatus;
    return (
      (product !== null && product !== "") ||
      (createdDateStart !== null && createdDateStart !== "") ||
      (createdDateEnd !== null && createdDateEnd !== "") ||
      (status !== null && status !== "") ||
      (orderNumber !== null && orderNumber !== "") ||
      (sellStatus !== null && sellStatus !== "unsold")
    );
  };

  const handleReset = () => {
    const resetFilters = {
      product: "",
      createdDateStart: "",
      createdDateEnd: "",
      status: "",
      orderNumber: "",
      sellStatus: "unsold",
    };
    setFilters(resetFilters);
    setSelectedStatus(statusOptions[0]);
    setSelectedSellStatus(sellStatusOptions[1]);

    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      flatpickrRef.current.flatpickr.clear();
    }

    onFilter(1, Number(accountPerPage), resetFilters);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="filter-container mb-3">
      {/* Filter Button and Reset Button */}
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

      {/* Filter Form - Only visible when toggled */}
      {isFilterVisible && (
        <div className="p-3 border rounded bg-light">
          <Row className="g-3">
            <Col md={6} lg={2}>
              <Form.Label htmlFor="filter-sell-status">{t("Sell Status")}</Form.Label>
              <Select
                id="filter-sell-status"
                value={selectedSellStatus}
                onChange={handleSellStatusChange}
                options={sellStatusOptions}
                classNamePrefix="select"
                isSearchable={true}
                placeholder={t("Select sell status")}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Col>

            <Col md={4} lg={3}>
              <Form.Label htmlFor="filter-product">{t("Product")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-product"
                placeholder={t("Enter product")}
                value={filters.product}
                onChange={(e) => handleInputChange("product", e.target.value)}
              />
            </Col>

            <Col md={4} lg={3}>
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

            <Col md={4} lg={2}>
              <Form.Label htmlFor="filter-status">{t("Status")}</Form.Label>
              <AsyncPaginate
                id="filter-status"
                value={selectedStatus}
                isClearable
                loadOptions={async (search, loadedOptions, { page }) => {
                  if (!subProductId) {
                    return {
                      options: [],
                      hasMore: false,
                    };
                  }
                  const response = await axios.get(route("seller.account.status-options", { sub_product_id: subProductId, search, page }));

                  const options = response?.data?.results?.map((option: any) => ({
                    value: option?.value ?? "",
                    label: t(option.label) ?? "",
                  })) ?? [];

                  return {
                    options,
                    hasMore: response.data.has_more,
                    additional: {
                      page: page + 1,
                    },
                  };
                }}
                additional={{
                  page: 1,
                }}
                clearCacheOnMenuClose
                clearCacheOnSearchChange
                onChange={handleStatusChange}
                options={statusOptions}
                classNamePrefix="select"
                placeholder={t("Select status")}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Col>

            <Col md={6} lg={2}>
              <Form.Label htmlFor="filter-order">{t("Order ID")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-order"
                placeholder={t("Enter Order ID")}
                value={filters.orderNumber}
                onChange={(e) => handleInputChange("orderNumber", e.target.value)}
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

export default SellerAccountFilter;