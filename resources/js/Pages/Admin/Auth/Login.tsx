import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import authLoginIllustration from "../../../../images/seller/auth-login-illustration-light.png";

export default function Login({ status, canResetPassword }: any) {
    const { t } = useTranslation();
    const titleWeb = t("Sign in") + " - Admin";

    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const { data, setData, post, processing, setError, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
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

        if (!data.password) {
            setError('password', t('Password is required'));
            hasError = true;
        }

        if (hasError) {
            return;
        }

        post(route('admin.login'), {
            onSuccess: () => {
                // Reload page to refresh CSRF token after successful login
                window.location.reload();
            }
        });
    };

    return (
        <React.Fragment>
            <Head title={ titleWeb } />

            <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container fluid>
                    <Row className="h-100">
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <div className="w-100" style={{ maxWidth: '600px' }}>
                                <Card className="border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                                    <Card.Body className="p-5">
                                        <div className="text-center mb-4">
                                            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '25px' }}>{ t('Welcome to {{name}} 👋', { name: 'Admin' }) }</h2>
                                            <div>{ t("Please sign-in to your account and start the adventure") }</div>
                                        </div>

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

                                            <div className="mb-4">
                                                <Form.Label className="form-label fw-semibold text-dark">{ t("Password") }</Form.Label>
                                                <span className="text-danger ms-1">*</span>
                                                <div className="position-relative">
                                                    <i className="ri-lock-line position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                                    <Form.Control
                                                        id="password"
                                                        type={ passwordShow ? "text" : "password" }
                                                        name="password"
                                                        placeholder={ t("Enter your password") }
                                                        className={'ps-5 pe-5 ' + (errors.password ? 'is-invalid' : '')}
                                                        autoComplete="current-password"
                                                        value={data.password}
                                                        onChange={(e: any) => setData('password', e.target.value)}
                                                        style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '12px 16px 12px 40px', fontSize: '14px', backgroundImage: 'none' }}
                                                    />
                                                    <button className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none text-muted p-0 me-3" type="button"  onClick={() => setPasswordShow(!passwordShow)} style={{ border: 'none', background: 'none' }}>
                                                        <i className={passwordShow ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                                    </button>
                                                </div>
                                                <Form.Control.Feedback type="invalid" className="d-block mt-2">{errors.password ? t(String(errors.password)) : null}</Form.Control.Feedback>
                                            </div>

                                            <Button type="submit" className="w-100 py-3 fw-semibold" disabled={processing} style={{ background: '#4f46e5', border: 'none', borderRadius: '8px', fontSize: '16px' }}>
                                                { t("Sign in") }
                                            </Button>
                                        </Form>
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

