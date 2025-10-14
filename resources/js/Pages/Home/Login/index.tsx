import React, { useState } from 'react';
import { Card, Col, Container, Row, Button, Form } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';

//import images
import logoLight from "../../../../images/logo-light.png";
import GuestLayout from '../../../Layouts/GuestLayout';

const Index = () => {
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
            router.post(route('home.login.post'), values, {
                preserveScroll: true,
                onSuccess: () => {
                    setServerError(null);
                    setIsSubmitting(false);
                },
                onError: (errors: any) => {
                    validation.setErrors(errors);
                    const topMessage = Array.isArray(errors?.login) ? errors.login[0] : errors?.login;
                    setServerError(topMessage || t('Invalid credentials'));
                    setIsSubmitting(false);
                }
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
                                            <h5 className="text-primary">Welcome Back!</h5>
                                            <p className="text-muted">Sign in to continue to MMO Store.</p>
                                        </div>
                                        {serverError && (
                                            <div className="alert alert-danger">{serverError}</div>
                                        )}
                                        <div className="p-2 mt-4">
                                            <form onSubmit={validation.handleSubmit}>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="email">Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        id="email"
                                                        placeholder="Enter email"
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
                                                    <div className="float-end">
                                                        <Link href="/forgot-password" className="text-muted">Forgot password?</Link>
                                                    </div>
                                                    <Form.Label htmlFor="password">Password</Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Form.Control
                                                            type={passwordShow ? "text" : "password"}
                                                            id="password"
                                                            placeholder="Enter password"
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

                                                <div className="form-check">
                                                    <Form.Check.Input className="form-check-input" type="checkbox" id="auth-remember-check" />
                                                    <Form.Check.Label htmlFor="auth-remember-check">Remember me</Form.Check.Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button
                                                        variant="success"
                                                        className="w-100"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? "Signing in..." : "Sign In"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </Card.Body>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account? <Link href="/register" className="fw-semibold text-primary text-decoration-underline">Signup</Link></p>
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