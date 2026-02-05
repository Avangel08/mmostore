import React from "react"
import { Accordion, Card, Col, Container, Row } from "react-bootstrap"

import product12 from "../../../../../../images/products/product12.png"
import { Link } from "@inertiajs/react"


const projectLists = [
    {
        label: "Gmail Việt Nam Đã Ngâm 1-20 Ngày Dùng Siêu Trâu Chưa Qua Dịch Vụ, Giá Rẻ",
        image: product12,
        description: "Gmail Việt Nam Đã Ngâm 1-20 Ngày Dùng Siêu Trâu Chưa Qua Dịch Vụ, Giá Siêu Rẻ, Mua SLL ib Shop Để Được Giảm Giá",
        price: "2.500đ - 10.000đ",
        quantity: 1000
    },
    {
        label: "Gmail Việt Nam Đã Ngâm 1-20 Ngày Dùng Siêu Trâu Chưa Qua Dịch Vụ, Giá Rẻ",
        image: product12,
        description: "Gmail Việt Nam Đã Ngâm 1-20 Ngày Dùng Siêu Trâu Chưa Qua Dịch Vụ, Giá Siêu Rẻ, Mua SLL ib Shop Để Được Giảm Giá",
        price: "2.500đ - 10.000đ",
        quantity: 1000
    },
    {
        label: "Gmail Việt Nam Đã Ngâm 1-20 Ngày Dùng Siêu Trâu Chưa Qua Dịch Vụ, Giá Rẻ",
        image: product12,
        description: "Gmail Việt Nam Đã Ngâm 1-20 Ngày Dùng Siêu Trâu Chưa Qua Dịch Vụ, Giá Siêu Rẻ, Mua SLL ib Shop Để Được Giảm Giá",
        price: "2.500đ - 10.000đ",
        quantity: 1000
    }
]

const List = () => {
    return (
        <React.Fragment>
            <div className="product-content">
                <Container fluid className="custom-container">
                    <Row>
                        <Col lg={2}>
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
                                {(projectLists || []).map((item: any, index: any) => (
                                    <React.Fragment key={index}>
                                        <Col xxl={6} sm={6} className="project-card">
                                            <Card className="card-height-100">
                                                <Card.Body>
                                                    <div className="d-flex flex-column">
                                                        <div className="d-flex mb-2">
                                                            <div className="flex-shrink-0 me-3">
                                                                <div className="avatar-xxl">
                                                                    <span className={"avatar-title bg-success-subtle rounded p-2"}>
                                                                        <img src={product12} alt="" className="img-fluid p-1" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h5 className="mb-1 fs-15">
                                                                    <div className="text-success fs-12 mb-1">Sản phẩm : Gmail</div>
                                                                    <Link href="/apps-projects-overview" className="text-body">{item.label}</Link>
                                                                </h5>
                                                                <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                                                                    <div className="text-muted fs-16">
                                                                        <span className="mdi mdi-star text-warning"></span>
                                                                        <span className="mdi mdi-star text-warning"></span>
                                                                        <span className="mdi mdi-star text-warning"></span>
                                                                        <span className="mdi mdi-star text-warning"></span>
                                                                        <span className="mdi mdi-star text-warning"></span>
                                                                    </div>
                                                                    <div className="text-muted">
                                                                        ( 5.50k Customer Review )
                                                                    </div>
                                                                </div>

                                                                <p className="text-muted text-truncate-two-lines mt-1 mb-2">{item.description}</p>
                                                                <div className="d-flex align-items-end justify-content-between">
                                                                    <div>
                                                                        <span className="text-center">
                                                                            Tồn kho: 1000
                                                                        </span>
                                                                        <div className="mt-1 fw-bolder">
                                                                            <span>{item.price}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <button type="button" className="btn btn-sm btn-success">Mua</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </React.Fragment>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default List;