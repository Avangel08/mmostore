import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { router, usePage } from "@inertiajs/react";
export default function TabPaneChangePassword({
  showToast,
}: {
  showToast: (message: string, type: "success" | "error") => void;
}) {
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
      router.put(route("seller.profile.change-password"), values, {
        onSuccess: (success) => {
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
  return (
    <Tab.Pane eventKey="change-password">
      <Form onSubmit={passwordFormik.handleSubmit} noValidate>
        <Row className="g-2">
          <Col lg={4}>
            <div>
              <Form.Label htmlFor="current_password" className="form-label">
                {t("Old Password")} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                id="current_password"
                name="current_password"
                placeholder={t("Enter current password")}
                value={passwordFormik.values.current_password}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                isInvalid={
                  !!(
                    (passwordFormik.touched.current_password &&
                      passwordFormik.errors.current_password) ||
                    errors?.current_password
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.current_password ||
                  errors?.current_password}
              </Form.Control.Feedback>
            </div>
          </Col>

          <Col lg={4}>
            <div>
              <Form.Label htmlFor="password" className="form-label">
                {t("New Password")} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder={t("Enter new password")}
                value={passwordFormik.values.password}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                isInvalid={
                  !!(
                    (passwordFormik.touched.password &&
                      passwordFormik.errors.password) ||
                    errors?.password
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.password || errors?.password}
              </Form.Control.Feedback>
            </div>
          </Col>

          <Col lg={4}>
            <div>
              <Form.Label
                htmlFor="password_confirmation"
                className="form-label"
              >
                {t("Confirm Password")} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                id="password_confirmation"
                name="password_confirmation"
                placeholder={t("Confirm password")}
                value={passwordFormik.values.password_confirmation}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                isInvalid={
                  !!(
                    (passwordFormik.touched.password_confirmation &&
                      passwordFormik.errors.password_confirmation) ||
                    errors?.password_confirmation
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.password_confirmation ||
                  errors?.password_confirmation}
              </Form.Control.Feedback>
            </div>
          </Col>

          <Col lg={12}>
            <div className="text-end">
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
