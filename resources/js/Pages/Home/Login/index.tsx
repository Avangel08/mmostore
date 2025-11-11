import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Button, Form, Alert } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';

//import images
import logoLight from "../../../../images/logo-light.png";
import GuestLayout from '../../../Layouts/GuestLayout';
import axios from 'axios';

const Index = () => {
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    useEffect(() => {
        // Check if there's a reset=success parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reset') === 'success') {
            setShowSuccessMessage(true);
            // Remove the parameter from URL without page reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        }
    }, []);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("Invalid email"))
                .required(t("Email is required")),
            password: Yup.string()
                .required(t("Password is required")),
        }),
        onSubmit: (values) => {
            setIsSubmitting(true);
            axios.post(route('home.login.post'), values).then((response) => {
                setServerError(null);
                setIsSubmitting(false);
                const data = response?.data as {
                    user_id?: string;
                    token?: string;
                    expires_at?: string;
                };
                if (data?.token && data?.user_id) {
                    const url = route("home.go-to-store", { id: data.user_id }) + `?token=${data.token}`;
                    window.open(url, "_self");
                }
            }).catch((response) => {
                const errors = response?.response?.data?.errors;
                validation.setErrors(errors);
                const topMessage = Array.isArray(errors?.login) ? errors.login[0] : errors?.login;
                setServerError(topMessage || t('Invalid credentials'));
                setIsSubmitting(false);
            });
        },
    });

    return (
        <React.Fragment>
            <GuestLayout>
                <Head title="Login | MMO Store" />
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link href="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">MMO Store Platform</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <Card.Body className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">{t("Welcome Back!")}</h5>
                                            <p className="text-muted">{t("Sign in to continue to MMO Store.")}</p>
                                        </div>
                                        {showSuccessMessage && (
                                            <Alert variant="success" className="mb-4" style={{ 
                                                fontSize: '14px',
                                                borderRadius: '8px'
                                            }}>
                                                <i className="ri-check-line me-2"></i>
                                                {t('The password has been reset! You can now log in using your new password')}
                                            </Alert>
                                        )}
                                        {serverError && (
                                            <div className="alert alert-danger">{serverError}</div>
                                        )}
                                        <div className="p-2 mt-4">
                                            <form onSubmit={validation.handleSubmit}>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="email">{t("Email")} <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        id="email"
                                                        placeholder={t("Enter email")}
                                                        value={validation.values.email}
                                                        onChange={validation.handleChange}
                                                        isInvalid={validation.touched.email && !!validation.errors.email}
                                                    />
                                                    {validation.touched.email && validation.errors.email && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {validation.errors.email}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="password">{t("Password")} <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Form.Control
                                                            type={passwordShow ? "text" : "password"}
                                                            id="password"
                                                            placeholder={t("Enter password")}
                                                            value={validation.values.password}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.touched.password && !!validation.errors.password}
                                                        />
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                            type="button"
                                                            onClick={() => setPasswordShow(!passwordShow)}
                                                        >
                                                            <i className={`ri-eye${passwordShow ? "" : "-off"}-fill align-middle`}></i>
                                                        </button>
                                                        {validation.touched.password && validation.errors.password && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {validation.errors.password}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="form-check d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <Form.Check.Input className="form-check-input" type="checkbox" id="auth-remember-check" />
                                                        <Form.Check.Label htmlFor="auth-remember-check">{t("Remember me")}</Form.Check.Label>
                                                    </div>
                                                    <a 
                                                        href={route('home.forgot-password')}
                                                    >
                                                        {t("Forgot password?")}
                                                    </a>
                                                </div>

                                                <div className="mt-4">
                                                    <Button
                                                        variant="success"
                                                        className="w-100"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? t("Signing in...") : t("Sign In")}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </Card.Body>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">{t("Don't have an account?")} <a href="/register" className="fw-semibold text-primary text-decoration-underline">{t("Signup")}</a></p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </GuestLayout>
        </React.Fragment>
    );
};

export default Index;