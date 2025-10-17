import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../../utils/showToast';
import Swal from 'sweetalert2';

export default function ResetPassword() {
  const { t } = useTranslation();
  const { errors, token, email } = usePage().props as any;
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);

  const getSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    }
    return 'Merdify';
  };

  const titleWeb = t("Reset password") + " - " + getSubdomain();

  const formik = useFormik({
    initialValues: {
      token: token || '',
      email: email || '',
      password: '',
      password_confirmation: '',
    },
    validationSchema: Yup.object({
      token: Yup.string().required(t("Token is required")),
      email: Yup.string()
        .email(t("Invalid email"))
        .required(t("Email is required")),
      password: Yup.string()
        .min(8, t("Password must be at least 8 characters"))
        .required(t("Password is required")),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], t("Passwords must match"))
        .required(t("Please confirm your password")),
    }),
    onSubmit: (values) => {
      const url = route('buyer.password.store');

      router.post(url, values, {
        onSuccess: (success: any) => {
          if (success.props?.message?.error) {
            showToast(t(success.props.message.error), "error");
            return;
          }

          if (success.props?.message?.success) {
            Swal.fire({
              title: t('Success'),
              text: t(success.props.message.success),
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false
            }).then(() => {
              router.get(route("buyer.home"));
            });
          }
        },
        onFinish: () => {
          formik.setSubmitting(false);
        }
      });
    },
  });

  useEffect(() => {
    formik.setErrors(errors || {});
  }, [errors]);

  return (
    <React.Fragment>
      <ToastContainer />
      <Head title={titleWeb} />
      <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container fluid>
          <Row className="h-100">
            <Col lg={6} className="d-flex align-items-center justify-content-center">
              <div className="w-100" style={{ maxWidth: '600px' }}>
                <Card className="border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                  <Card.Body className="p-5">
                    <div className="text-center mb-4">
                      <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '25px' }}>
                        {t('Reset password')} 🔒
                      </h2>
                      <div className="text-muted">
                        {t("Enter your new password to reset your account")}
                      </div>
                    </div>

                    <Form onSubmit={formik.handleSubmit} noValidate>
                      {/* Hidden Token Field */}
                      <Form.Control
                        type="hidden"
                        name="token"
                        value={formik.values.token}
                      />

                      {/* Email Field - Disabled */}
                      <div className="mb-4">
                        <Form.Label className="form-label fw-semibold text-dark">
                          Email
                        </Form.Label>
                        <div className="position-relative">
                          <i className="ri-mail-line position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                          <Form.Control
                            id="email"
                            type="email"
                            name="email"
                            placeholder={t("Your email address")}
                            className={'ps-5 pe-3 ' + (
                              (formik.touched.email && formik.errors.email)
                                ? 'is-invalid'
                                : ''
                            )}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={true}
                            style={{
                              border: '1px solid #e9ecef',
                              borderRadius: '8px',
                              padding: '12px 16px 12px 40px',
                              fontSize: '14px',
                              backgroundImage: 'none',
                              backgroundColor: '#f8f9fa',
                              color: '#6c757d'
                            }}
                          />
                        </div>
                        <Form.Control.Feedback type="invalid" className="d-block mt-2">
                          {t(formik.errors.email as string)}
                        </Form.Control.Feedback>
                      </div>

                      {/* New Password Field */}
                      <div className="mb-4">
                        <Form.Label className="form-label fw-semibold text-dark">
                          {t("New Password")}
                        </Form.Label>
                        <span className="text-danger ms-1">*</span>
                        <div className="position-relative">
                          <i className="ri-lock-line position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                          <Form.Control
                            id="password"
                            type={passwordShow ? "text" : "password"}
                            name="password"
                            placeholder={t("Enter your new password")}
                            className={'ps-5 pe-5 ' + (
                              (formik.touched.password && formik.errors.password)
                                ? 'is-invalid'
                                : ''
                            )}
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: '1px solid #e9ecef',
                              borderRadius: '8px',
                              padding: '12px 16px 12px 40px',
                              fontSize: '14px',
                              backgroundImage: 'none'
                            }}
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none text-muted p-0 me-3"
                            type="button"
                            onClick={() => setPasswordShow(!passwordShow)}
                            style={{ border: 'none', background: 'none' }}
                          >
                            <i className={passwordShow ? "ri-eye-off-line" : "ri-eye-line"}></i>
                          </button>
                        </div>
                        <Form.Control.Feedback type="invalid" className="d-block mt-2">
                          {t(formik.errors.password as string)}
                        </Form.Control.Feedback>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="mb-4">
                        <Form.Label className="form-label fw-semibold text-dark">
                          {t("Confirm New Password")}
                        </Form.Label>
                        <span className="text-danger ms-1">*</span>
                        <div className="position-relative">
                          <i className="ri-lock-line position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                          <Form.Control
                            id="password_confirmation"
                            type={confirmPasswordShow ? "text" : "password"}
                            name="password_confirmation"
                            placeholder={t("Confirm your new password")}
                            className={'ps-5 pe-5 ' + (
                              (formik.touched.password_confirmation && formik.errors.password_confirmation)
                                ? 'is-invalid'
                                : ''
                            )}
                            autoComplete="new-password"
                            value={formik.values.password_confirmation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: '1px solid #e9ecef',
                              borderRadius: '8px',
                              padding: '12px 16px 12px 40px',
                              fontSize: '14px',
                              backgroundImage: 'none'
                            }}
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none text-muted p-0 me-3"
                            type="button"
                            onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                            style={{ border: 'none', background: 'none' }}
                          >
                            <i className={confirmPasswordShow ? "ri-eye-off-line" : "ri-eye-line"}></i>
                          </button>
                        </div>
                        <Form.Control.Feedback type="invalid" className="d-block mt-2">
                          {t(formik.errors.password_confirmation as string)}
                        </Form.Control.Feedback>
                      </div>

                      <Button
                        type="submit"
                        className="w-100 py-3 fw-semibold"
                        disabled={formik.isSubmitting}
                        style={{
                          background: '#4f46e5',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      >
                        {formik.isSubmitting ? t("Sending") + "..." : t("Reset password")}
                      </Button>
                    </Form>

                    <div className="text-center mt-4">
                      <p className="text-muted mb-0">
                        {t("Remember your password?")}
                        <Link href={route("buyer.home")} className="text-primary text-decoration-none fw-semibold ms-1">
                          {t("Back to Sign In")}
                        </Link>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>

            <Col lg={6} className="d-flex align-items-center justify-content-center p-0 position-relative">
              <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                  <i className="ri-lock-password-line" style={{ fontSize: '120px', color: 'rgba(255,255,255,0.7)' }}></i>
                  <h3 className="text-white mt-3 fw-bold">{t("Create new password")}</h3>
                  <p className="text-white-50 fs-5">
                    {t("Create new password after forgot password")}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}