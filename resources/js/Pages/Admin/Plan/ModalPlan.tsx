import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Modal, Form, Button, Row, Col, FormControlProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";
import CustomCKEditor from "../../../Components/CustomCKEditor";

export const ModalPlan = ({
  show,
  onHide,
  dataEdit,
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
}) => {
  const { t } = useTranslation();
  const isEditMode = !!dataEdit;
  const { errors, statusConst, typeConst } = usePage().props as any;

  const maxPrice = 999999999;
  const maxSale = 100;
  const maxIntervalDay = 999999999;
  const maxIntervalMonth = 999999999;

  const typeOptions = Object.entries(typeConst || {}).map(([key, value]) => ({
    value: (key as string ?? "")?.toString(),
    label: value,
  }));

  const statusOptions = Object.entries(statusConst || {}).map(([key, value]) => ({
    value: (key as string ?? "")?.toString(),
    label: t(value as string ?? ""),
  }));

  const formik = useFormik({
    initialValues: {
      planName: dataEdit?.name ?? "",
      type: dataEdit?.type?.toString() ?? "1",
      price: dataEdit?.price ?? "",
      priceOrigin: dataEdit?.price_origin ?? "",
      sale: dataEdit?.off ?? "",
      intervalDay: dataEdit?.interval ?? "",
      intervalMonth: dataEdit?.interval_type ?? "",
      status: dataEdit?.type?.toString() === "0" ? "1" : (dataEdit?.status?.toString() ?? "1"),
      bestChoice: dataEdit?.best_choice === 1 || dataEdit?.best_choice === "1",
      showPublic: dataEdit?.show_public === 1 || dataEdit?.show_public === "1",
      shortDescription: dataEdit?.sub_description ?? "",
      description: dataEdit?.description ?? "",
    },
    validationSchema: Yup.object({
      planName: Yup.string()
        .max(255, t("Must be 255 characters or less"))
        .required(t("Please enter plan name")),
      type: Yup.string().required(t("Please select type")),
      price: Yup.number()
        .min(0, t("Price must be greater than or equal to 0"))
        .max(maxPrice, `Price must be less than ${maxPrice}`)
        .required(t("Please enter price")),
      priceOrigin: Yup.number()
        .min(0, t("Fixed price must be greater than or equal to 0"))
        .max(maxPrice, `Fixed price must be less than ${maxPrice}`)
        .required(t("Please enter fixed price")),
      sale: Yup.number()
        .min(0, t("Sale must be greater than or equal to 0"))
        .max(maxSale, `Sale must be less than or equal to ${maxSale}`),
      intervalDay: Yup.number()
        .min(0, t("Interval day must be greater than or equal to 0"))
        .max(maxIntervalDay, `Interval day must be less than ${maxIntervalDay}`)
        .required(t("Please enter interval days")),
      intervalMonth: Yup.number()
        .min(0, t("Interval month must be greater than or equal to 0"))
        .max(maxIntervalMonth, `Interval month must be less than or equal to ${maxIntervalMonth}`)
        .required(t("Please enter interval months")),
      status: Yup.string().required(t("Please select status")),
      bestChoice: Yup.boolean(),
      showPublic: Yup.boolean(),
      shortDescription: Yup.string()
        .max(500, t("Must be 500 characters or less")),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      const url = isEditMode
        ? route("admin.plans.update", { id: dataEdit.id })
        : route("admin.plans.store");

      const method = isEditMode ? "put" : "post";

      router[method](url, values, {
        replace: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: (success: any) => {
          if (success.props?.message?.error) {
            showToast(t(success.props.message.error), "error");
            return;
          }
          formik.resetForm();
          onHide();

          if (success.props?.message?.success) {
            showToast(t(success.props.message.success), "success");
          }
        },
        onError: (err: any) => {
          Object.keys(err).forEach((key) => {
            showToast(t(err[key]), "error");
          });
        },
      });
    },
  });

  const isDefaultType = formik.values.type === "0";
  const isEditingDefaultType = isEditMode && dataEdit?.type?.toString() === "0";

  useEffect(() => {
    if (formik.values.type === "0") {
      formik.setFieldValue("status", "1");
    }
  }, [formik.values.type]);

  useEffect(() => {
    formik.setErrors(errors || {});
  }, [errors]);

  useEffect(() => {
    if (show) {
      formik.setValues({
        planName: dataEdit?.name ?? "",
        type: dataEdit?.type?.toString() ?? "1",
        price: dataEdit?.price ?? "",
        priceOrigin: dataEdit?.price_origin ?? "",
        sale: dataEdit?.off ?? "",
        intervalDay: dataEdit?.interval ?? "",
        intervalMonth: dataEdit?.interval_type ?? "",
        status: dataEdit?.type?.toString() === "0" ? "1" : (dataEdit?.status?.toString() ?? "1"),
        bestChoice: dataEdit?.best_choice === 1 || dataEdit?.best_choice === "1",
        showPublic: dataEdit?.show_public === 1 || dataEdit?.show_public === "1",
        shortDescription: dataEdit?.sub_description ?? "",
        description: dataEdit?.description ?? "",
      });

      formik.setTouched({});
      formik.setErrors({});
    } else {
      formik.resetForm();
    }
  }, [show, dataEdit]);

  const selectedTypeOption = typeOptions?.find(
    (option: any) => option?.value === formik.values.type
  ) ?? null;

  const selectedStatusOption = statusOptions?.find(
    (option: any) => option?.value === formik.values.status
  ) ?? null;

  return (
    <Modal
      id="myModal"
      backdrop={"static"}
      show={show}
      onHide={() => {
        formik.resetForm();
        onHide();
      }}
      centered
      size="xl"
      scrollable
    >
      <Modal.Header closeButton>
        <h5>{isEditMode ? t("Edit plan") : t("Add plan")}</h5>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="planName">
                <Form.Label>
                  {t("Plan name")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter plan name")}
                  name="planName"
                  maxLength={255}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.planName}
                  isInvalid={
                    !!(
                      (formik?.touched?.planName && formik?.errors?.planName)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik?.errors?.planName as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="type">
                <Form.Label>
                  {t("Type")}
                  <span className="text-danger">*</span>
                </Form.Label>
                {isEditingDefaultType ? (
                  <Form.Control
                    type="text"
                    value={t("Default")}
                    disabled
                    className="form-control"
                  />
                ) : (
                  <Select
                    options={typeOptions}
                    placeholder={t("Select type")}
                    value={selectedTypeOption}
                    onMenuOpen={() => {
                      router.reload({ only: ["typeConst"], replace: true });
                    }}
                    onChange={(selectedOption: any) => {
                      formik.setFieldValue("type", selectedOption?.value ?? "");
                    }}
                    onBlur={() => formik.setFieldTouched("type", true)}
                    className={
                      (formik?.touched?.type && formik?.errors?.type) 
                        ? "is-invalid"
                        : ""
                    }
                  />
                )}
                {((formik?.touched?.type && formik?.errors?.type) ) && (
                  <div className="invalid-feedback d-block">
                    {t(formik?.errors?.type as string ?? "")}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="price">
                <Form.Label>
                  {t("Price")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder={t("Enter price (after the promotion)")}
                  decimalScale={2}
                  fixedDecimalScale={false}
                  allowNegative={false}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue === undefined || floatValue <= maxPrice;
                  }}
                  onValueChange={(values) => {
                    formik.setFieldValue("price", values.floatValue !== undefined ? values.floatValue : "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                  isInvalid={
                    !!(
                      (formik.touched.price && formik.errors.price)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik?.errors?.price as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="priceOrigin">
                <Form.Label>
                  {t("Fixed price")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder={t("Enter fixed price (before the promotion)")}
                  decimalScale={2}
                  fixedDecimalScale={false}
                  allowNegative={false}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue === undefined || floatValue <= maxPrice;
                  }}
                  onValueChange={(values) => {
                    formik.setFieldValue("priceOrigin", values.floatValue !== undefined ? values.floatValue : "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.priceOrigin}
                  isInvalid={
                    !!(
                      (formik?.touched?.priceOrigin && formik?.errors?.priceOrigin)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik?.errors?.priceOrigin as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="sale">
                <Form.Label>{t("Sale %")}</Form.Label>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  placeholder={t("Enter % sale")}
                  decimalScale={0}
                  fixedDecimalScale={false}
                  allowNegative={false}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue === undefined || (floatValue >= 0 && floatValue <= maxSale);
                  }}
                  onValueChange={(values) => {
                    formik.setFieldValue("sale", values.floatValue ?? "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.sale}
                  isInvalid={
                    !!(
                      (formik?.touched?.sale && formik?.errors?.sale)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik?.errors?.sale as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="intervalDay">
                <Form.Label>
                  {t("Plan time (day)")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  placeholder={t("Enter interval days")}
                  allowNegative={false}
                  decimalScale={0}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue === undefined || (floatValue >= 0 && floatValue <= maxIntervalDay);
                  }}
                  onValueChange={(values) => {
                    formik.setFieldValue("intervalDay", values.floatValue ?? "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.intervalDay}
                  isInvalid={
                    !!(
                      (formik?.touched?.intervalDay && formik?.errors?.intervalDay)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik.errors.intervalDay as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="intervalMonth">
                <Form.Label>
                  {t("Plan time (month)")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <NumericFormat
                  customInput={Form.Control as React.ComponentType<FormControlProps>}
                  placeholder={t("Enter interval months")}
                  allowNegative={false}
                  decimalScale={0}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue === undefined || (floatValue >= 0 && floatValue <= maxIntervalMonth);
                  }}
                  onValueChange={(values) => {
                    formik.setFieldValue("intervalMonth", values.floatValue ?? "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.intervalMonth}
                  isInvalid={
                    !!(
                      (formik?.touched?.intervalMonth && formik?.errors?.intervalMonth)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik.errors.intervalMonth as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label>
                  {t("Status")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  options={statusOptions}
                  placeholder={t("Select status")}
                  value={selectedStatusOption}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue("status", selectedOption?.value ?? "");
                  }}
                  onBlur={() => formik.setFieldTouched("status", true)}
                  isDisabled={isDefaultType}
                  className={
                    (formik?.touched?.status && formik?.errors?.status)
                      ? "is-invalid"
                      : ""
                  }
                />
                {((formik?.touched?.status && formik?.errors?.status)) && (
                  <div className="invalid-feedback d-block">
                    {t(formik?.errors?.status as string ?? "")}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={3} style={{ marginTop: '32px' }}>
              <Form.Group controlId="bestChoice">
                <div className="form-check form-switch form-switch-md mb-3">
                  <Form.Check.Input
                    type="checkbox"
                    className="form-check-input"
                    id="bestChoice"
                    name="bestChoice"
                    checked={formik.values.bestChoice}
                    onChange={(e) => {
                      formik.setFieldValue("bestChoice", e.target.checked);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <Form.Check.Label className="form-check-label" htmlFor="bestChoice">
                    {t("Best choice")}
                  </Form.Check.Label>
                </div>
              </Form.Group>
            </Col>
            <Col md={3} style={{ marginTop: '32px' }}>
              <Form.Group controlId="showPublic">
                <div className="form-check form-switch form-switch-md mb-3">
                  <Form.Check.Input
                    type="checkbox"
                    className="form-check-input"
                    id="showPublic"
                    name="showPublic"
                    checked={formik.values.showPublic}
                    onChange={(e) => {
                      formik.setFieldValue("showPublic", e.target.checked);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <Form.Check.Label className="form-check-label" htmlFor="showPublic">
                    {t("Show public")}
                  </Form.Check.Label>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="shortDescription">
                <Form.Label>
                  {t("Short description")}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={t("Enter short description")}
                  name="shortDescription"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.shortDescription}
                  isInvalid={
                    !!(
                      (formik?.touched?.shortDescription && formik?.errors?.shortDescription)
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik?.errors?.shortDescription as string ?? "")}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="description">
                <Form.Label>
                  {t("Plan description")}
                </Form.Label>
                <CustomCKEditor
                  data={formik.values.description}
                  onChange={(data: string) => {
                    formik.setFieldValue("description", data);
                  }}
                  onBlur={() => formik.setFieldTouched("description", true)}
                  placeholder={t("Enter plan description")}
                />
                {((formik?.touched?.description && formik?.errors?.description)) && (
                  <div className="invalid-feedback d-block">
                    {t(formik?.errors?.description as string ?? "")}
                  </div>
                )}
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
          {isEditMode ? t("Update") : t("Save changes")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};