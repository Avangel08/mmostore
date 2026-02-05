import React, { useState, useRef, useEffect, useMemo } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import moment from "moment";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../hooks/useQueryParam";

interface StoreCategoryFilterProps {
  onFilter: (
    currentPage: number,
    perPage: number,
    filters: StoreCategoryFilters
  ) => void;
  additionalButtons?: React.ReactNode;
  statusConst?: Record<string, string>;
}

interface StoreCategoryFilters {
  name: string;
  createdDateStart: string;
  createdDateEnd: string;
  status: string;
}

const StoreCategoryFilter = ({ onFilter, additionalButtons, statusConst = {} }: StoreCategoryFilterProps) => {
  const { t, i18n } = useTranslation();

  const flatpickrRef = useRef<any>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const paramsUrl = useQueryParams();

  const perPage = paramsUrl?.perPage ?? "10";

  const getInitialFilters = (): StoreCategoryFilters => {
    return {
      name: paramsUrl?.name ?? "",
      createdDateStart: paramsUrl?.createdDateStart ?? "",
      createdDateEnd: paramsUrl?.createdDateEnd ?? "",
      status: paramsUrl?.status ?? "",
    };
  };

  const [filters, setFilters] = useState<StoreCategoryFilters>(getInitialFilters());

  const statusOptions = useMemo(() => {
    const options = [
      { value: "", label: t("All") },
    ];
    
    // Convert statusConst from backend to options format
    Object.entries(statusConst).forEach(([key, label]) => {
      options.push({
        value: key,
        label: t(label),
      });
    });
    
    return options;
  }, [statusConst, t]);

  // Store the current status value separately to preserve it during language changes
  const [statusValue, setStatusValue] = useState<string>(paramsUrl?.status || "");
  
  // Find the current status option based on statusValue
  const selectedStatus = useMemo(() => {
    if (statusOptions.length === 0) {
      return { value: "", label: t("All") };
    }
    
    if (statusValue && statusValue !== "") {
      const found = statusOptions.find(
        (option) => option.value.toString() === statusValue
      );
      if (found) {
        return found;
      }
    }
    
    return statusOptions[0];
  }, [statusOptions, statusValue, t]);

  // Sync statusValue with URL parameter (only when URL status changes)
  useEffect(() => {
    const urlStatus = paramsUrl?.status || "";
    if (urlStatus !== statusValue) {
      setStatusValue(urlStatus);
    }
  }, [paramsUrl?.status]);

  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const handleInputChange = (field: keyof StoreCategoryFilters, value: string) => {
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
    setStatusValue(selected.value);
    handleInputChange("status", selected.value);
  };

  const handleFilter = () => {
    onFilter(1, Number(perPage), filters);
  };

  const hasActiveFilters = () => {
    const name = paramsUrl?.name || "";
    const createdDateStart = paramsUrl?.createdDateStart || "";
    const createdDateEnd = paramsUrl?.createdDateEnd || "";
    const status = paramsUrl?.status || "";
    return (
      (name !== null && name !== "") ||
      (createdDateStart !== null && createdDateStart !== "") ||
      (createdDateEnd !== null && createdDateEnd !== "") ||
      (status !== null && status !== "")
    );
  };

  const handleReset = () => {
    const resetFilters = {
      name: "",
      createdDateStart: "",
      createdDateEnd: "",
      status: "",
    };
    setFilters(resetFilters);
    setStatusValue("");

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
      {isFilterVisible && (
        <div className="p-3 border rounded bg-light mb-3">
          <Row className="g-3">
            <Col md={3}>
              <Form.Label htmlFor="filter-name">{t("Name")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-name"
                placeholder={t("Enter store category name")}
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

            <Col md={3} className="d-flex align-items-end">
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

export default StoreCategoryFilter;

