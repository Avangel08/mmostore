import {Head} from '@inertiajs/react';
import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import authLoginIllustration from "../../../../images/seller/auth-login-illustration-light.png";
import {useTranslation} from "react-i18next";
import { router } from '@inertiajs/react';

export default function ForgotPasswordSuccess() {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Head title={ t("Email sent successfully") } />

            <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container fluid>
                    <Row className="h-100">
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <div className="w-100" style={{ maxWidth: '600px' }}>
                                <Card className="border-0 shadow-lg" style={{ borderRadius: "25px" }}>
                                    <Card.Body className="p-5">
                                        <div className="text-center mb-4">
                                            {/* Success Icon */}
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
                                                    <i className="ri-check-line"></i>
                                                </div>
                                            </div>
                                            
                                            <h2 className="fw-bold text-dark mb-3" style={{ fontSize: '25px' }}>
                                                { t('Email sent successfully') }
                                            </h2>
                                            
                                            <div className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                                { t("We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.") }
                                            </div>

                                            <div className="alert alert-info border-0" style={{ 
                                                backgroundColor: '#e7f3ff', 
                                                color: '#0c5460',
                                                fontSize: '14px',
                                                borderRadius: '8px'
                                            }}>
                                                <i className="ri-information-line me-2"></i>
                                                { t("If you don't see the email in your inbox, please check your spam folder.") }
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <Button
                                                variant="primary"
                                                className="w-100 py-3 fw-semibold mb-3"
                                                onClick={() => router.visit(route('seller.login'))}
                                                style={{ 
                                                    background: '#4f46e5', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    fontSize: '16px' 
                                                }}
                                            >
                                                { t('Back to login') }
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
