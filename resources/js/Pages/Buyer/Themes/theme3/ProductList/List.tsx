import React from "react"
import { Accordion, Card, Col, Container, Row } from "react-bootstrap"

const List = () => {
    return (
        <React.Fragment>
            <div className="product-content">
                <Container fluid className="custom-container">
                    <Row>
                        <Col lg={2} className="pe-3">
                            <Accordion defaultActiveKey="1">
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>
                                        <span className="text-muted text-uppercase fs-12 fw-medium p-0">
                                            Chọn mục sản phẩm
                                        </span>{" "}
                                        <span className="badge bg-success rounded-pill align-middle ms-1">
                                            2
                                        </span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div
                                            id="flush-collapseBrands"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="flush-headingBrands"
                                        >
                                            <div className="text-body pt-0">
                                                <div className="search-box search-box-sm">
                                                    <input
                                                        type="text"
                                                        className="form-control bg-light border-0"
                                                        placeholder="Search Brands..."
                                                    />
                                                    <i className="ri-search-line search-icon"></i>
                                                </div>
                                                <div className="d-flex flex-column gap-2 mt-3">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="productBrandRadio5"
                                                            defaultChecked
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="productBrandRadio5"
                                                        >
                                                            Boat
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="productBrandRadio4"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="productBrandRadio4"
                                                        >
                                                            OnePlus
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="productBrandRadio3"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="productBrandRadio3"
                                                        >
                                                            Realme
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="productBrandRadio2"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="productBrandRadio2"
                                                        >
                                                            Sony
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="productBrandRadio1"
                                                            defaultChecked
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="productBrandRadio1"
                                                        >
                                                            JBL
                                                        </label>
                                                    </div>

                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                                                        >
                                                            1,235 More
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                        <Col lg={10}>
                            <Row>
                                <Col xxl={3} sm={6} className="project-card">
                                    <Card className="card-height-100">
                                        <Card.Body>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex"></div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default List;