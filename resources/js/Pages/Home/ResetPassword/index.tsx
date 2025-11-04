import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Button, Form, Alert } from 'react-bootstrap';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { t } from 'i18next';

//import images
import logoLight from "../../../../images/logo-light.png";
import GuestLayout from '../../../Layouts/GuestLayout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

const ResetPassword = ({ token, email }: ResetPasswordProps) => {
    const { props } = usePage();
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [isValidated, setIsValidated] = useState(false);
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setValidationErrors({});
        setIsValidated(true);
        
        const newErrors: {[key: string]: string} = {};
        
        if (!data.password) {
            newErrors.password = t('Password is required');
        } else if (data.password.length < 8) {
            newErrors.password = t('Password must be at least 8 characters');
        }
        
        if (!data.password_confirmation) {
            newErrors.password_confirmation = t('Please confirm your password');
        } else if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = t('Passwords must match');
        }
        
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }
        
        post(route('home.reset-password.post'), {
            onSuccess: () => {
                window.open(route('home.login') + '?reset=success', '_self');
            },
            onError: () => {
                
            }
        });
    };

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    return (
        <React.Fragment>
            <GuestLayout>
                <Head title={t("Reset password") + " | MMO Store"} />
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
                                            <h5 className="text-primary">{t("Reset password")}</h5>
                                            <p className="text-muted">{t("Enter your new password")}</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                                                {errors.email && (
                                                    <div className="mb-3">
                                                        <Alert className="border-0 alert-danger" style={{
                                                            backgroundColor: '#fdecea',
                                                            color: '#611a15',
                                                            fontSize: '14px',
                                                            borderRadius: '8px'
                                                        }}>
                                                            <i className="ri-error-warning-line me-2"></i>
                                                            {t(String(errors.email))}
                                                        </Alert>
                                                    </div>
                                                )}

                                                <div className="mb-3">
                                                    <Alert className="border-0 alert-success" style={{ 
                                                        backgroundColor: '#d1fae5', 
                                                        color: '#065f46',
                                                        fontSize: '14px',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <i className="ri-shield-check-line me-2"></i>
                                                        <strong>{t("Reset password for:")}</strong> {data.email}
                                                    </Alert>
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="password">{t("New Password")} <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={passwordShow ? "text" : "password"}
                                                            id="password"
                                                            placeholder={t("Enter new password")}
                                                            className={errors.password || validationErrors.password ? 'is-invalid' : ''}
                                                            autoComplete="new-password"
                                                            value={data.password}
                                                            onChange={(e: any) => {
                                                                setData('password', e.target.value);
                                                                if (validationErrors.password) {
                                                                    setValidationErrors(prev => {
                                                                        const newErrors = {...prev};
                                                                        delete newErrors.password;
                                                                        return newErrors;
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                            type="button"
                                                            onClick={() => setPasswordShow(!passwordShow)}
                                                        >
                                                            <i className={`ri-eye${passwordShow ? "" : "-off"}-fill align-middle`}></i>
                                                        </button>
                                                        <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                                            {validationErrors.password ? validationErrors.password : (errors.password ? t(String(errors.password)) : null)}
                                                        </Form.Control.Feedback>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Label htmlFor="password_confirmation">{t("Confirm Password")} <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={confirmPasswordShow ? "text" : "password"}
                                                            id="password_confirmation"
                                                            placeholder={t("Confirm new password")}
                                                            className={errors.password_confirmation || validationErrors.password_confirmation ? 'is-invalid' : ''}
                                                            autoComplete="new-password"
                                                            value={data.password_confirmation}
                                                            onChange={(e: any) => {
                                                                setData('password_confirmation', e.target.value);
                                                                if (validationErrors.password_confirmation) {
                                                                    setValidationErrors(prev => {
                                                                        const newErrors = {...prev};
                                                                        delete newErrors.password_confirmation;
                                                                        return newErrors;
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                            type="button"
                                                            onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                                                        >
                                                            <i className={`ri-eye${confirmPasswordShow ? "" : "-off"}-fill align-middle`}></i>
                                                        </button>
                                                        <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                                            {validationErrors.password_confirmation ? validationErrors.password_confirmation : (errors.password_confirmation ? t(String(errors.password_confirmation)) : null)}
                                                        </Form.Control.Feedback>
                                                    </div>
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

export default ResetPassword;
