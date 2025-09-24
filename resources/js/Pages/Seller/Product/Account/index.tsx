import { Head, router, usePage } from "@inertiajs/react";
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
import TableRecentUpload from "./TableRecentUpload";
import TableSellingProduct from "./TableSellingProduct";

const SellerAccount = () => {
  const { t } = useTranslation();
  const errors = usePage().props.errors as any;
  const { subProduct } = usePage().props as any;
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      file: null as File | null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required(t("Please select a file to upload")),
    }),
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("sub_product_id", subProduct?.id || "");
      formData.append("product_id", subProduct?.product_id || "");
      if (values.file) {
        formData.append("file", values.file);
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
          const fileInput = document.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = "";
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

  return (
    <React.Fragment>
      <Head title={t("Account")} />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">{t("Account")}</h5>
                </Card.Header>
                <Card.Body>
                  <Row style={{ marginBottom: "32px" }}>
                    <Col lg={6}>
                      <Form onSubmit={formik.handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("Upload file")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="file"
                            name="file"
                            accept=".txt"
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
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={loading}
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
                              {t("Uploading...")}
                            </>
                          ) : (
                            t("Upload")
                          )}
                        </Button>
                      </Form>
                    </Col>
                    <Col lg={6}>
                      <Card bg="light" className="mb-3">
                        <Card.Body>
                          <h5>
                            {t(
                              "Note: Each line in the uploaded file will be 1 product"
                            )}
                          </h5>
                          <div className="mb-2">
                            <strong>{t("Format")}:</strong> key|data1|data2|...
                          </div>
                          <div className="mb-2">
                            <strong>{t("Example")}:</strong>
                          </div>
                          <div className="font-monospace small bg-white p-2 rounded">
                            email|abc@gmail.com|password123|2fa
                            <br />
                            another_key|some_data|more_info
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="my-5">
                    <Col lg={12} className="mb-4">
                      <h5>{t("Recent uploaded files")}</h5>
                    </Col>
                    <Col lg={12}>
                      <TableRecentUpload />
                    </Col>
                  </Row>
                  <hr />
                  <Row className="my-5">
                    <Col
                      lg={12}
                      className="d-flex justify-content-between mb-4"
                    >
                      <h5>{t("Products for sale")}</h5>
                      <div className="d-flex gap-2">
                        <Button variant="danger">{t("Delete all")}</Button>
                        <Button variant="success">
                          {t("Download unsold products")}
                        </Button>
                      </div>
                    </Col>
                    <Col lg={12} className="px-4">
                      <TableSellingProduct />
                    </Col>
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
