import React, { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";

// Import Images
import imgTheme1 from "../../../images/landing/showcase/theme-store-1.png";
import imgTheme2 from "../../../images/landing/showcase/theme-store-2.png";
import imgTheme3 from "../../../images/landing/showcase/theme-store-3.png";
import imgThemeDark1 from "../../../images/landing/showcase/theme-store-dark-1.png";
import imgThemeDark2 from "../../../images/landing/showcase/theme-store-dark-2.png";
import imgThemeDark3 from "../../../images/landing/showcase/theme-store-dark-3.png";

const Showcase = () => {
    return (
        <React.Fragment>
            <section className="section bg-light" id="marketplace">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h2 className="mb-3 lh-base display-6 page-home-title-md text-gray-title">
                                    SELECT THEME
                                </h2>
                            </div>
                        </Col>
                    </Row>
                    <div className="showcase-grid">
                        <div className="card showcase-box card-animate theme-bg-primary">
                            <div className="showcase-img">
                                <img
                                    src={imgTheme1}
                                    alt=""
                                    className="card-img-top explore-img"
                                />
                            </div>
                        </div>
                        <div className="card showcase-box card-animate theme-bg-secondary">
                            <div className="showcase-img">
                                <img
                                    src={imgTheme2}
                                    alt=""
                                    className="card-img-top explore-img"
                                />
                            </div>
                        </div>
                        <div className="card showcase-box card-animate theme-bg-success">
                            <div className="showcase-img">
                                <img
                                    src={imgTheme3}
                                    alt=""
                                    className="card-img-top explore-img"
                                />
                            </div>
                        </div>
                        <div className="card showcase-box card-animate theme-bg-primary">
                            <div className="showcase-img">
                                <img
                                    src={imgThemeDark1}
                                    alt=""
                                    className="card-img-top explore-img"
                                />
                            </div>
                        </div>
                        <div className="card showcase-box card-animate theme-bg-secondary">
                            <div className="showcase-img">
                                <img
                                    src={imgThemeDark2}
                                    alt=""
                                    className="card-img-top explore-img"
                                />
                            </div>
                        </div>
                        <div className="card showcase-box card-animate theme-bg-success">
                            <div className="showcase-img">
                                <img
                                    src={imgThemeDark3}
                                    alt=""
                                    className="card-img-top explore-img"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Showcase;
