import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import authLoginIllustration from "../../../images/seller/auth-login-illustration-light.png";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

export default function ForgotPassword({ status }: any) {
    const { t } = useTranslation();
    const { props } = usePage();
    const subdomain = (props as any).subdomain;
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        email: ''
    });

    const getSubdomain = () => {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length >= 3) {
            const subdomain = parts[0];
            return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
        }
        return 'Merdify';
    };

    const titleWeb = t("Forgot Password") + " - " + getSubdomain();

    useEffect(() => {
        return () => {
            reset('email');
        };
    }, []);

    const submit = (e: any) => {
        e.preventDefault();

        clearErrors();

        let hasError = false;

        if (!data.email) {
            setError('email', t("Email is required"));
            hasError = true;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(data.email)) {
                setError('email', t('Invalid email'));
                hasError = true;
            }
        }

        if (hasError) {
            return;
        }

        post(route('seller.password.email'), {
            onSuccess: () => {
                // Show success message
            },
            onError: (errors: any) => {
            }
        });
    };

    return (
        <React.Fragment>
            <Head title={titleWeb} />

            <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container fluid>
                    <Row className="h-100">
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <div className="w-100" style={{ maxWidth: '600px' }}>
                                <Card className="border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                                    <Card.Body className="p-5">
                                        <div className="text-center mb-4">
                                            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '25px' }}>{ t('Forgot Password?') }</h2>
                                            <div>{ t("Enter your email and we'll send you a reset link") }</div>
                                        </div>
                                        
                                        {status && (
                                            <div className="alert alert-success text-center mb-4">
                                                {status}
                                            </div>
                                        )}

                                        <Form onSubmit={submit} noValidate>
                                            <div className="mb-4">
                                                <Form.Label className="form-label fw-semibold text-dark">{ t("Email") }</Form.Label>
                                                <span className="text-danger ms-1">*</span>
                                                <div className="position-relative">
                                                    <i className="ri-mail-line position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                                    <Form.Control
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        placeholder={ t("Enter your email") }
                                                        className={'ps-5 ' + (errors.email ? 'is-invalid' : '')}
                                                        autoComplete="username"
                                                        autoFocus
                                                        value={data.email}
                                                        onChange={(e: any) => setData('email', e.target.value)}
                                                        style={{ 
                                                            border: '1px solid #e9ecef',
                                                            borderRadius: '8px',
                                                            padding: '12px 16px 12px 40px',
                                                            fontSize: '14px',
                                                            backgroundImage: 'none'
                                                        }}
                                                    />
                                                </div>
                                                <Form.Control.Feedback type="invalid" className="d-block mt-2">{errors.email ? t(String(errors.email)) : null}</Form.Control.Feedback>
                                            </div>

                                            <Button type="submit" className="w-100 py-3 fw-semibold" disabled={processing} style={{ background: '#4f46e5', border: 'none', borderRadius: '8px', fontSize: '16px' }}>
                                                { t("Send Reset Link") }
                                            </Button>
                                        </Form>

                                        <div className="text-center mt-4">
                                            <p className="mb-0">
                                                { t("Remember your password?") } 
                                                <Link href={route('seller.login')} className="fw-semibold text-decoration-none ms-1" style={{ color: '#4f46e5' }}>
                                                    { t("Sign in here") }
                                                </Link>
                                            </p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>

                        <Col lg={6} className="d-flex align-items-center justify-content-center p-0 position-relative">
                            <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                                <img src={authLoginIllustration} alt="Login Illustration" className="img-fluid" style={{ maxHeight: '80%', maxWidth: '90%' }}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}
