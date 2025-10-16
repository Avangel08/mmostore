import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { router, usePage } from "@inertiajs/react";
import { showToast } from "../../../../../utils/showToast";
import { useEffect } from "react";

export default function TabPaneChangePassword() {
  const { t } = useTranslation();
  const errors = usePage().props.errors;

  const passwordFormik = useFormik({
    initialValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required(
        t("Please enter your current password")
      ),
      password: Yup.string()
        .min(8, t("Password must be at least 8 characters"))
        .required(t("Please enter your new password")),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], t("Passwords must match"))
        .required(t("Please confirm your password")),
    }),
    onSubmit: (values) => {
      router.put(route("buyer.profile.change-password"), values, {
        onSuccess: (success: any) => {
          if (success.props?.message?.error) {
            showToast(t(success.props.message.error), "error");
            return;
          }
          passwordFormik.resetForm();
          if (success.props?.message?.success) {
            showToast(t(success.props.message.success), "success");
          }
        },
      });
    },
  });

  useEffect(() => {
    passwordFormik.setErrors(errors || {});
  }, [errors]);
  
  return (
    <Tab.Pane eventKey="change-password">
      <Form onSubmit={passwordFormik.handleSubmit} noValidate>
        <Row>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Group as={Row} controlId="current_password">
                <Form.Label column lg={3} className="fw-semibold">
                  {t("Old Password")}<span className="text-danger">*</span> :
                </Form.Label>
                <Col lg={9}>
                  <Form.Control
                    type="password"
                    className="form-control"
                    placeholder={t("Enter current password")}
                    value={passwordFormik.values.current_password}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    isInvalid={
                      !!(
                        passwordFormik.touched.current_password &&
                        passwordFormik.errors.current_password
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {t(passwordFormik.errors.current_password ?? "")}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Group as={Row} controlId="password">
                <Form.Label column lg={3} className="fw-semibold">
                  {t("New Password")}<span className="text-danger">*</span> :
                </Form.Label>
                <Col lg={9}>
                  <Form.Control
                    type="password"
                    className="form-control"
                    placeholder={t("Enter new password")}
                    value={passwordFormik.values.password}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    isInvalid={
                      !!(
                        passwordFormik.touched.password &&
                        passwordFormik.errors.password
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {t(passwordFormik.errors.password ?? "")}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <Form.Group as={Row} controlId="password_confirmation">
                <Form.Label column lg={3} className="fw-semibold">
                  {t("Confirm Password")}<span className="text-danger">*</span> :
                </Form.Label>
                <Col lg={9}>
                  <Form.Control
                    type="password"
                    className="form-control"
                    placeholder={t("Confirm password")}
                    value={passwordFormik.values.password_confirmation}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    isInvalid={
                      !!(
                        passwordFormik.touched.password_confirmation &&
                        passwordFormik.errors.password_confirmation
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {t(passwordFormik.errors.password_confirmation ?? "")}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </div>
          </Col>

          <Col lg={12}>
            <div className="hstack gap-2 justify-content-end">
              <Button type="submit" variant="success">
                {t("Change Password")}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Tab.Pane>
  );
}