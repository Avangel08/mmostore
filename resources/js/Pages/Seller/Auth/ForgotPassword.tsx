import {Head, useForm, usePage} from '@inertiajs/react';
import React, {useEffect, useState} from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import authLoginIllustration from "../../../../images/seller/auth-login-illustration-light.png";
import {useTranslation} from "react-i18next";
import { router } from '@inertiajs/react';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const { props } = usePage();
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [isValidated, setIsValidated] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: ''
    });

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setValidationErrors({});
        setIsValidated(true);
        
        const newErrors: {[key: string]: string} = {};
        
        if (!data.email) {
            newErrors.email = t('Email is required');
        } else if (!validateEmail(data.email)) {
            newErrors.email = t('The email address not valid');
        }
        
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }
        
        post(route('seller.forgot-password.post'), {
            onSuccess: () => {
                router.visit(route('seller.forgot-password.success'));
            },
            onError: () => {
            }
        });
    };

    useEffect(() => {
        return () => {
            reset();
        };
    }, []);

    return (
        <React.Fragment>
            <Head title={ t("Forgot password") } />

            <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container fluid>
                    <Row className="h-100">
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <div className="w-100" style={{ maxWidth: '600px' }}>
                                <Card className="border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                                    <Card.Body className="p-5">
                                        <div className="text-center mb-4">
                                            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '25px' }}>{ t('Forgot password') }</h2>
                                            <div>{ t("Enter your email address and we'll send you a link to reset your password") }</div>
                                        </div>

                                        <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
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
                                                        className={'ps-5 ' + (errors.email || validationErrors.email ? 'is-invalid' : '')}
                                                        autoComplete="username"
                                                        autoFocus
                                                        value={data.email}
                                                        onChange={(e: any) => {
                                                            setData('email', e.target.value);
                                                            // Clear validation error when user starts typing
                                                            if (validationErrors.email) {
                                                                setValidationErrors(prev => {
                                                                    const newErrors = {...prev};
                                                                    delete newErrors.email;
                                                                    return newErrors;
                                                                });
                                                            }
                                                        }}
                                                        style={{
                                                            border: '1px solid #e9ecef',
                                                            borderRadius: '8px',
                                                            padding: '12px 16px 12px 40px',
                                                            fontSize: '14px',
                                                            backgroundImage: 'none'
                                                        }}
                                                    />
                                                </div>
                                                <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                                    {validationErrors.email ? validationErrors.email : (errors.email ? t(String(errors.email)) : null)}
                                                </Form.Control.Feedback>
                                            </div>

                                            <Button 
                                                type="submit" 
                                                className="w-100 py-3 fw-semibold" 
                                                disabled={processing} 
                                                style={{ 
                                                    background: '#4f46e5', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    fontSize: '16px' 
                                                }}
                                            >
                                                {processing ? t("Reset password") : t("Reset password")}
                                            </Button>
                                        </Form>

                                        <div className="text-center mt-4">
                                            <Button
                                                variant="link"
                                                className="p-0 text-muted d-flex align-items-center justify-content-center mx-auto"
                                                onClick={() => router.visit(route('seller.login'))}
                                                style={{ 
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {t('Back to login')}
                                            </Button>
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
