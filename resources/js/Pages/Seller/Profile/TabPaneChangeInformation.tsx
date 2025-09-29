import React, { useEffect } from "react";
import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { router, usePage } from "@inertiajs/react";
import { showToast } from "../../../utils/showToast";

export default function TabPaneChangeInformation() {
  const { t } = useTranslation();
  const user = usePage().props.auth.user as any;
  const errors = usePage().props.errors as any;

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
      router.put(route("seller.profile.update-info"), values, {
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
          <Col lg={6}>
            <div className="mb-3">
              <Form.Group controlId="first_name">
                <Form.Label>
                  {t("First Name")} <span className="text-danger">*</span>
                </Form.Label>
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
              </Form.Group>
            </div>
          </Col>
          <Col lg={6}>
            <div className="mb-3">
              <Form.Group controlId="last_name">
                <Form.Label>
                  {t("Last Name")}
                </Form.Label>
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
