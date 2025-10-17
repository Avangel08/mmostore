import React, { useEffect, useState } from "react";
import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { router, usePage } from "@inertiajs/react";
import { showToast } from "../../../../../utils/showToast";
import moment from "moment";

export default function TabPaneChangeInformation() {
  const { t } = useTranslation();
  const user = usePage().props.auth.user as any;
  const errors = usePage().props.errors as any;
  const [purchasedCount, setPurchasedCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      router.reload({
        replace: true,
        only: ['purchasedCount'],
        onSuccess: (page: any) => {
          setPurchasedCount(page?.props?.purchasedCount || 0);
        }
      })
    }, 500);

    return () => clearTimeout(fetchTimeout);
  }, []);

  const personalInfoFormik = useFormik({
    initialValues: {
      first_name: user?.first_name || user?.name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .min(2, t("Must be at least 2 characters"))
        .max(50, t("Must be 50 characters or less"))
        .required(t("Please enter your first name")),
      last_name: Yup.string()
        .min(2, t("Must be at least 2 characters"))
        .max(50, t("Must be 50 characters or less")),
      email: Yup.string()
        .email(t("Invalid email address"))
        .required(t("Please enter your email")),
    }),
    onSubmit: (values) => {
      router.put(route("buyer.profile.update-info"), values, {
        onSuccess: (success: any) => {
          if (success.props?.message?.error) {
            showToast(t(success.props.message.error), "error");
            return;
          }
          if (success.props?.message?.success) {
            showToast(t(success.props.message.success), "success");
          }
          personalInfoFormik.resetForm({ values });
        },
      });
    },
  });

  useEffect(() => {
    personalInfoFormik.setErrors(errors || {});
  }, [errors]);

  return (
    <Tab.Pane eventKey="personal-info">
      <Form onSubmit={personalInfoFormik.handleSubmit} noValidate>
        <Row>
          <Col lg={12} className="mb-3">
            <div className="mb-3">
              <div>
                <span className="fw-semibold">Email:</span>{" "}
                {personalInfoFormik.values.email}
              </div>
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Group as={Row} controlId="first_name">
                <Form.Label column lg={3} className="fw-semibold">
                  {t("First Name")}<span className="text-danger">*</span> :
                </Form.Label>
                <Col lg={9}>
                  <Form.Control
                    type="text"
                    className="form-control"
                    placeholder={t("Enter your first name")}
                    value={personalInfoFormik.values.first_name}
                    onChange={personalInfoFormik.handleChange}
                    onBlur={personalInfoFormik.handleBlur}
                    isInvalid={
                      !!(
                        personalInfoFormik.touched.first_name &&
                        personalInfoFormik.errors.first_name
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {personalInfoFormik?.errors?.first_name ?? ""}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Group as={Row} controlId="last_name">
                <Form.Label column lg={3} className="fw-semibold">
                  {t("Last Name")}:
                </Form.Label>
                <Col lg={9}>
                  <Form.Control
                    type="text"
                    className="form-control"
                    placeholder={t("Enter your last name")}
                    value={personalInfoFormik.values.last_name}
                    onChange={personalInfoFormik.handleChange}
                    onBlur={personalInfoFormik.handleBlur}
                    isInvalid={
                      !!(
                        personalInfoFormik.touched.last_name &&
                        personalInfoFormik.errors.last_name
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {personalInfoFormik?.errors?.last_name ?? ""}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Group as={Row}>
                <Form.Label column lg={3} className="fw-semibold">
                  {t("Registration date")}:
                </Form.Label>
                <Col lg={9}>
                  <div className="form-control-plaintext">
                    {moment(user?.created_at).format("DD/MM/YYYY HH:mm")}
                  </div>
                </Col>
              </Form.Group>
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Group as={Row}>
                <Form.Label column lg={3} className="fw-semibold">
                  {t("Purchased")}:
                </Form.Label>
                <Col lg={9}>
                  <div className="form-control-plaintext">
                    {purchasedCount == null ? t('Loading') + "..." : `${purchasedCount} ${t('products')}`}
                  </div>
                </Col>
              </Form.Group>
            </div>
          </Col>

          <Col lg={12}>
            <div className="hstack gap-2 justify-content-end">
              <Button type="submit" variant="primary">
                {t("Update")}
              </Button>
              <Button
                type="button"
                variant="soft-success"
                onClick={() => personalInfoFormik.resetForm()}
              >
                {t("Cancel")}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Tab.Pane>
  );
}