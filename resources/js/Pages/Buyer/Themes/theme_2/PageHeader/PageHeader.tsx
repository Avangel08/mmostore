import React from "react";
import { Col, Container, Row } from "react-bootstrap";

// import image
import hero from "../../../../../../images/hero/hero_1.png";

const PageHeader = ({ title }: { title: string }) => {
    return (
        <React.Fragment>
            <section className="section job-hero-section pb-5" id="hero">
                <Container fluid className="custom-container">
                    <div className="page-header p-4" style={{ background: "rgba(250, 250, 251, 1)" }}>
                        <Row className="justify-content-between align-items-center box-shadow border px-4 border-dark rounded-lg">
                            <Col lg={8} className="justify-content-between align-items-center">
                                <div>
                                    <h3 className="display-8 fw-semibold text-capitalize mb-3 lh-base">
                                        {title}
                                    </h3>
                                    <p className="lh-base mb-4">
                                        AccsMarket offers verified Outlook accounts for businesses, maketers, and automation users. They are useful for email marketing, secure communication, bulk registrations, and managing multiple online services.
                                    </p>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <img className="w-100" src={hero} alt="" />
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
        </React.Fragment>
    )
}

export default PageHeader;