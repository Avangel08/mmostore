import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Head, Link } from '@inertiajs/react';
import { t } from 'i18next';

//import images
import logoLight from "../../../../images/logo-light.png";
import GuestLayout from '../../../Layouts/GuestLayout';

const Success = () => {
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
                                        <div className="text-center mt-2 mb-4">
                                            <div className="avatar-lg mx-auto">
                                                <div className="avatar-title bg-light text-success display-5 rounded-circle">
                                                    <i className="ri-mail-send-line"></i>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-2">
                                                <h4>{t("Check your email")}</h4>
                                                <p className="mt-3">
                                                    {t("We have sent a password reset link to your email address. Please check your inbox and follow the instructions.")}
                                                </p>
                                                <div className="alert alert-info border-0 mt-4" style={{ 
                                                    backgroundColor: '#e7f3ff', 
                                                    color: '#0c5460',
                                                    fontSize: '14px',
                                                    borderRadius: '8px'
                                                }}>
                                                    <i className="ri-information-line me-2"></i>
                                                    {t("If you don't see the email in your inbox, please check your spam folder.")}
                                                </div>
                                                <div className="mt-4">
                                                    <Button 
                                                        className="btn btn-success w-100"
                                                        onClick={() => window.open(route('home.login'), '_self')}
                                                    >
                                                        {t("Back to login")}
                                                    </Button>
                                                </div>
                                            </div>
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
};

export default Success;
