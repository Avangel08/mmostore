import React, { useState } from "react";
import GuestLayout from "../../../Layouts/GuestLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import logoLight from "../../../../images/logo-light.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import {t} from "i18next";

export default function Register() {
    const { props } = usePage();
    const DOMAIN_SUFFIX = (props as any)?.domainSuffix || "mmostore.local";
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: "",
            store_name: "",
            domain_store: "",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("Invalid email"))
                .required(t("Email is required")),
            store_name: Yup.string()
                .min(3, t("Store name must be at least 3 characters"))
                .max(20, t("Store name must be at most 20 characters"))
                .required(t("Store name is required")),
            domain_store: Yup.string()
                .transform((value) => (value ? value.replace(new RegExp(`\\${DOMAIN_SUFFIX}$`, 'i'), '') : value))
                .min(3, t("Domain store must be at least 3 characters"))
                .max(10, t("Domain store must be at most 10 characters"))
                .required(t("Domain store is required")),
            password: Yup.string()
                .min(8, t("Password must be at least 8 characters"))
                .required(t("Password is required")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password')], t("Passwords must match"))
                .required(t("Password is required")),
        }),
        onSubmit: (values) => {
            const payload = {
                ...values,
                domain_store: values.domain_store.replace(new RegExp(`\\${DOMAIN_SUFFIX}$`, 'i'), ''),
            };
            router.post(route('home.register.post'), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setServerError(null);
                },
                onError: (errors: any) => {
                    // Map field errors to formik
                    validation.setErrors(errors);
                    // Show a top-level message if provided by backend
                    const topMessage = Array.isArray(errors?.register) ? errors.register[0] : errors?.register;
                    setServerError(topMessage || t('Something went wrong. Please try again.'));
                }
            });
        },
    });


    return (
        <React.Fragment>
            <GuestLayout>
                <Head title="Basic SignUp | Velzon - React Admin & Dashboard Template" />
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link href="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20"/>
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <Card.Body className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                            <p className="text-muted">Get your free mmoshop account now</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            {serverError && (
                                                <div className="alert alert-danger" role="alert">
                                                    {serverError}
                                                </div>
                                            )}
                                            <Form onSubmit={validation.handleSubmit}>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="user-email">Email <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-email-inputgroup">
                                                        <Form.Control
                                                            type='email'
                                                            className="form-control pe-5 user-email-input"
                                                            placeholder={ t("Enter your email") }
                                                            id="user-email"
                                                            name="email"
                                                            value={validation.values.email}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.email && validation.touched.email ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.email && validation.touched.email ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.email && validation.touched.email ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.email && validation.touched.email ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.email}</Form.Control.Feedback>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="store-name">{t("Store name")} <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-store-name-inputgroup">
                                                        <Form.Control
                                                            type='text'
                                                            className="form-control pe-5 store-name-input"
                                                            placeholder={ t("Enter your store name") }
                                                            id="store-name"
                                                            name="store_name"
                                                            value={validation.values.store_name}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.store_name && validation.touched.store_name ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.store_name && validation.touched.store_name ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.store_name && validation.touched.store_name ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.store_name && validation.touched.store_name ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.store_name}</Form.Control.Feedback>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="domain-store">{t("Domain store")} <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-store-name-inputgroup">
                                                        <Form.Control
                                                            type='text'
                                                            className="form-control pe-5 domain-store-input"
                                                            placeholder={ t("Enter your domain store") }
                                                            id="domain-store"
                                                            name="domain_store"
                                                            value={validation.values.domain_store}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                const rawValue = e.target.value.replace(new RegExp(`\\${DOMAIN_SUFFIX}$`, 'i'), '');
                                                                validation.setFieldValue('domain_store', rawValue);
                                                            }}
                                                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                                validation.handleBlur(e);
                                                                const rawValue = validation.values.domain_store.trim();
                                                                if (rawValue && !rawValue.toLowerCase().endsWith(DOMAIN_SUFFIX)) {
                                                                    validation.setFieldValue('domain_store', `${rawValue}${DOMAIN_SUFFIX}`);
                                                                }
                                                            }}
                                                            onFocus={() => {
                                                                const currentValue = validation.values.domain_store;
                                                                const stripped = currentValue.replace(new RegExp(`\\${DOMAIN_SUFFIX}$`, 'i'), '');
                                                                if (stripped !== currentValue) {
                                                                    validation.setFieldValue('domain_store', stripped);
                                                                }
                                                            }}
                                                            isInvalid={validation.errors.domain_store && validation.touched.domain_store ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.domain_store && validation.touched.domain_store ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.domain_store && validation.touched.domain_store ? 'none' : undefined
                                                            }}
                                                        />
                                                        { validation.errors.domain_store && validation.touched.domain_store ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.domain_store}</Form.Control.Feedback>
                                                        ) : null }
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="password-input">{ t("Password") }</Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder={ t("Enter your password") }
                                                            id="password-input"
                                                            name="password"
                                                            value={validation.values.password}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.password && validation.touched.password ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.password && validation.touched.password ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.password && validation.touched.password ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.password && validation.touched.password ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.password}</Form.Control.Feedback>
                                                        ) : null}
                                                        <Button variant="link" onClick={() => setPasswordShow(!passwordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none" type="button"
                                                            id="password-addon"><i className="ri-eye-fill align-middle"></i>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="confirm-password-input">{ t("Confirm password") }</Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={confirmPasswordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder={ t("Enter your password") }
                                                            id="confirm-password-input"
                                                            name="confirm_password"
                                                            value={validation.values.confirm_password}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.confirm_password && validation.touched.confirm_password ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.confirm_password && validation.touched.confirm_password ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.confirm_password && validation.touched.confirm_password ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.confirm_password && validation.touched.confirm_password ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.confirm_password}</Form.Control.Feedback>
                                                        ) : null}
                                                        <Button variant="link" onClick={() => setConfirmPasswordShow(!confirmPasswordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted confirm-password-addon material-shadow-none" type="button"
                                                            id="confirm-password-addon"><i className="ri-eye-fill align-middle"></i></Button>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="mb-0 fs-12 text-muted fst-italic">By registering you agree to the MMO Store
                                                        <Link href="#" className="text-primary text-decoration-underline fst-normal fw-medium ms-2">Terms of Use</Link>
                                                    </p>
                                                </div>

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit">{ t("Sign up store") }</button>
                                                </div>

                                                {/*<div className="mt-4 text-center">*/}
                                                {/*    <div className="signin-other-title">*/}
                                                {/*        <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>*/}
                                                {/*    </div>*/}

                                                {/*    <div>*/}
                                                {/*        <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>{" "}*/}
                                                {/*        <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>{" "}*/}
                                                {/*        <button type="button" className="btn btn-dark btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></button>{" "}*/}
                                                {/*        <button type="button" className="btn btn-info btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></button>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </Form>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </GuestLayout>
        </React.Fragment>
    );
}
