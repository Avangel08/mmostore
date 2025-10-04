import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button, InputGroup, FormControlProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../hooks/useQueryParam";

interface PlanFilterProps {
  onFilter: (
    currentPage: number,
    perPage: number,
    filters: PlanFilters
  ) => void;
}

interface PlanFilters {
  name: string;
  type: string;
  priceMin: string;
  priceMax: string;
  createdDateStart: string;
  createdDateEnd: string;
  status: string;
  showPublic: string;
}

const PlanFilter = ({ onFilter }: PlanFilterProps) => {
  const { t, i18n } = useTranslation();

  const flatpickrRef = useRef<any>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const paramsUrl = useQueryParams();

  const perPage = paramsUrl?.perPage ?? "10";

  const getInitialFilters = (): PlanFilters => {
    return {
      name: paramsUrl?.name ?? "",
      type: paramsUrl?.type ?? "",
      priceMin: paramsUrl?.priceMin ?? "",
      priceMax: paramsUrl?.priceMax ?? "",
      createdDateStart: paramsUrl?.createdDateStart ?? "",
      createdDateEnd: paramsUrl?.createdDateEnd ?? "",
      status: paramsUrl?.status ?? "",
      showPublic: paramsUrl?.showPublic ?? "",
    };
  };

  const [filters, setFilters] = useState<PlanFilters>(getInitialFilters());

  const typeOptions = [
    { value: "", label: t("All") },
    { value: 0, label: t("Default") },
    { value: 1, label: t("Normal") },
  ];

  const statusOptions = [
    { value: "", label: t("All") },
    { value: 1, label: t("Active") },
    { value: 0, label: t("Inactive") },
  ];

  const showPublicOptions = [
    { value: "", label: t("All") },
    { value: 1, label: t("Yes") },
    { value: 0, label: t("No") },
  ];

  const [selectedType, setSelectedType] = useState(typeOptions[0]);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [selectedShowPublic, setSelectedShowPublic] = useState(showPublicOptions[0]);

  // Set initial values from URL parameters
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

    const urlShowPublic = paramsUrl?.showPublic;
    if (urlShowPublic !== null) {
      const matchingShowPublic = showPublicOptions.find(
        (option) => option.value.toString() === urlShowPublic
      );
      if (matchingShowPublic) {
        setSelectedShowPublic(matchingShowPublic);
      }
    }
  }, []);



  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const handleInputChange = (field: keyof PlanFilters, value: string) => {
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

  const handleShowPublicChange = (selected: any) => {
    setSelectedShowPublic(selected);
    handleInputChange("showPublic", selected.value);
  };

  const handlePriceMinChange = (values: any) => {
    const { floatValue } = values;
    setFilters((prev) => ({
      ...prev,
      priceMin: floatValue ? floatValue.toString() : "",
    }));
  };

  const handlePriceMaxChange = (values: any) => {
    const { floatValue } = values;
    setFilters((prev) => ({
      ...prev,
      priceMax: floatValue ? floatValue.toString() : "",
    }));
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
    const type = paramsUrl?.type || "";
    const priceMin = paramsUrl?.priceMin || "";
    const priceMax = paramsUrl?.priceMax || "";
    const createdDateStart = paramsUrl?.createdDateStart || "";
    const createdDateEnd = paramsUrl?.createdDateEnd || "";
    const status = paramsUrl?.status || "";
    const showPublic = paramsUrl?.showPublic || "";
    return (
      (name !== null && name !== "") ||
      (type !== null && type !== "") ||
      (priceMin !== null && priceMin !== "") ||
      (priceMax !== null && priceMax !== "") ||
      (createdDateStart !== null && createdDateStart !== "") ||
      (createdDateEnd !== null && createdDateEnd !== "") ||
      (status !== null && status !== "") ||
      (showPublic !== null && showPublic !== "")
    );
  };

  const handleReset = () => {
    const resetFilters = {
      name: "",
      type: "",
      priceMin: "",
      priceMax: "",
      createdDateStart: "",
      createdDateEnd: "",
      status: "",
      showPublic: "",
    };
    setFilters(resetFilters);
    setSelectedType(typeOptions[0]);
    setSelectedStatus(statusOptions[0]);
    setSelectedShowPublic(showPublicOptions[0]);

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
      {/* Filter Button and Reset Button */}
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
            <Col md={3}>
              <Form.Label htmlFor="filter-name">{t("Plan name")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-name"
                placeholder={t("Enter plan name")}
                value={filters.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Col>

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
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Col>

            <Col md={6}>
              <Form.Label>{t("Price range")}</Form.Label>
              <InputGroup>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  id="filter-price-min"
                  value={filters.priceMin}
                  onValueChange={handlePriceMinChange}
                  onKeyDown={handleKeyDown}
                  thousandSeparator={true}
                  placeholder={t("From")}
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={false}
                />
                <InputGroup.Text>–</InputGroup.Text>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  id="filter-price-max"
                  value={filters.priceMax}
                  onValueChange={handlePriceMaxChange}
                  onKeyDown={handleKeyDown}
                  thousandSeparator={true}
                  placeholder={t("To")}
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={false}
                />
              </InputGroup>
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
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Col>

            <Col md={3}>
              <Form.Label htmlFor="filter-show-public">{t("Show public")}</Form.Label>
              <Select
                id="filter-show-public"
                value={selectedShowPublic}
                onChange={handleShowPublicChange}
                options={showPublicOptions}
                classNamePrefix="select"
                isSearchable={true}
                placeholder={t("Select visibility")}
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

export default PlanFilter;
