import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Button, Form } from 'react-bootstrap';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { t } from 'i18next';

//import images
import logoLight from "../../../../images/logo-light.png";
import GuestLayout from '../../../Layouts/GuestLayout';

const ForgotPassword = () => {
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
        
        post(route('home.forgot-password.post'), {
            onSuccess: () => {
                router.visit(route('home.forgot-password.success'));
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
            <GuestLayout>
                <Head title={t("Forgot password") + " | MMO Store"} />
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
                                            <h5 className="text-primary">{t("Forgot password")}</h5>
                                            <p className="text-muted">{t("Enter your email address and we'll send you a link to reset your password")}</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <Form.Label htmlFor="email">{t("Email")} <span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        id="email"
                                                        placeholder={t("Enter your email")}
                                                        className={errors.email || validationErrors.email ? 'is-invalid' : ''}
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
                                                    />
                                                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                                        {validationErrors.email ? validationErrors.email : (errors.email ? t(String(errors.email)) : null)}
                                                    </Form.Control.Feedback>
                                                </div>

                                                <div className="mt-4">
                                                    <Button
                                                        variant="success"
                                                        className="w-100"
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {t("Reset password")}
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Card.Body>
                                </Card>
                                <div className="text-center">
                                    <a 
                                        href={route('home.login')}
                                    >
                                        <i className="ri-arrow-left-line"></i> {t("Back to login")}
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </GuestLayout>
        </React.Fragment>
    );
};

export default ForgotPassword;
