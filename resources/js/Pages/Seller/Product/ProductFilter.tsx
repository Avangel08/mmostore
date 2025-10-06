import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import moment from "moment";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../hooks/useQueryParam";
import { router } from "@inertiajs/react";

interface ProductFilterProps {
  onFilter: (
    currentPage: number,
    perPage: number,
    filters: ProductFilters
  ) => void;
  additionalButtons?: React.ReactNode;
}

interface ProductFilters {
  name: string;
  category: string;
  createdDateStart: string;
  createdDateEnd: string;
  status: string;
}

const ProductFilter = ({ onFilter, additionalButtons }: ProductFilterProps) => {
  const { t, i18n } = useTranslation();
  const flatpickrRef = useRef<any>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const paramsUrl = useQueryParams();
  const perPage = paramsUrl?.perPage ?? "10";
  const [categories, setCategories] = useState([]);

  const getInitialFilters = (): ProductFilters => {
    return {
      name: paramsUrl?.name ?? "",
      category: paramsUrl?.category ?? "",
      createdDateStart: paramsUrl?.createdDateStart ?? "",
      createdDateEnd: paramsUrl?.createdDateEnd ?? "",
      status: paramsUrl?.status ?? "",
    };
  };

  const [filters, setFilters] = useState<ProductFilters>(getInitialFilters());

  const categoryOptions = categories.map((cat: any) => ({
    value: cat?.id,
    label: cat?.name,
  }));
  categoryOptions.unshift({ value: "", label: t("All") });

  const statusOptions = [
    { value: "", label: t("All") },
    { value: "ACTIVE", label: t("Active") },
    { value: "INACTIVE", label: t("Inactive") },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

  useEffect(() => {
    const urlCategory = paramsUrl?.category;
    if (urlCategory !== null) {
      const matchingCategory = categoryOptions.find(
        (option) => option?.value?.toString() === urlCategory
      );
      if (matchingCategory) {
        setSelectedCategory(matchingCategory);
      }
    }

    const urlStatus = paramsUrl?.status;
    if (urlStatus !== null) {
      const matchingStatus = statusOptions.find(
        (option) => option?.value?.toString() === urlStatus
      );
      if (matchingStatus) {
        setSelectedStatus(matchingStatus);
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

  const handleInputChange = (field: keyof ProductFilters, value: string) => {
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

  const handleCategoryChange = (selected: any) => {
    setSelectedCategory(selected);
    handleInputChange("category", selected.value);
  };

  const handleStatusChange = (selected: any) => {
    setSelectedStatus(selected);
    handleInputChange("status", selected.value);
  };

  const handleFilter = () => {
    onFilter(1, Number(perPage), filters);
  };

  const hasActiveFilters = () => {
    const name = paramsUrl?.name || "";
    const category = paramsUrl?.category || "";
    const createdDateStart = paramsUrl?.createdDateStart || "";
    const createdDateEnd = paramsUrl?.createdDateEnd || "";
    const status = paramsUrl?.status || "";
    return (
      (name !== null && name !== "") ||
      (category !== null && category !== "") ||
      (createdDateStart !== null && createdDateStart !== "") ||
      (createdDateEnd !== null && createdDateEnd !== "") ||
      (status !== null && status !== "")
    );
  };

  const handleReset = () => {
    const resetFilters = {
      name: "",
      category: "",
      createdDateStart: "",
      createdDateEnd: "",
      status: "",
    };
    setFilters(resetFilters);
    setSelectedCategory(categoryOptions[0]);
    setSelectedStatus(statusOptions[0]);

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
      {/* Filter Form - Only visible when toggled */}
      {isFilterVisible && (
        <div className="p-3 border rounded bg-light mb-3">
          <Row className="g-3">
            <Col md={3}>
              <Form.Label htmlFor="filter-name">{t("Product Name")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-name"
                placeholder={t("Enter product name")}
                value={filters.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Label htmlFor="filter-category">{t("Category")}</Form.Label>
              <Select
                id="filter-category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categoryOptions}
                onMenuOpen={() => {
                  router.reload({
                    only: ["categories"],
                    onSuccess: (page) => {
                      const cats = (page?.props?.categories as any) || [];
                      setCategories(cats);
                    },
                  });
                }}
                classNamePrefix="select"
                isSearchable={true}
                placeholder={t("Select category")}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
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

            <Col md={12}>
              <Button variant="primary" onClick={handleFilter}>
                <i className="ri-search-line align-bottom me-1"></i>
                {t("Filter")}
              </Button>
            </Col>
          </Row>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
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

        {additionalButtons && (
          <div className="d-flex align-items-center gap-2">
            {additionalButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
