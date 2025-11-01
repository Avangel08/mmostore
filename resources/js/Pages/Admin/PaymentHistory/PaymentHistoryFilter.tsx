import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import moment from "moment";
import axios from "axios";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import { useQueryParams } from "../../../hooks/useQueryParam";
import { AsyncPaginate } from "react-select-async-paginate";

interface PaymentHistoryFilterProps {
  onFilter: (
    currentPage: number,
    perPage: number,
    filters: PaymentHistoryFilters
  ) => void;
  additionalButtons?: React.ReactNode;
}

interface PaymentHistoryFilters {
  createdDateStart: string;
  createdDateEnd: string;
  status: string;
  planName: string;
  userId: string;
  paymentMethodId: string;
  planType: string;
  expirationDateStart: string;
  expirationDateEnd: string;
}

const PaymentHistoryFilter = ({ onFilter, additionalButtons }: PaymentHistoryFilterProps) => {
  const { t, i18n } = useTranslation();

  const flatpickrRef = useRef<any>(null);
  const expirationFlatpickrRef = useRef<any>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const paramsUrl = useQueryParams();

  const perPage = paramsUrl?.perPage ?? "10";

  const getInitialFilters = (): PaymentHistoryFilters => {
    return {
      createdDateStart: paramsUrl?.createdDateStart ?? "",
      createdDateEnd: paramsUrl?.createdDateEnd ?? "",
      status: paramsUrl?.status ?? "",
      planName: paramsUrl?.planName ?? "",
      userId: paramsUrl?.userId ?? "",
      paymentMethodId: paramsUrl?.paymentMethodId ?? "",
      planType: paramsUrl?.planType ?? "",
      expirationDateStart: paramsUrl?.expirationDateStart ?? "",
      expirationDateEnd: paramsUrl?.expirationDateEnd ?? "",
    };
  };

  const [filters, setFilters] = useState<PaymentHistoryFilters>(getInitialFilters());

  const statusOptions = [
    { value: "", label: t("All") },
    { value: "0", label: t("Pending") },
    { value: "1", label: t("Completed") },
    { value: "2", label: t("Rejected") },
  ];

  const planTypeOptions = [
    { value: "", label: t("All") },
    { value: "0", label: t("Default") },
    { value: "1", label: t("Normal") },
  ];

  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [selectedUser, setSelectedUser] = useState({ value: "", label: t("All") });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({ value: "", label: t("All") });
  const [selectedPlanType, setSelectedPlanType] = useState(planTypeOptions[0]);

  useEffect(() => {
    const urlStatus = paramsUrl?.status;
    if (urlStatus !== null) {
      const matchingStatus = statusOptions.find(
        (option) => option.value.toString() === urlStatus
      );
      if (matchingStatus) {
        setSelectedStatus(matchingStatus);
      }
    }

    const urlUser = paramsUrl?.userId;
    if (urlUser) {
      axios.get(route("admin.user.list-user", { search: "", page: 1 }))
        .then((response) => {
          const users = response?.data?.results ?? [];
          const matchingUser = users.find(
            (option: any) => option.value.toString() === urlUser
          );
          if (matchingUser) {
            setSelectedUser(matchingUser);
          } else {
            setSelectedUser({ value: urlUser, label: urlUser });
          }
        })
        .catch(() => {
          setSelectedUser({ value: urlUser, label: urlUser });
        });
    }

    const urlPaymentMethod = paramsUrl?.paymentMethodId;
    if (urlPaymentMethod) {
      axios.get(route("admin.payment-method.list-method", { search: "", page: 1 }))
        .then((response) => {
          const paymentMethods = response?.data?.results ?? [];
          const matchingPaymentMethod = paymentMethods.find(
            (option: any) => option.value.toString() === urlPaymentMethod
          );
          if (matchingPaymentMethod) {
            setSelectedPaymentMethod(matchingPaymentMethod);
          } else {
            setSelectedPaymentMethod({ value: urlPaymentMethod, label: urlPaymentMethod });
          }
        })
        .catch(() => {
          setSelectedPaymentMethod({ value: urlPaymentMethod, label: urlPaymentMethod });
        });
    }

    const urlPlanType = paramsUrl?.planType;
    if (urlPlanType !== null) {
      const matchingPlanType = planTypeOptions.find(
        (option) => option.value.toString() === urlPlanType
      );
      if (matchingPlanType) {
        setSelectedPlanType(matchingPlanType);
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

  const handleExpirationDateChange = (selectedDates: Date[]) => {
    const [start, end] = selectedDates;

    setFilters((prev) => ({
      ...prev,
      expirationDateStart: start ? moment(start).format("YYYY-MM-DD") : "",
      expirationDateEnd: end ? moment(end).format("YYYY-MM-DD") : "",
    }));
  };

  const handleStatusChange = (selected: any) => {
    setSelectedStatus(selected);
    handleInputChange("status", selected.value);
  };

  const handleUserChange = (selected: any) => {
    setSelectedUser(selected);
    handleInputChange("userId", selected.value);
  };

  const handlePaymentMethodChange = (selected: any) => {
    setSelectedPaymentMethod(selected);
    handleInputChange("paymentMethodId", selected.value);
  };

  const handlePlanTypeChange = (selected: any) => {
    setSelectedPlanType(selected);
    handleInputChange("planType", selected.value);
  };

  const handleFilter = () => {
    onFilter(1, Number(perPage), filters);
  };

  const hasActiveFilters = () => {
    const createdDateStart = paramsUrl?.createdDateStart || "";
    const createdDateEnd = paramsUrl?.createdDateEnd || "";
    const status = paramsUrl?.status || "";
    const planName = paramsUrl?.planName || "";
    const userId = paramsUrl?.userId || "";
    const paymentMethodId = paramsUrl?.paymentMethodId || "";
    const planType = paramsUrl?.planType || "";
    const expirationDateStart = paramsUrl?.expirationDateStart || "";
    const expirationDateEnd = paramsUrl?.expirationDateEnd || "";
    return (
      (createdDateStart !== null && createdDateStart !== "") ||
      (createdDateEnd !== null && createdDateEnd !== "") ||
      (status !== null && status !== "") ||
      (planName !== null && planName !== "") ||
      (userId !== null && userId !== "") ||
      (paymentMethodId !== null && paymentMethodId !== "") ||
      (planType !== null && planType !== "") ||
      (expirationDateStart !== null && expirationDateStart !== "") ||
      (expirationDateEnd !== null && expirationDateEnd !== "")
    );
  };

  const handleReset = () => {
    const resetFilters = {
      createdDateStart: "",
      createdDateEnd: "",
      status: "",
      planName: "",
      userId: "",
      paymentMethodId: "",
      planType: "",
      expirationDateStart: "",
      expirationDateEnd: "",
    };
    setFilters(resetFilters);
    setSelectedStatus(statusOptions[0]);
    setSelectedUser({ value: "", label: t("All") });
    setSelectedPaymentMethod({ value: "", label: t("All") });
    setSelectedPlanType(planTypeOptions[0]);

    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      flatpickrRef.current.flatpickr.clear();
    }

    if (expirationFlatpickrRef.current && expirationFlatpickrRef.current.flatpickr) {
      expirationFlatpickrRef.current.flatpickr.clear();
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
            <Col md={6} lg={3}>
              <Form.Label htmlFor="filter-plan-name">{t("Plan name")}</Form.Label>
              <Form.Control
                type="text"
                id="filter-plan-name"
                placeholder={t("Enter plan name")}
                value={filters.planName}
                onChange={(e) => handleInputChange("planName", e.target.value)}
              />
            </Col>

            <Col md={6} lg={3}>
              <Form.Label htmlFor="filter-user">{t("User")}</Form.Label>
              <AsyncPaginate
                id="filter-user"
                value={selectedUser}
                isClearable
                loadOptions={async (search, loadedOptions, { page }: any) => {
                  const response = await axios.get(route("admin.user.list-user", { search, page }));

                  const options = response?.data?.results?.map((option: any) => ({
                    value: option?.value ?? "",
                    label: option?.label ?? "",
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
                onChange={handleUserChange}
                classNamePrefix="select"
                placeholder={t("Select user")}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Col>

            <Col md={6} lg={3}>
              <Form.Label htmlFor="filter-payment-method">{t("Payment Method")}</Form.Label>
              <AsyncPaginate
                id="filter-payment-method"
                value={selectedPaymentMethod}
                isClearable
                loadOptions={async (search, loadedOptions, { page }: any) => {
                  const response = await axios.get(route("admin.payment-method.list-method", { search, page }));

                  const options = response?.data?.results ?? [];

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
                onChange={handlePaymentMethodChange}
                classNamePrefix="select"
                placeholder={t("Select payment method")}
                menuPortalTarget={document.body}
                formatOptionLabel={(option: any) => (
                  <div className="d-flex flex-column">
                    <span className="fw-semibold">{option.label}</span>
                    {(option.type || option.account_name) && (
                      <small className="text-muted">
                        {option.type && (
                          <>
                            <span className="fw-medium">{t("Type")}:</span> {option.type}
                          </>
                        )}
                        {option.type && option.account_name && ' | '}
                        {option.account_name && (
                          <>
                            <span className="fw-medium">{t("Account")}  :</span> {option.account_name}
                            {option.account_number && ` - ${option.account_number}`}
                          </>
                        )}
                      </small>
                    )}
                  </div>
                )}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Col>

            <Col md={6} lg={3}>
              <Form.Label htmlFor="filter-plan-type">{t("Plan type")}</Form.Label>
              <Select
                id="filter-plan-type"
                value={selectedPlanType}
                onChange={handlePlanTypeChange}
                options={planTypeOptions}
                classNamePrefix="select"
                isSearchable={true}
                placeholder={t("Select plan type")}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Col>

            <Col md={6} lg={3}>
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

            <Col md={6} lg={3}>
              <Form.Label htmlFor="filter-expiration-date">
                {t("Expiration date range")}
              </Form.Label>
              <Flatpickr
                ref={expirationFlatpickrRef}
                className="form-control"
                id="filter-expiration-date"
                placeholder={t("Select expiration date range")}
                options={{
                  mode: "range",
                  dateFormat: "d/m/Y",
                  locale: getFlatpickrLocale(),
                }}
                value={
                  filters.expirationDateStart && filters.expirationDateEnd
                    ? [
                      new Date(filters.expirationDateStart),
                      new Date(filters.expirationDateEnd),
                    ]
                    : filters.expirationDateStart
                      ? [new Date(filters.expirationDateStart)]
                      : []
                }
                onChange={handleExpirationDateChange}
              />
            </Col>

            <Col md={6} lg={3}>
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

        {additionalButtons && (
          <div className="d-flex align-items-center gap-2">
            {additionalButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryFilter;
