import React from "react";
import { Col, Container, Row } from "react-bootstrap";

// Import Images
import logolight from "../../../images/logo-light.png";
import { Link } from "@inertiajs/react";

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="custom-footer bg-dark py-5 position-relative">
                <Container>
                    <Row>
                        <Col lg={4} className="mt-4 fs-13">
                            <div>
                                <div>
                                    <img
                                        src={logolight}
                                        alt="logo light"
                                        height="17"
                                    />
                                </div>
                                <div className="mt-4">
                                    <p>
                                        MMO Shop là nền tảng giúp bạn nhanh chóng sở hữu website bán hàng chuyên nghiệp để
                                        kinh doanh các digital products như tài nguyên Gmail, tài khoản TikTok Shop, eBay, Etsy…
                                    </p>
                                    {/* <p className="ff-secondary">
                                        You can build any type of web
                                        application like eCommerce, CRM, CMS,
                                        Project management apps, Admin Panels,
                                        etc using Velzon.
                                    </p> */}
                                </div>
                            </div>
                        </Col>

                        <Col lg={7} className="ms-lg-auto">
                            <Row>
                                <Col sm={4} className="mt-4">
                                    <h5 className="text-white mb-0">Thông tin</h5>
                                    <div className="text-muted mt-3">
                                        <ul className="list-unstyled ff-secondary footer-list">
                                            <li>
                                                <Link href="/">
                                                    Về chúng tôi
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="#features">
                                                    Tính năng
                                                </Link>
                                            </li>
                                            {/* <li>
                                                <Link href="#plans">
                                                    Giá gói
                                                </Link>
                                            </li> */}
                                        </ul>
                                    </div>
                                </Col>
                                <Col sm={4} className="mt-4">
                                    <h5 className="text-white mb-0">
                                        Chính sách
                                    </h5>
                                    <div className="text-muted mt-3">
                                        <ul className="list-unstyled ff-secondary footer-list">
                                            <li>
                                                <Link href="/">
                                                    Chính sách bảo mật
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/">
                                                    Điều khoản sử dụng
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                {/* <Col sm={4} className="mt-4">
                                    <h5 className="text-white mb-0">Support</h5>
                                    <div className="text-muted mt-3">
                                        <ul className="list-unstyled ff-secondary footer-list">
                                            <li>
                                                <Link href="/pages-faqs">
                                                    FAQ
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/pages-faqs">
                                                    Contact
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Col> */}
                            </Row>
                        </Col>
                    </Row>

                    <Row className="text-center text-sm-start align-items-center mt-5">
                        <Col sm={6}>
                            <div>
                                <p className="copy-rights mb-0">
                                    {new Date().getFullYear()} © MMO Store
                                </p>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-end mt-3 mt-sm-0">
                                <ul className="list-inline mb-0 footer-social-link">
                                    <li className="list-inline-item">
                                        <Link
                                            href="#"
                                            className="avatar-xs d-block"
                                        >
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-facebook-fill"></i>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link
                                            href="#"
                                            className="avatar-xs d-block"
                                        >
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-github-fill"></i>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link
                                            href="#"
                                            className="avatar-xs d-block"
                                        >
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-linkedin-fill"></i>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link
                                            href="#"
                                            className="avatar-xs d-block"
                                        >
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-google-fill"></i>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link
                                            href="#"
                                            className="avatar-xs d-block"
                                        >
                                            <div className="avatar-title rounded-circle">
                                                <i className="ri-dribbble-line"></i>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
