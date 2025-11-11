import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import moment from "moment";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../hooks/useQueryParam";

interface PaymentHistoryFilterProps {
  onFilter: (
    currentPage: number,
    perPage: number,
    filters: PaymentHistoryFilters
  ) => void;
  currentFilters?: PaymentHistoryFilters;
  typeOptions?: Record<string, string> | Array<{ value: string; label: string }>;
}

interface PaymentHistoryFilters {
  transactionId: string;
  customerName: string;
  createdDateStart: string;
  createdDateEnd: string;
  type: string;
}

const Filter = ({ onFilter, currentFilters, typeOptions = [] }: PaymentHistoryFilterProps) => {
  const { t, i18n } = useTranslation();

  const flatpickrRef = useRef<any>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const paramsUrl = useQueryParams();

  const perPage = paramsUrl?.perPage ?? "10";

  // Mapping type values to translation keys
  const typeTranslationMap: Record<number, string> = {
    1: "Deposit",
    2: "Order payment",
    3: "Deduct money",
  };

  const formattedTypeOptions = React.useMemo(() => {
    const allOption = { value: "", label: t("All") };
    if (Array.isArray(typeOptions)) {
      const translatedOptions = typeOptions.map((option: any) => ({
        value: option.value,
        label: typeTranslationMap[option.value] ? t(typeTranslationMap[option.value]) : option.label
      }));
      return [allOption, ...translatedOptions];
    }
    const mappedOptions = Object.entries(typeOptions).map(([key, value]) => {
      const typeValue = Number(key);
      const translationKey = typeTranslationMap[typeValue];
      return {
        value: key,
        label: translationKey ? t(translationKey) : String(value)
      };
    });
    return [allOption, ...mappedOptions];
  }, [typeOptions, t, i18n.language]);

  const getInitialFilters = (): PaymentHistoryFilters => {
    return {
      transactionId: currentFilters?.transactionId ?? paramsUrl?.transaction_id ?? "",
      customerName: currentFilters?.customerName ?? paramsUrl?.customer_name ?? "",
      createdDateStart: currentFilters?.createdDateStart ?? paramsUrl?.start_time ?? "",
      createdDateEnd: currentFilters?.createdDateEnd ?? paramsUrl?.end_time ?? "",
      type: currentFilters?.type ?? paramsUrl?.type ?? "",
    };
  };

  const [filters, setFilters] = useState<PaymentHistoryFilters>(getInitialFilters());
  
  const [selectedType, setSelectedType] = useState<any>(() => {
    if (formattedTypeOptions.length === 0) {
      return { value: "", label: t("All") };
    }
    const typeValue = paramsUrl?.type ?? "";
    return formattedTypeOptions.find(option => option.value === typeValue) || formattedTypeOptions[0];
  });
  
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  useEffect(() => {
    if (formattedTypeOptions.length === 0) return;

    const urlType = paramsUrl?.type;
    if (urlType !== null && urlType !== "") {
      const matchingType = formattedTypeOptions.find(
        (option) => option.value.toString() === urlType
      );
      if (matchingType) {
        setSelectedType(matchingType);
      } else {
        setSelectedType(formattedTypeOptions[0]);
      }
    } else {
      setSelectedType(formattedTypeOptions[0]);
    }
  }, [formattedTypeOptions, paramsUrl?.type, i18n.language]);

  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const handleInputChange = (field: keyof PaymentHistoryFilters, value: string) => {
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

  const handleFilter = () => {
    onFilter(1, Number(perPage), filters);
  };

  const hasActiveFilters = () => {
    return Boolean(
      (filters.transactionId && filters.transactionId.trim() !== "") ||
      (filters.customerName && filters.customerName.trim() !== "") ||
      (filters.createdDateStart && filters.createdDateStart !== "") ||
      (filters.createdDateEnd && filters.createdDateEnd !== "") ||
      (filters.type && filters.type !== "")
    );
  };
  const handleReset = () => {
    const resetFilters = {
      transactionId: "",
      customerName: "",
      createdDateStart: "",
      createdDateEnd: "",
      type: ""
    };
    setFilters(resetFilters);
    setSelectedType(formattedTypeOptions[0]);

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
              <Form.Label htmlFor="filter-transaction-id">{t("Transaction ID")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-transaction-id"
                placeholder={t("Enter transaction ID")}
                value={filters.transactionId}
                onChange={(e) => handleInputChange("transactionId", e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Label htmlFor="filter-customer-name">{t("Customer Name")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-customer-name"
                placeholder={t("Enter customer name")}
                value={filters.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
              />
            </Col>
            
            <Col md={3}>
              <Form.Label htmlFor="filter-type">{t("Type")}</Form.Label>
              <Select
                id="filter-type"
                value={selectedType}
                onChange={handleTypeChange}
                options={formattedTypeOptions}
                classNamePrefix="select"
                isSearchable={true}
                placeholder={t("Select type")}
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
          </Row>
          <Row className="g-3 mt-1">
            <Col md={12} className="d-flex justify-content-start">
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
