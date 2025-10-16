import React, { useEffect, useState } from 'react';
import {Head, router, useForm} from '@inertiajs/react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import authLoginIllustration from "../../../../images/seller/auth-login-illustration-light.png";
import { useTranslation } from "react-i18next";

export default function ResetPassword({ token, email, tokenExpired }: any) {
    const { t } = useTranslation();
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [isValidated, setIsValidated] = useState(false);
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const validateForm = (): boolean => {
        setValidationErrors({});
        setIsValidated(true);
        
        const newErrors: {[key: string]: string} = {};
        
        if (!data.password) {
            newErrors.password = t('Password is required');
        } else if (!validatePassword(data.password)) {
            newErrors.password = t('Password must be at least 8 characters');
        }
        
        if (!data.password_confirmation) {
            newErrors.password_confirmation = t('Password confirmation is required');
        } else if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = t('Passwords do not match');
        }
        
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return false;
        }
        
        return true;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        post(route('seller.reset-password.post'), {
            onSuccess: () => {
                router.visit(route('seller.login') + '?reset=success');
            },
            onError: () => {
                console.error('Error resetting password');
            }
        });
    };

    return (
        <React.Fragment>
            <Head title={t("Reset password")} />

            <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container fluid>
                    <Row className="h-100">
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <div className="w-100" style={{ maxWidth: '600px' }}>
                                <Card className="border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                                    <Card.Body className="p-5">
                                        <div className="text-center mb-4">
                                            <div className="mb-4">
                                                <div 
                                                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        backgroundColor: '#10b981',
                                                        color: 'white',
                                                        fontSize: '40px'
                                                    }}
                                                >
                                                    <i className="ri-lock-line"></i>
                                                </div>
                                            </div>
                                            
                                            <h2 className="fw-bold text-dark mb-3" style={{ fontSize: '25px' }}>
                                                {t('Reset password')}
                                            </h2>
                                        </div>

                                        {errors.email && (
                                            <div className="mb-4">
                                                <Alert className="border-0 alert-danger mb-0" style={{
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

                                        {tokenExpired ? (
                                            <div className="mb-4">
                                                <Alert className="border-0 alert-danger mb-4" style={{ 
                                                    backgroundColor: '#fdecea', 
                                                    color: '#611a15',
                                                    fontSize: '14px',
                                                    borderRadius: '8px'
                                                }}>
                                                    <i className="ri-error-warning-line me-2"></i>
                                                    {t('Invalid or expired reset link')}
                                                </Alert>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-4">
                                                    <Alert className="border-0 alert-success mb-4" style={{ 
                                                        backgroundColor: '#d1fae5', 
                                                        color: '#065f46',
                                                        fontSize: '14px',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <i className="ri-shield-check-line me-2"></i>
                                                        <strong>{t("Reset password for:")}</strong> {data.email}
                                                    </Alert>
                                                </div>

                                                <Form noValidate validated={isValidated} onSubmit={submit}>

                                            <div className="mb-4">
                                                <Form.Label className="form-label fw-semibold text-dark">{t("New Password")}</Form.Label>
                                                <span className="text-danger ms-1">*</span>
                                                <div className="position-relative">
                                                    <i className="ri-lock-line position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                                    <Form.Control
                                                        id="password"
                                                        type={passwordShow ? "text" : "password"}
                                                        name="password"
                                                        placeholder={t("Enter new password")}
                                                        className={'ps-5 pe-5 ' + (errors.password || validationErrors.password ? 'is-invalid' : '')}
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
                                                        style={{
                                                            border: '1px solid #e9ecef',
                                                            borderRadius: '8px',
                                                            padding: '12px 16px 12px 40px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                    <Button
                                                        variant="link"
                                                        className="position-absolute top-50 translate-middle-y end-0 me-3 p-0"
                                                        onClick={() => setPasswordShow(!passwordShow)}
                                                        style={{ color: '#6c757d', textDecoration: 'none' }}
                                                    >
                                                        {passwordShow ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
                                                    </Button>
                                                </div>
                                                <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                                    {validationErrors.password ? validationErrors.password : (errors.password ? t(String(errors.password)) : null)}
                                                </Form.Control.Feedback>
                                            </div>

                                            {/* Confirm Password Field */}
                                            <div className="mb-4">
                                                <Form.Label className="form-label fw-semibold text-dark">{t("Confirm Password")}</Form.Label>
                                                <span className="text-danger ms-1">*</span>
                                                <div className="position-relative">
                                                    <i className="ri-lock-line position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                                    <Form.Control
                                                        id="password_confirmation"
                                                        type={confirmPasswordShow ? "text" : "password"}
                                                        name="password_confirmation"
                                                        placeholder={t("Confirm new password")}
                                                        className={'ps-5 pe-5 ' + (errors.password_confirmation || validationErrors.password_confirmation ? 'is-invalid' : '')}
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
                                                        style={{
                                                            border: '1px solid #e9ecef',
                                                            borderRadius: '8px',
                                                            padding: '12px 16px 12px 40px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                    <Button
                                                        variant="link"
                                                        className="position-absolute top-50 translate-middle-y end-0 me-3 p-0"
                                                        onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                                                        style={{ color: '#6c757d', textDecoration: 'none' }}
                                                    >
                                                        {confirmPasswordShow ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
                                                    </Button>
                                                </div>
                                                <Form.Control.Feedback type="invalid" className="d-block mt-2">
                                                    {validationErrors.password_confirmation ? validationErrors.password_confirmation : (errors.password_confirmation ? t(String(errors.password_confirmation)) : null)}
                                                </Form.Control.Feedback>
                                            </div>

                                            <Button
                                                type="submit" 
                                                className="w-100 py-3 fw-semibold" 
                                                disabled={processing} 
                                                style={{ 
                                                    background: '#10b981', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    fontSize: '16px' 
                                                }}
                                            >
                                                {processing ? t("Update Password") : t("Update Password")}
                                            </Button>
                                                </Form>

                                                <div className="text-center mt-4">
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-muted d-flex align-items-center justify-content-center mx-auto"
                                                        onClick={() => window.location.href = route('seller.login')}
                                                        style={{ 
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {t('Back to login')}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
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
