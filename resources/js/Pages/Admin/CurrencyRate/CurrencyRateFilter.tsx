import React, { useState, useRef } from "react";
import { Row, Col, Form, Button, InputGroup, FormControlProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../hooks/useQueryParam";

interface CurrencyRateFilterProps {
  onFilter: (
    currentPage: number,
    perPage: number,
    filters: CurrencyRateFilters
  ) => void;
}

interface CurrencyRateFilters {
  rateMin: string;
  rateMax: string;
  createdDateStart: string;
  createdDateEnd: string;
  effectiveDateStart: string;
  effectiveDateEnd: string;
}

const Filter = ({ onFilter }: CurrencyRateFilterProps) => {
  const { t, i18n } = useTranslation();

  const flatpickrRef = useRef<any>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const paramsUrl = useQueryParams();

  const perPage = paramsUrl?.perPage ?? "10";

  const effectiveFlatpickrRef = useRef<any>(null);

  const getInitialFilters = (): CurrencyRateFilters => {
    return {
      rateMin: paramsUrl?.rateMin ?? "",
      rateMax: paramsUrl?.rateMax ?? "",
      createdDateStart: paramsUrl?.createdDateStart ?? "",
      createdDateEnd: paramsUrl?.createdDateEnd ?? "",
      effectiveDateStart: paramsUrl?.effectiveDateStart ?? "",
      effectiveDateEnd: paramsUrl?.effectiveDateEnd ?? "",
    };
  };

  const [filters, setFilters] = useState<CurrencyRateFilters>(getInitialFilters());

  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const handleInputChange = (field: keyof CurrencyRateFilters, value: string) => {
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

  const handleEffectiveDateChange = (selectedDates: Date[]) => {
    const [start, end] = selectedDates;

    setFilters((prev) => ({
      ...prev,
      effectiveDateStart: start ? moment(start).format("YYYY-MM-DD") : "",
      effectiveDateEnd: end ? moment(end).format("YYYY-MM-DD") : "",
    }));
  };

  const handleRateMinChange = (values: any) => {
    const { floatValue } = values;
    setFilters((prev) => ({
      ...prev,
      rateMin: floatValue ? floatValue.toString() : "",
    }));
  };

  const handleRateMaxChange = (values: any) => {
    const { floatValue } = values;
    setFilters((prev) => ({
      ...prev,
      rateMax: floatValue ? floatValue.toString() : "",
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
    return Boolean(
      (filters.rateMin && filters.rateMin.trim() !== "") ||
      (filters.rateMax && filters.rateMax.trim() !== "") ||
      (filters.createdDateStart && filters.createdDateStart !== "") ||
      (filters.createdDateEnd && filters.createdDateEnd !== "") ||
      (filters.effectiveDateStart && filters.effectiveDateStart !== "") ||
      (filters.effectiveDateEnd && filters.effectiveDateEnd !== "")
    );
  };

  const handleReset = () => {
    const resetFilters = {
      rateMin: "",
      rateMax: "",
      createdDateStart: "",
      createdDateEnd: "",
      effectiveDateStart: "",
      effectiveDateEnd: ""
    };
    setFilters(resetFilters);

    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      flatpickrRef.current.flatpickr.clear();
    }

    if (effectiveFlatpickrRef.current && effectiveFlatpickrRef.current.flatpickr) {
      effectiveFlatpickrRef.current.flatpickr.clear();
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
            <Col md={6}>
              <Form.Label>{t("Rate range")}</Form.Label>
              <InputGroup>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  id="filter-rate-min"
                  value={filters.rateMin}
                  onValueChange={handleRateMinChange}
                  onKeyDown={handleKeyDown}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  placeholder={t("From")}
                  allowNegative={false}
                  fixedDecimalScale={false}
                />
                <InputGroup.Text>–</InputGroup.Text>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  id="filter-rate-max"
                  value={filters.rateMax}
                  onValueChange={handleRateMaxChange}
                  onKeyDown={handleKeyDown}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  placeholder={t("To")}
                  allowNegative={false}
                  fixedDecimalScale={false}
                />
              </InputGroup>
            </Col>

            <Col md={3}>
              <Form.Label htmlFor="filter-effective-date">
                {t("Effective date range")}
              </Form.Label>
              <Flatpickr
                ref={effectiveFlatpickrRef}
                className="form-control"
                id="filter-effective-date"
                placeholder={t("Select effective date range")}
                options={{
                  mode: "range",
                  dateFormat: "d/m/Y",
                  locale: getFlatpickrLocale(),
                }}
                value={
                  filters.effectiveDateStart && filters.effectiveDateEnd
                    ? [
                      new Date(filters.effectiveDateStart),
                      new Date(filters.effectiveDateEnd),
                    ]
                    : filters.effectiveDateStart
                      ? [new Date(filters.effectiveDateStart)]
                      : []
                }
                onChange={handleEffectiveDateChange}
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
