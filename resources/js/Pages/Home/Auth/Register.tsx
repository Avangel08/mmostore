import React, { useEffect, useState } from "react";
import GuestLayout from "../../../Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import logoLight from "../../../../images/logo-light.png";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Register() {
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: "",
            storename: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("This field is required"),
            storename: Yup.string()
                .min(2, "Username must be at least 2 characters")
                .max(100, "Username must be at most 100 characters")
                .required("This field is required"),
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .matches(RegExp("(.*[a-z].*)"), "At least lowercase letter")
                .matches(RegExp("(.*[A-Z].*)"), "At least uppercase letter")
                .matches(RegExp("(.*[0-9].*)"), "At least one number")
                .required("This field is required"),
            confirmPassword: Yup.string()
                .min(8, "Confirm password must be at least 8 characters")
                .matches(RegExp("(.*[a-z].*)"), "At least lowercase letter")
                .matches(RegExp("(.*[A-Z].*)"), "At least uppercase letter")
                .matches(RegExp("(.*[0-9].*)"), "At least one number")
                .required("This field is required"),
        }),
        onSubmit: (values) => {
            console.log(values);
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
                                        <Link
                                            href="/"
                                            className="d-inline-block auth-logo"
                                        >
                                            <img
                                                src={logoLight}
                                                alt=""
                                                height="20"
                                            />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">
                                        Premium Admin & Dashboard Template
                                    </p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <Card.Body className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">
                                                Create New Account
                                            </h5>
                                            <p className="text-muted">
                                                Get your free mmoshop account now
                                            </p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form onSubmit={validation.handleSubmit}>
                                                {/* Email */}
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="user-email">Email <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-email-inputgroup">
                                                        <Form.Control
                                                            type='email'
                                                            className="form-control pe-5 user-email-input"
                                                            placeholder="Enter email"
                                                            id="user-email"
                                                            name="email"
                                                            value={validation.values.email}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.email && validation.touched.email ? true : false}
                                                        />
                                                        {validation.errors.email && validation.touched.email ? (
                                                            <Form.Control.Feedback type="invalid">{validation.errors.email}</Form.Control.Feedback>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                {/* Store Name */}
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="store-name">Store Name <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-store-name-inputgroup">
                                                        <Form.Control
                                                            type='text'
                                                            className="form-control pe-5 store-name-input"
                                                            placeholder="Enter store name"
                                                            id="store-name"
                                                            name="storename"
                                                            value={validation.values.storename}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.storename && validation.touched.storename ? true : false}
                                                        />
                                                        {validation.errors.storename && validation.touched.storename ? (
                                                            <Form.Control.Feedback type="invalid">{validation.errors.storename}</Form.Control.Feedback>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                {/* Password */}
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="password-input">Password</Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder="Enter password"
                                                            id="password-input"
                                                            name="password"
                                                            value={validation.values.password}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.password && validation.touched.password ? true : false}
                                                        />
                                                        {validation.errors.password && validation.touched.password ? (
                                                            <Form.Control.Feedback type="invalid">{validation.errors.password}</Form.Control.Feedback>
                                                        ) : null}
                                                        <Button variant="link" onClick={() => setPasswordShow(!passwordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none" type="button"
                                                            id="password-addon"><i className="ri-eye-fill align-middle"></i></Button>
                                                    </div>
                                                </div>
                                                {/*  Confirm Password */}
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="confirm-password-input">Confirm Password</Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={confirmPasswordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder="Enter confirm password"
                                                            id="confirm-password-input"
                                                            name="confirmPassword"
                                                            value={validation.values.confirmPassword}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.confirmPassword && validation.touched.confirmPassword ? true : false}
                                                        />
                                                        {validation.errors.confirmPassword && validation.touched.confirmPassword ? (
                                                            <Form.Control.Feedback type="invalid">{validation.errors.confirmPassword}</Form.Control.Feedback>
                                                        ) : null}
                                                        <Button variant="link" onClick={() => setConfirmPasswordShow(!confirmPasswordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted confirm-password-addon material-shadow-none" type="button"
                                                            id="confirm-password-addon"><i className="ri-eye-fill align-middle"></i></Button>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="mb-0 fs-12 text-muted fst-italic">By registering you agree to the Velzon
                                                        <Link href="#" className="text-primary text-decoration-underline fst-normal fw-medium ms-2">Terms of Use</Link></p>
                                                </div>

                                                <div id="password-contain" className="p-3 bg-light mb-2 rounded">
                                                    <h5 className="fs-13">Password must contain:</h5>
                                                    <p id="pass-length" className="invalid fs-12 mb-2">Minimum <b>8 characters</b></p>
                                                    <p id="pass-lower" className="invalid fs-12 mb-2">At <b>lowercase</b> letter (a-z)</p>
                                                    <p id="pass-upper" className="invalid fs-12 mb-2">At least <b>uppercase</b> letter (A-Z)</p>
                                                    <p id="pass-number" className="invalid fs-12 mb-0">A least <b>number</b> (0-9)</p>
                                                </div>

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit">Sign Up</button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>
                                                    </div>

                                                    <div>
                                                        <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-dark btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-info btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></button>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </Card.Body>
                                </Card>
                                {/* <div className="mt-4 text-center">
                                    <p className="mb-0">
                                        Already have an account ?{" "}
                                        <Link
                                            href={route("login")}
                                            className="fw-semibold text-primary text-decoration-underline"
                                        >
                                            {" "}
                                            Signin{" "}
                                        </Link>{" "}
                                    </p>
                                </div> */}
                            </Col>
                        </Row>
                    </Container>
                </div>
            </GuestLayout>
        </React.Fragment>
    );
}
