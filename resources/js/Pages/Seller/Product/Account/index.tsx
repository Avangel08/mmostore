import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showToast } from "../../../../utils/showToast";
import Layout from "../../../../CustomSellerLayouts";
import RecentUpload from "./RecentUpload";
import SellingProduct from "./SellingProduct";

const SellerAccount = () => {
  const { t } = useTranslation();
  const errors = usePage().props.errors as any;
  const { subProduct } = usePage().props as any;
  const [loading, setLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState<'file' | 'textarea'>('file');

  const canImport = subProduct?.product?.category && subProduct?.product?.product_type;

  const formik = useFormik({
    initialValues: {
      file: null as File | null,
      content: "",
    },
    validationSchema: Yup.object().shape({
      file: inputMethod === 'file'
        ? Yup.mixed()
          .required(t("Please select a file to upload"))
          .test('fileType', t('Only .txt files are allowed'), (value: any) => {
            if (!value) return false;
            return value.name.toLowerCase().endsWith('.txt');
          })
          .test('fileSize', t('The file must not be greater than 50MB'), (value: any) => {
            if (!value) return false;
            return value.size <= 50 * 1024 * 1024; // 50MB
          })
        : Yup.mixed().nullable(),
      content: inputMethod === 'textarea'
        ? Yup.string()
          .required(t("Please enter content"))
          .test('contentNotEmpty', t("Please enter content"), (value) => {
            return !!value && value.trim().length > 0;
          })
        : Yup.string().nullable(),
    }),
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("sub_product_id", subProduct?.id || "");
      formData.append("product_id", subProduct?.product_id || "");
      formData.append("input_method", inputMethod);

      if (inputMethod === 'file' && values.file) {
        formData.append("file", values.file);
      } else if (inputMethod === 'textarea' && values.content) {
        formData.append("content", values.content);
      }

      router.post(route("seller.account.store"), formData, {
        preserveScroll: true,
        onSuccess: (success: any) => {
          if (success.props?.message?.error) {
            showToast(t(success.props.message.error), "error");
            return;
          }

          if (success.props?.message?.success) {
            showToast(t(success.props.message.success), "success");
          }

          formik.resetForm();
          if (inputMethod === 'file') {
            const fileInput = document.querySelector(
              'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) {
              fileInput.value = "";
            }
          }
        },
        onError: (errors: any) => {
          Object.keys(errors).forEach((key) => {
            showToast(t(errors[key]), "error");
          });
        },
        onFinish: () => setLoading(false),
      });
    },
  });

  useEffect(() => {
    formik.validateForm();
  }, [inputMethod]);
  return (
    <React.Fragment>
      <Head title={t("Resource")} />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="text-black">{t("Product")}: {t(subProduct?.product?.name || "N/A")}</h5>
                  <h6>{t("Variant")}: {t(subProduct?.name || "N/A")}</h6>
                </Card.Header>
                <Card.Body>
                  {(!subProduct?.product?.category || !subProduct?.product?.product_type) && (
                    <Row style={{ marginBottom: "32px" }}>
                      <Col xs={12}>
                        <Card bg="warning" text="dark" className="border-warning">
                          <Card.Body>
                            <div className="d-flex align-items-center gap-5">
                              <div>
                                <h6 className="mb-2">
                                  <i className="ri-alert-line me-2"></i>
                                  {t("Product Configuration Required")}
                                </h6>
                                <div className="mb-1">
                                  {!subProduct?.product?.category && !subProduct?.product?.product_type && (
                                    <span>{t("Category and Product Type are not defined for this product")}</span>
                                  )}
                                  {!subProduct?.product?.category && subProduct?.product?.product_type && (
                                    <span>{t("Category is not defined for this product")}</span>
                                  )}
                                  {subProduct?.product?.category && !subProduct?.product?.product_type && (
                                    <span>{t("Product Type is not defined for this product")}</span>
                                  )}
                                </div>
                                <small className="text-muted">
                                  {t("Please configure the missing information to ensure proper product management")}
                                </small>
                              </div>
                              <div>
                                <Button
                                  variant="dark"
                                  size="sm"
                                  onClick={() => {
                                    window.open(
                                      route("seller.product.edit", { id: subProduct?.product_id }),
                                      "_blank"
                                    );
                                  }}
                                >
                                  <i className="ri-edit-line me-1"></i>
                                  {t("Edit Product")}
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  )}

                  <Row style={{ marginBottom: "32px" }}>
                    <Col lg={6}>
                      {!canImport && (
                        <Card bg="danger" text="white" className="mb-3 border-danger">
                          <Card.Body>
                            <h6 className="mb-2">
                              <i className="ri-error-warning-line me-2"></i>
                              {t("Import Disabled")}
                            </h6>
                            <p className="mb-0">
                              {t("You cannot import accounts until the product category and product type are configured.")} <a
                                href={route("seller.product.edit", { id: subProduct?.product_id })}
                                className="text-white text-decoration-underline"
                                target="_blank"
                              >
                                {t("Please edit the product first.")}
                              </a>
                            </p>
                          </Card.Body>
                        </Card>
                      )}
                      <Form onSubmit={formik.handleSubmit} noValidate>
                        {/* Input Method Selection */}
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-bold">
                            {t("Input method")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="d-flex gap-4 mt-2">
                            <Form.Check
                              type="radio"
                              id="method-file"
                              name="inputMethod"
                              label={t("Upload file")}
                              checked={inputMethod === 'file'}
                              onChange={() => {
                                setInputMethod('file');
                                formik.setFieldValue("content", "");
                                formik.setFieldValue("file", null);
                                formik.setFieldError("content", "");
                                formik.setFieldError("file", "");
                                formik.setFieldTouched("content", false);
                                formik.setFieldTouched("file", false);
                              }}
                              disabled={!canImport}
                            />
                            <Form.Check
                              type="radio"
                              id="method-textarea"
                              name="inputMethod"
                              label={t("Input list")}
                              checked={inputMethod === 'textarea'}
                              onChange={() => {
                                setInputMethod('textarea');
                                formik.setFieldValue("file", null);
                                formik.setFieldValue("content", "");
                                formik.setFieldError("file", "");
                                formik.setFieldError("content", "");
                                formik.setFieldTouched("file", false);
                                formik.setFieldTouched("content", false);
                              }}
                              disabled={!canImport}
                            />
                          </div>
                        </Form.Group>

                        {/* File Upload Input */}
                        {inputMethod === 'file' && (
                          <Form.Group className="mb-3">
                            <Form.Label>
                              {t("Upload .txt file")}{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="file"
                              name="file"
                              accept=".txt"
                              disabled={!canImport}
                              onChange={(e: any) => {
                                const file = e.target.files?.[0] || null;
                                formik.setFieldValue("file", file);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  (formik.touched.file && formik.errors.file) ||
                                  errors?.file
                                )
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {t(formik.errors.file || errors?.file)}
                            </Form.Control.Feedback>
                            {!canImport && (
                              <Form.Text className="text-muted">
                                {t("File upload is disabled until product configuration is complete")}
                              </Form.Text>
                            )}
                          </Form.Group>
                        )}

                        {/* Textarea Input */}
                        {inputMethod === 'textarea' && (
                          <Form.Group className="mb-3">
                            <Form.Label>
                              {t("Content")}{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={8}
                              placeholder={
                                t("Enter content here (each line will be 1 resource)") + "\n\n" +
                                t("Example") + ":\njohn1@example.com|mypass123|2fa_code\njohn2@example.com|mypass123|2fa_code\njohn3@example.com|mypass123|2fa_code"
                              }
                              name="content"
                              disabled={!canImport}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.content}
                              isInvalid={
                                !!(
                                  (formik.touched.content && formik.errors.content) ||
                                  errors?.content
                                )
                              }
                              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {t(formik.errors.content || errors?.content)}
                            </Form.Control.Feedback>
                            {!canImport && (
                              <Form.Text className="text-muted">
                                {t("Text input is disabled until product configuration is complete")}
                              </Form.Text>
                            )}
                          </Form.Group>
                        )}
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={loading || !canImport}
                        >
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              {inputMethod === 'file' ? t("Uploading") : t("Processing")}...
                            </>
                          ) : (
                            inputMethod === 'file' ? t("Upload") : t("Submit")
                          )}
                        </Button>
                      </Form>
                    </Col>
                    <Col lg={6}>
                      <Card bg="light" className="mb-3">
                        <Card.Body>
                          <h5>
                            {t("Instructions")}
                          </h5>

                          <div className="mb-3">
                            <strong>{t("Format")}:</strong>
                            <div className="ms-2">
                              • <code className="fs-6">data1|data2|...</code><br />
                              <small className="text-muted">{t("or")}</small><br />
                              • <code className="fs-6">status:STATUS|data1|data2|...</code>
                            </div>
                          </div>

                          <div className="mb-3">
                            <small>
                              <strong>{t("Note")}:</strong> {t("Each line will be 1 resource")}.<br />
                              {t("Define status after 'status:' keyword")}. {t("If no status specified, default status is LIVE")}.
                              <br />
                              <strong>{t("LIVE means the resource is ready for sale")}</strong>.
                            </small>
                          </div>

                          <div className="mb-3">
                            <strong>{t("Examples")}:</strong>
                          </div>

                          <div className="mb-2">
                            <div className="font-monospace small bg-white p-2 rounded border-start border-info border-3">
                              john@example.com|mypass123|2fa_code
                            </div>
                            <div className="small text-info mt-1 ms-2">
                              <i className="ri-arrow-up-line me-1"></i>
                              {t("Account without status: prefix")} - <em>{t("default status is LIVE")}</em>
                            </div>
                          </div>

                          <div className="mb-2">
                            <div className="font-monospace small bg-white p-2 rounded border-start border-success border-3">
                              status:LIVE|username123|password456|2fa_code
                            </div>
                            <div className="small text-success mt-1 ms-2">
                              <i className="ri-arrow-up-line me-1"></i>
                              {t("Account with LIVE status (ready for sale)")}
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="font-monospace small bg-white p-2 rounded border-start border-danger border-3">
                              status:Ban|@username|pass789|verified
                            </div>
                            <div className="small text-danger mt-1 ms-2">
                              <i className="ri-arrow-up-line me-1"></i>
                              {t("Account with non LIVE status (non LIVE status not available for sale)")}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="my-5">
                    <RecentUpload />
                  </Row>
                  <hr />
                  <Row className="my-5">
                    <SellingProduct />
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

SellerAccount.layout = (page: any) => <Layout children={page} />;
export default SellerAccount;
