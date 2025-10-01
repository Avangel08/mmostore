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

  const formik = useFormik({
    initialValues: {
      file: null as File | null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required(t("Please select a file to upload"))
        .test('fileType', t('Only .txt files are allowed'), (value: any) => {
          if (!value) return true;
          return value.name.toLowerCase().endsWith('.txt');
        })
        .test('fileSize', t('The file must not be greater than 50MB'), (value: any) => {
          if (!value) return true;
          return value.size <= 50 * 1024 * 1024; // 50MB
        }),
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
                            {t("Upload .txt file")}{" "}
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
                              {t("Uploading")}...
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
                            {t("Note: Each line in the uploaded file will be 1 product")}
                          </h5>
                          <div className="mb-3">
                            <strong>{t("Format")}:</strong> 
                            <div className="ms-2">
                              • <code>key|data1|data2|...</code><br/>
                              • <code>status:STATUS|key|data1|data2|...</code>
                            </div>
                          </div>
                          <div className="mb-3">
                            <small>
                              {t("Define status after 'status:' keyword")}. {t("If no status specified, default status is LIVE")}.
                              <br />
                              <strong>{t("LIVE means the product is ready for sale")}</strong>.
                            </small>
                          </div>
                          <div className="mb-1">
                            <strong>{t("Examples")}:</strong>
                          </div>
                          <div className="font-monospace small bg-white p-2 rounded">
                            status:LIVE|gameacc01|username123|password456|2fa_code
                            <br />
                            email001|john@example.com|mypass123|2fa_code ({t("default status is LIVE")})
                            <br />
                            status:Ban|social01|@username|pass789|verified ({t("status is BAN")})
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
