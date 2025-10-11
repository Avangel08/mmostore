import { Link, router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";

const GoogleIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
         c-6.627,0-12-5.373-12-12s5.373-12,12-12
         c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
         C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,
         4,24s8.955,20,20,20s20-8.955,20-20
         C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819
         C14.655,15.108,18.961,12,24,12
         c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
         C34.046,6.053,29.268,4,24,4
         C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192
         l-6.19-5.238C29.211,35.091,26.715,36,24,36
         c-5.222,0-9.657-3.356-11.303-7.962l-6.571,4.819
         C9.656,39.663,16.318,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303
         c-0.792,2.237-2.231,4.166-4.089,5.571
         l6.19,5.238C39.986,36.236,44,30.552,
         44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export default function ModalLogin({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const { t } = useTranslation();
  const { errors } = usePage().props;
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("Invalid email"))
        .matches(/^[^@]+@[^@]+\.[^@]+$/, t("Invalid email")),
      password: Yup.string()
        .required(t("Password is required")),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: (values) => {
      router.post(route("buyer.login"), values, {
        onSuccess: () => window.location.reload(),
      });
    },
  });

  useEffect(() => {
    loginFormik.setErrors(errors || {});
  }, [errors]);

  const registerFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms_agreed: false,
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(50, t("Maximum {{count}} characters", { count: 50 }))
        .required(t("First name is required")),
      last_name: Yup.string()
        .max(50, t("Maximum {{count}} characters", { count: 50 })),
      email: Yup.string()
        .email(t("Invalid email"))
        .max(255, t("Maximum {{count}} characters", { count: 255 }))
        .required(t("Email is required")),
      password: Yup.string()
        .min(8, t("Password must be at least {{count}} characters", { count: 8 }))
        .required(t("Password is required")),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], t("Password confirmation does not match"))
        .required(t("Confirm password is required")),
      terms_agreed: Yup.boolean()
        .oneOf([true], t("You must agree to the terms")),
    }),
    onSubmit: (values) => {
      router.post(route("buyer.register"), values, {
        onSuccess: () => {
          setIsLogin(true);
          registerFormik.resetForm();
          window.location.reload();
        },
      });
    },
  });

  useEffect(() => {
    registerFormik.setErrors(errors || {});
  }, [errors]);

  const forgotPasswordFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("Invalid email"))
        .required(t("Email is required")),
    }),
    onSubmit: (values) => {
      router.post(route("buyer.forgot-password.store"), values, {
        onSuccess: () => {
          forgotPasswordFormik.resetForm();
          setIsForgotPassword(false);
          setIsLogin(true);
          showToast(t("Reset password link sent") + ". " + t("Please check your email"), "success");
        },
      });
    },
  });

  useEffect(() => {
    forgotPasswordFormik.setErrors(errors || {});
  }, [errors]);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    loginFormik.resetForm();
    registerFormik.resetForm();
    forgotPasswordFormik.resetForm();
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
    setIsLogin(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    forgotPasswordFormik.resetForm();
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header
          closeButton
          style={{
            borderBottom: "none",
            paddingTop: "2rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          <Modal.Title
            style={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              fontSize: "1.75rem",
            }}
          >
            {isForgotPassword ? t("Forgot password") : isLogin ? t("Log in") : t("Register")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0 2rem 2rem 2rem" }}>
          {isForgotPassword ? (
            // Forgot Password Form
            <Form noValidate onSubmit={forgotPasswordFormik.handleSubmit}>
              <div className="text-center mb-4">
                <p className="text-muted">
                  {t("Enter your email address and we'll send you a link to reset your password")}
                </p>
              </div>

              <Form.Group className="mb-3" controlId="formForgotPasswordEmail">
                <Form.Label>{t("Email")} <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t("Enter your email")}
                  style={{ borderRadius: "0.25rem" }}
                  {...forgotPasswordFormik.getFieldProps("email")}
                  isInvalid={!!(forgotPasswordFormik.errors.email && forgotPasswordFormik.touched.email)}
                />
                <Form.Control.Feedback type="invalid">
                  {forgotPasswordFormik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid gap-2 mb-3">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  style={{ fontWeight: "bold" }}
                >
                  {t("Reset password")}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleBackToLogin}
                  style={{
                    textDecoration: "none",
                    fontWeight: "500",
                    padding: "0.5rem 1rem"
                  }}
                >
                  {t("Back to Login")}
                </Button>
              </div>
            </Form>
          ) : isLogin ? (
            // Login Form
            <Form noValidate onSubmit={loginFormik.handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>{t("Email")} <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t("Enter your email")}
                  style={{ borderRadius: "0.25rem" }}
                  {...loginFormik.getFieldProps("email")}
                  isInvalid={!!(loginFormik.errors.email && loginFormik.touched.email)}
                />
                <Form.Control.Feedback type="invalid">
                  {loginFormik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>{t("Password")} <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showLoginPassword ? "text" : "password"}
                    placeholder={t("Enter your password")}
                    style={{ borderRadius: "0.25rem 0 0 0.25rem" }}
                    {...loginFormik.getFieldProps("password")}
                    isInvalid={!!(loginFormik.errors.password && loginFormik.touched.password)}
                  />
                  <InputGroup.Text
                    style={{
                      cursor: "pointer",
                      borderRadius: "0 0.25rem 0.25rem 0",
                      backgroundColor: "var(--vz-modal-bg)",
                      border: `var(--vz-border-width) solid ${loginFormik.errors.password && loginFormik.touched.password ? 'var(--vz-form-invalid-border-color)' : 'var(--vz-input-border-custom)'}`
                    }}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    <FeatherIcon
                      icon={showLoginPassword ? "eye-off" : "eye"}
                      size={16}
                    />
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {loginFormik.errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
                <div className="d-flex justify-content-end mt-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleForgotPasswordClick();
                    }}
                    style={{ fontSize: "0.8rem", textDecoration: "none" }}
                  >
                    {t("Forgot password")}
                  </a>
                </div>
              </Form.Group>

              {/* Remember Me */}
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label={t("Remember login")}
                  {...loginFormik.getFieldProps("rememberMe")}
                  checked={loginFormik.values.rememberMe}
                />
              </Form.Group>

              {/* Submit */}
              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  type="submit"
                  size="lg"
                  style={{ fontWeight: "bold" }}
                >
                  {t("Log in")}
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  className="d-flex align-items-center justify-content-center border"
                  type="button"
                >
                  <GoogleIcon className="me-2" /> {t("Sign in with Google")}
                </Button>
              </div>
            </Form>
          ) : (
            // Register Form
            <Form noValidate onSubmit={registerFormik.handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>{t("First name")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={50}
                      placeholder={t("Enter your first name")}
                      style={{ borderRadius: "0.25rem" }}
                      {...registerFormik.getFieldProps("first_name")}
                      isInvalid={!!(registerFormik.touched.first_name && registerFormik.errors.first_name)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {registerFormik.errors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>{t("Last name")}</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={50}
                      placeholder={t("Enter your last name")}
                      style={{ borderRadius: "0.25rem" }}
                      {...registerFormik.getFieldProps("last_name")}
                      isInvalid={!!(registerFormik.touched.last_name && registerFormik.errors.last_name)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {registerFormik.errors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formRegisterEmail">
                <Form.Label>{t("Email")} <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t("Enter your email")}
                  style={{ borderRadius: "0.25rem" }}
                  {...registerFormik.getFieldProps("email")}
                  isInvalid={!!(registerFormik.touched.email && registerFormik.errors.email)}
                />
                <Form.Control.Feedback type="invalid">
                  {registerFormik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRegisterPassword">
                <Form.Label>{t("Password")} <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder={t("Enter password (at least {{count}} characters)", { count: 8 })}
                    style={{ borderRadius: "0.25rem 0 0 0.25rem" }}
                    {...registerFormik.getFieldProps("password")}
                    isInvalid={!!(registerFormik.touched.password && registerFormik.errors.password)}
                  />
                  <InputGroup.Text
                    style={{
                      cursor: "pointer",
                      borderRadius: "0 0.25rem 0.25rem 0",
                      backgroundColor: "var(--vz-modal-bg)",
                      border: `var(--vz-border-width) solid ${registerFormik.errors.password && registerFormik.touched.password ? 'var(--vz-form-invalid-border-color)' : 'var(--vz-input-border-custom)'}`
                    }}
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    <FeatherIcon
                      icon={showRegisterPassword ? "eye-off" : "eye"}
                      size={16}
                    />
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {registerFormik.errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPasswordConfirmation">
                <Form.Label>{t("Confirm Password")} <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("Enter your password")}
                    style={{ borderRadius: "0.25rem 0 0 0.25rem" }}
                    {...registerFormik.getFieldProps("password_confirmation")}
                    isInvalid={!!(registerFormik.touched.password_confirmation && registerFormik.errors.password_confirmation)}
                  />
                  <InputGroup.Text
                    style={{
                      cursor: "pointer",
                      borderRadius: "0 0.25rem 0.25rem 0",
                      backgroundColor: "var(--vz-modal-bg)",
                      border: `var(--vz-border-width) solid ${registerFormik.errors.password_confirmation && registerFormik.touched.password_confirmation ? 'var(--vz-form-invalid-border-color)' : 'var(--vz-input-border-custom)'}`
                    }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FeatherIcon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      size={16}
                    />
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {registerFormik.errors.password_confirmation}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formTermsCheckbox">
                <Form.Check
                  type="checkbox"
                  {...registerFormik.getFieldProps("terms_agreed")}
                  checked={registerFormik.values.terms_agreed}
                  isInvalid={!!(registerFormik.touched.terms_agreed && registerFormik.errors.terms_agreed)}
                  label={
                    <span>
                      {t("I agree with")}{" "}
                      <a href="#" style={{ textDecoration: "none" }}>{t("Terms of Service")}</a> &{" "}
                      <a href="#" style={{ textDecoration: "none" }}>{t("Privacy Policy")}</a>
                    </span>
                  }
                />
                {!!(registerFormik.touched.terms_agreed && registerFormik.errors.terms_agreed) && <small className="text-danger">
                  {registerFormik.errors.terms_agreed}
                </small>}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  style={{ fontWeight: "bold" }}
                >
                  {t("Register")}
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  className="d-flex align-items-center justify-content-center border"
                  type="button"
                >
                  <GoogleIcon className="me-2" /> {t("Sign up with Google")}
                </Button>
              </div>
            </Form>
          )}

          {/* Toggle between Login/Register */}
          {!isForgotPassword && (
            <div className="text-center mt-4">
              <div className="d-flex align-items-center mb-3">
                <hr className="w-100" />
                <span className="px-2 text-muted">{t("OR")}</span>
                <hr className="w-100" />
              </div>
              <Button
                variant="link"
                onClick={handleToggleForm}
                style={{
                  textDecoration: "none",
                  fontWeight: "500",
                  padding: "0.5rem 1rem"
                }}
              >
                {isLogin ? t("Don't have an account? Register now") : t("Already have an account? Log in")}
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
