import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import authLoginIllustration from "../../../../images/seller/auth-login-illustration-light.png";
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

export default function Login({}: any) {
    const { t } = useTranslation();
    const { props } = usePage();
    const subdomain = (props as any).subdomain;
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        email: '',
        password: ''
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

        post(route('seller.login.post', { sub: subdomain }), {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors: any) => {
                console.error('Login failed:', errors);
            }
        });
    };

    return (
        <React.Fragment>
            <Head title={ t("Sign in") } />

            <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container fluid>
                    <Row className="h-100">
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <div className="w-100" style={{ maxWidth: '600px' }}>
                                <Card className="border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                                    <Card.Body className="p-5">
                                        <div className="text-center mb-4">
                                            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '25px' }}>{ t('Welcome to {{name}} 👋', { name: getSubdomain() }) }</h2>
                                            <div>{ t("Please sign-in to your account and start the adventure") }</div>
                                        </div>
                                        
                                        {showSuccessMessage && (
                                            <Alert variant="success" className="mb-4 border-0" style={{ 
                                                backgroundColor: '#d1edff', 
                                                color: '#0c5460',
                                                fontSize: '14px',
                                                borderRadius: '8px'
                                            }}>
                                                <i className="ri-check-line me-2"></i>
                                                {t('passwords.reset')}
                                            </Alert>
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
                                                
                                                <div className="d-flex justify-content-end mt-2">
                                                    <Link href={route('seller.forgot-password')} className="text-decoration-none fw-semibold" style={{ transition: 'color 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = '#808283'; }} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = '#808283'; }}>
                                                        { t("Forgot password") }
                                                    </Link>
                                                </div>
                                            </div>

                                            <Button type="submit" className="w-100 py-3 fw-semibold" disabled={processing} style={{ background: '#4f46e5', border: 'none', borderRadius: '8px', fontSize: '16px' }}>
                                                { t("Sign in") }
                                            </Button>
                                        </Form>

                                        {/*<div className="text-center my-4">*/}
                                        {/*    <div className="d-flex align-items-center">*/}
                                        {/*        <hr className="flex-grow-1" />*/}
                                        {/*        <span className="px-3 text-muted">{ t("OR") }</span>*/}
                                        {/*        <hr className="flex-grow-1" />*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        {/*<div className="d-flex justify-content-center gap-3">*/}
                                        {/*    <Button  variant="outline-danger"  className="rounded-circle p-3" style={{ width: '60px', height: '60px' }}>*/}
                                        {/*        <i className="ri-google-fill fs-3"></i>*/}
                                        {/*    </Button>*/}
                                        {/*</div>*/}
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


