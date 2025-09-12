import React from "react";
import { Col, Container, Row } from "react-bootstrap";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { EffectFade, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Images
import imgpattern from "../../../images/landing/img-pattern.png";

import defaultDemo from "../../../images/demos/default.png";
import saasDemo from "../../../images/demos/saas.png";
import materialDemo from "../../../images/demos/material.png";
import minimalDemo from "../../../images/demos/minimal.png";
import creativeDemo from "../../../images/demos/creative.png";
import modernDemo from "../../../images/demos/modern.png";
import interactiveDemo from "../../../images/demos/interactive.png";
import { Link } from "@inertiajs/react";

const Home = () => {
    return (
        <React.Fragment>
            <section className="section pb-0 hero-section" id="hero">
                <div className="bg-overlay bg-overlay-pattern"></div>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} sm={10}>
                            <div className="text-center mt-lg-5 pt-5">
                                <h1 className="display-6 mb-3 lh-base page-home-title-lg text-gray-title">
                                    <span className="text-success">
                                        MMO STORE{" "}
                                    </span>
                                    - NỀN TẢNG SỞ HỮU WEBSITE <br /> BÁN HÀNG
                                    CHUYÊN NGHIỆP
                                </h1>
                                <p className="lead text-muted lh-base">
                                    MMO Store là nền tảng giúp bạn nhanh chóng
                                    sở hữu website bán hàng chuyên nghiệp để{" "}
                                    <br />
                                    kinh doanh các digital products như tài
                                    nguyên Gmail, tài khoản TikTok Shop, eBay,
                                    Etsy… Chỉ với vài bước đơn giản, bạn có thể
                                    tự xây dựng store cá nhân của riêng mình,
                                    quản lý dễ dàng và bắt đầu tạo thu nhập
                                    online bền vững..
                                </p>
                                <div className="d-flex gap-2 justify-content-center mt-4 mb-4">
                                    <Link
                                        href="/register"
                                        className="btn btn-primary btn-bg-primary border-0"
                                    >
                                        Create a Store{" "}
                                        <i className="ri-add-line align-middle ms-1"></i>
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-4 mt-sm-5 pt-sm-5 mb-sm-n5 demo-carousel">
                                <div className="demo-img-patten-top d-none d-sm-block">
                                    <img
                                        src={imgpattern}
                                        className="d-block img-fluid"
                                        alt="..."
                                    />
                                </div>
                                <div className="demo-img-patten-bottom d-none d-sm-block">
                                    <img
                                        src={imgpattern}
                                        className="d-block img-fluid"
                                        alt="..."
                                    />
                                </div>
                                <Swiper
                                    spaceBetween={30}
                                    effect={"fade"}
                                    loop={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    autoplay={{
                                        delay: 2000,
                                        disableOnInteraction: false,
                                    }}
                                    modules={[EffectFade, Autoplay]}
                                    className="mySwiper"
                                >
                                    <SwiperSlide className="carousel-inner shadow-lg p-2 bg-white rounded">
                                        <img
                                            src={defaultDemo}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </SwiperSlide>
                                    <SwiperSlide className="carousel-inner shadow-lg p-2 bg-white rounded">
                                        <img
                                            src={saasDemo}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </SwiperSlide>
                                    <SwiperSlide className="carousel-inner shadow-lg p-2 bg-white rounded">
                                        <img
                                            src={materialDemo}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </SwiperSlide>
                                    <SwiperSlide className="carousel-inner shadow-lg p-2 bg-white rounded">
                                        <img
                                            src={minimalDemo}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </SwiperSlide>
                                    <SwiperSlide className="carousel-inner shadow-lg p-2 bg-white rounded">
                                        <img
                                            src={creativeDemo}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </SwiperSlide>
                                    <SwiperSlide className="carousel-inner shadow-lg p-2 bg-white rounded">
                                        <img
                                            src={modernDemo}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </SwiperSlide>
                                    <SwiperSlide className="carousel-inner shadow-lg p-2 bg-white rounded">
                                        <img
                                            src={interactiveDemo}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <div className="position-absolute start-0 end-0 bottom-0 hero-shape-svg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        viewBox="0 0 1440 120"
                    >
                        <g mask='url("#SvgjsMask1003")' fill="none">
                            <path d="M 0,118 C 288,98.6 1152,40.4 1440,21L1440 140L0 140z"></path>
                        </g>
                    </svg>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Home;
