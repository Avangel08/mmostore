import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Form, Button, Row, Col, FormControlProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";
import { confirmDialog } from "../../../utils/sweetAlert";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import moment from "moment";
import axios from "axios";

export const ModalAddPlan = ({
  show,
  onHide,
  userDataPlan,
}: {
  show: boolean;
  onHide: () => void;
  userDataPlan?: any;
}) => {
  const { t, i18n } = useTranslation();
  const { errors, storageUrl } = usePage().props as any;
  const flatpickrRef = useRef<any>(null);
  const [selectedPlanOption, setSelectedPlanOption] = useState<any>(null);
  const [selectedPaymentMethodOption, setSelectedPaymentMethodOption] = useState<any>(null);

  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const maxAmount = 999999999;

  const formik = useFormik({
    initialValues: {
      userId: userDataPlan?.id ?? "",
      planId: "",
      datetimeExpired: "",
      paymentMethodId: "",
      amount: "",
      note: "",
    },
    validationSchema: Yup.object({
      planId: Yup.string().required(t("Please select plan")),
      datetimeExpired: Yup.string()
        .required(t("Please select time"))
        .test(
          "is-after-now",
          t("Expiration time must be after current time"),
          function (value) {
            if (!value) return false;
            return moment(value).isAfter(moment());
          }
        ),
      paymentMethodId: Yup.string().required(t("Please select payment method")),
      amount: Yup.number()
        .min(0, t("Amount must be greater than or equal to 0"))
        .max(maxAmount, `Amount must be less than ${maxAmount}`)
        .required(t("Please enter amount")),
      note: Yup.string().max(10000, t("Maximum {{count}} characters", { count: 10000 })),
    }),
    onSubmit: async (values) => {
      const confirmed = await confirmDialog({
        title: t("Are you sure?"),
        text: t("Do you want to add this plan for the user?"),
        icon: "question",
        confirmButtonText: t("Yes, add plan"),
        cancelButtonText: t("Cancel"),
      });

      if (!confirmed) {
        return;
      }

      const url = route("admin.user.add-plan");

      router.post(url, values, {
        replace: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: (success: any) => {
          if (success.props?.message?.error) {
            return;
          }

          formik.resetForm();
          onHide();

        },
        onError: (err: any) => {
          Object.keys(err).forEach((key) => {
            showToast(t(err[key]), "error");
          });
        },
      });
    },
  });

  const loadPaymentMethodOptions = async (search: string, loadedOptions: any, { page }: any) => {
    try {
      const response = await axios.get(route("admin.payment-method.list-method", { search, page, includeAll: false }));

      const options = response?.data?.results ?? [];

      return {
        options,
        hasMore: response.data.has_more,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handlePlanChange = (selectedOption: any) => {
    setSelectedPlanOption(selectedOption);
    formik.setFieldValue("planId", selectedOption?.value ?? "");

    if (selectedOption) {
      formik.setFieldValue("amount", selectedOption.price ?? "");

      if (selectedOption.interval) {
        const futureDate = moment().add(selectedOption.interval, "days");
        formik.setFieldValue("datetimeExpired", futureDate.format("YYYY-MM-DD HH:mm"));
      }
    }
  };

  const handlePaymentMethodChange = (selectedOption: any) => {
    setSelectedPaymentMethodOption(selectedOption);
    formik.setFieldValue("paymentMethodId", selectedOption?.value ?? "");
  };

  const loadPlanOptions = async (search: string, loadedOptions: any, { page }: any) => {
    try {
      const response = await axios.get(route("admin.plans.list-plan", { search, page }));

      const options = response?.data?.results ?? [];

      return {
        options,
        hasMore: response.data.has_more,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  useEffect(() => {
    formik.setErrors(errors || {});
  }, [errors]);

  useEffect(() => {
    if (show) {
      setSelectedPlanOption(null);
      setSelectedPaymentMethodOption(null);
      formik.setValues({
        userId: userDataPlan?.id ?? "",
        planId: "",
        datetimeExpired: "",
        paymentMethodId: "",
        amount: "",
        note: "",
      });
      formik.setTouched({});
      formik.setErrors({});
    } else {
      formik.resetForm();
      setSelectedPlanOption(null);
      setSelectedPaymentMethodOption(null);
    }
  }, [show, userDataPlan]);


  return (
    <Modal
      id="modalAddPlan"
      backdrop={"static"}
      show={show}
      onHide={() => {
        formik.resetForm();
        onHide();
      }}
      centered
      size="lg"
      scrollable
      enforceFocus={false}
    >
      <Modal.Header closeButton>
        <h5>{t("Add plan for user")}</h5>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={formik.handleSubmit} noValidate>
          {/* User Information */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="userInfo">
                <Form.Label className="fw-semibold">{t("User information")}</Form.Label>
                <div className="p-3 bg-light rounded">
                  <Row>
                    {userDataPlan?.image && (
                      <Col md={2} className="text-center mb-2">
                        <img
                          src={`${storageUrl}/${userDataPlan.image}`}
                          alt="User avatar"
                          className="rounded-circle"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </Col>
                    )}
                    <Col md={userDataPlan?.image ? 10 : 12}>
                      <div><strong>{t("Name")}:</strong> {userDataPlan?.name}</div>
                      <div><strong>{t("Email")}:</strong> {userDataPlan?.email}</div>
                      {userDataPlan?.first_name && (
                        <div><strong>{t("First Name")}:</strong> {userDataPlan.first_name}</div>
                      )}
                      {userDataPlan?.phone && (
                        <div><strong>{t("Phone")}:</strong> {userDataPlan.phone_code ? `${userDataPlan.phone_code} ${userDataPlan.phone}` : userDataPlan.phone}</div>
                      )}
                      {userDataPlan?.organization && (
                        <div><strong>{t("Organization")}:</strong> {userDataPlan.organization}</div>
                      )}
                      <div>
                        <strong>{t("Status")}:</strong>
                        <span className={`badge ms-1 ${userDataPlan?.status === 1 ? 'bg-success' : 'bg-danger'}`}>
                          {userDataPlan?.status === 1 ? t("Active") : t("Inactive")}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Current Plan Information */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="currentPlan">
                <Form.Label className="fw-semibold">{t("Current plan information")}</Form.Label>
                <div className="p-3 bg-light rounded">
                  {userDataPlan?.current_plan ? (
                    <div className="d-flex flex-column gap-3">
                      <div><strong>{t("Plan")}:</strong> {userDataPlan.current_plan.name}</div>
                      <div>
                        <strong>{t("Time")}:</strong> {userDataPlan.current_plan.interval} {t("days")}
                      </div>
                      <div>
                        <strong>{t("Started On")}:</strong> {userDataPlan.current_plan.active_on ? moment(userDataPlan.current_plan.active_on).format("DD/MM/YYYY HH:mm") : t("N/A")}
                      </div>
                      <div>
                        <strong>{t("Expires On")}:</strong>
                        <span className={moment(userDataPlan.current_plan.expires_on).isBefore(moment()) ? "text-danger" : "text-success"}>
                          {" "}{userDataPlan.current_plan.expires_on ? moment(userDataPlan.current_plan.expires_on).format("DD/MM/YYYY HH:mm") : t("N/A")}
                        </span>
                      </div>
                      {userDataPlan.current_plan.expires_on && !moment(userDataPlan.current_plan.expires_on).isBefore(moment()) && (
                        <div>
                          <strong>{t("Time remaining")}:</strong>
                          <span className="text-success">
                            {" "}{(() => {
                              const now = moment();
                              const expiresOn = moment(userDataPlan.current_plan.expires_on);
                              const duration = moment.duration(expiresOn.diff(now));
                              
                              const days = Math.floor(duration.asDays());
                              const hours = duration.hours();
                              const minutes = duration.minutes();
                              
                              const parts = [];
                              if (days > 0) parts.push(`${days} ${t(`day${days !== 1 ? 's' : ''}`)}`);
                              if (hours > 0) parts.push(`${hours.toString().padStart(2, '0')} ${t(`hour${hours !== 1 ? 's' : ''}`)}`);
                              if (minutes > 0) parts.push(`${minutes.toString().padStart(2, '0')} ${t(`minute${minutes !== 1 ? 's' : ''}`)}`);
                              
                              return parts.length > 0 ? parts.join(' ') : `0 ${t("minute")}`;
                            })()}
                          </span>
                        </div>
                      )}
                      <div>
                        <strong>{t("Admin add this plan")}:</strong>
                        <span className={`badge ms-1 ${userDataPlan.current_plan.admin_set_expires_on === 'YES' ? 'bg-info' : 'bg-secondary'}`}>
                          {userDataPlan.current_plan.admin_set_expires_on === 'YES' ? t("Yes") : t("No")}
                        </span>
                      </div>
                      {userDataPlan.current_plan.description && (
                        <div><strong>{t("Description")}:</strong> <span dangerouslySetInnerHTML={{ __html: userDataPlan.current_plan.description }}></span></div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted">{t("No active plan")}</div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Select Plan */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="planId">
                <Form.Label>
                  {t("Select plan")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <AsyncPaginate
                  value={selectedPlanOption}
                  loadOptions={loadPlanOptions}
                  onChange={handlePlanChange}
                  onBlur={() => formik.setFieldTouched("planId", true)}
                  additional={{
                    page: 1,
                  }}
                  isClearable
                  clearCacheOnMenuClose
                  clearCacheOnSearchChange
                  placeholder={t("Select plan")}
                  classNamePrefix="select"
                  className={
                    (formik?.touched?.planId && formik?.errors?.planId)
                      ? "is-invalid"
                      : ""
                  }
                  formatOptionLabel={(option: any) => {
                    return (
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex flex-column">
                          <span className="fw-semibold">{option.label}</span>
                          <small className="text-muted">
                            {option.interval && (
                              <span>
                                <i className="ri-time-line me-1"></i>
                                {option.interval} {t("days")}
                              </span>
                            )}
                          </small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {option.price && (
                            <span className="badge bg-primary-subtle text-primary">
                              {new Intl.NumberFormat('vi-VN').format(option.price)} {t("VND")}
                            </span>
                          )}
                          {option.status === 0 && (
                            <span className="badge bg-warning">{t("Inactive")}</span>
                          )}
                        </div>
                      </div>
                    );
                  }}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
                {((formik?.touched?.planId && formik?.errors?.planId)) && (
                  <div className="invalid-feedback d-block">
                    {t(formik?.errors?.planId as string ?? "")}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Time */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="datetimeExpired">
                <Form.Label>
                  {t("Time expiration")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Flatpickr
                  name="datetimeExpired"
                  ref={flatpickrRef}
                  className={`form-control ${formik.touched.datetimeExpired && formik.errors.datetimeExpired ? "is-invalid" : ""
                    }`}
                  placeholder={t("Select date and time")}
                  options={{
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    time_24hr: true,
                    locale: getFlatpickrLocale(),
                    allowInput: true,
                  }}
                  value={formik.values.datetimeExpired}
                  onChange={(dates: any) => {
                    const formattedDate = dates[0] ? moment(dates[0]).format("YYYY-MM-DD HH:mm") : "";
                    formik.setFieldValue("datetimeExpired", formattedDate);
                    formik.setFieldTouched("datetimeExpired", true, false);
                    setTimeout(() => {
                      formik.validateField("datetimeExpired");
                    }, 0);
                  }}
                />
                {formik.touched.datetimeExpired && formik.errors.datetimeExpired && (
                  <div className="invalid-feedback d-block">
                    {t(formik.errors.datetimeExpired as string ?? "")}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Payment Method */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="paymentMethodId">
                <Form.Label>
                  {t("Payment method")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <AsyncPaginate
                  value={selectedPaymentMethodOption}
                  loadOptions={loadPaymentMethodOptions}
                  onChange={handlePaymentMethodChange}
                  onBlur={() => formik.setFieldTouched("paymentMethodId", true)}
                  additional={{
                    page: 1,
                  }}
                  clearCacheOnMenuClose
                  clearCacheOnSearchChange
                  isClearable
                  placeholder={t("Select payment method")}
                  classNamePrefix="select"
                  className={
                    (formik?.touched?.paymentMethodId && formik?.errors?.paymentMethodId)
                      ? "is-invalid"
                      : ""
                  }
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
                {((formik?.touched?.paymentMethodId && formik?.errors?.paymentMethodId)) && (
                  <div className="invalid-feedback d-block">
                    {t(formik?.errors?.paymentMethodId as string ?? "")}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Amount */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="amount">
                <Form.Label>
                  {t("Amount")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder={t("Enter amount")}
                  decimalScale={2}
                  fixedDecimalScale={false}
                  allowNegative={false}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue === undefined || floatValue <= maxAmount;
                  }}
                  onValueChange={(values) => {
                    formik.setFieldValue("amount", values.floatValue !== undefined ? values.floatValue : "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.amount}
                  isInvalid={
                    !!(
                      (formik.touched.amount && formik.errors.amount)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik?.errors?.amount as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Note */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="note">
                <Form.Label>{t("Note")}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={t("Enter note")}
                  name="note"
                  maxLength={500}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.note}
                  isInvalid={
                    !!(
                      (formik?.touched?.note && formik?.errors?.note)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik?.errors?.note as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="light"
          onClick={() => {
            formik.resetForm();
            onHide();
          }}
        >
          {t("Close")}
        </Button>
        <Button
          variant="primary"
          onClick={() => { formik.handleSubmit() }}
          disabled={formik.isSubmitting}
        >
          {t("Add plan")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
