import React, { useState, useRef } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../hooks/useQueryParam";

interface CategoryFilterProps {
  onFilter: (
    currentPage: number,
    perPage: number,
    filters: CategoryFilters
  ) => void;
}

interface CategoryFilters {
  name: string;
  createdDateStart: string;
  createdDateEnd: string;
}

const Filter = ({ onFilter }: CategoryFilterProps) => {
  const { t, i18n } = useTranslation();

  const flatpickrRef = useRef<any>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const paramsUrl = useQueryParams();

  const perPage = paramsUrl?.perPage ?? "10";

  const getInitialFilters = (): CategoryFilters => {
    return {
      name: paramsUrl?.name ?? "",
      createdDateStart: paramsUrl?.createdDateStart ?? "",
      createdDateEnd: paramsUrl?.createdDateEnd ?? "",
    };
  };

  const [filters, setFilters] = useState<CategoryFilters>(getInitialFilters());

  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const handleInputChange = (field: keyof CategoryFilters, value: string) => {
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

  const handleFilter = () => {
    onFilter(1, Number(perPage), filters);
  };

  const hasActiveFilters = () => {
    return Boolean(
      (filters.name && filters.name.trim() !== "") ||
      (filters.createdDateStart && filters.createdDateStart !== "") ||
      (filters.createdDateEnd && filters.createdDateEnd !== "")
    );
  };

  const handleReset = () => {
    const resetFilters = {
      name: "",
      createdDateStart: "",
      createdDateEnd: ""
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
            variant="outline-secondary"
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
              <Form.Label htmlFor="filter-name">{t("Name")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-name"
                placeholder={t("Enter name and transaction")}
                value={filters.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
            <Col md={3} className="d-flex align-items-end">
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

export default Filter;
