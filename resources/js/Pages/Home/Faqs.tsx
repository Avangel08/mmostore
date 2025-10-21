import React, { useState } from "react";
import { Col, Container, Row, Collapse } from "react-bootstrap";
import classnames from "classnames";

const Faqs = () => {
    const [col1, setcol1] = useState<boolean>(true);
    const [col2, setcol2] = useState<boolean>(false);
    const [col3, setcol3] = useState<boolean>(false);
    const [col4, setcol4] = useState<boolean>(false);

    const [col9, setcol5] = useState<boolean>(false);
    const [col10, setcol6] = useState<boolean>(false);
    const [col11, setcol7] = useState<boolean>(false);
    const [col12, setcol8] = useState<boolean>(false);

    const t_col1 = () => {
        setcol1(!col1);
        setcol2(false);
        setcol3(false);
        setcol4(false);
    };

    const t_col2 = () => {
        setcol2(!col2);
        setcol1(false);
        setcol3(false);
        setcol4(false);
    };

    const t_col3 = () => {
        setcol3(!col3);
        setcol1(false);
        setcol2(false);
        setcol4(false);
    };

    const t_col4 = () => {
        setcol4(!col4);
        setcol1(false);
        setcol2(false);
        setcol3(false);
    };

    const t_col5 = () => {
        setcol5(!col9);
        setcol6(false);
        setcol7(false);
        setcol8(false);
    };

    const t_col6 = () => {
        setcol6(!col10);
        setcol7(false);
        setcol8(false);
        setcol5(false);
    };

    const t_col7 = () => {
        setcol7(!col11);
        setcol5(false);
        setcol6(false);
        setcol8(false);
    };

    const t_col8 = () => {
        setcol8(!col12);
        setcol5(false);
        setcol6(false);
        setcol7(false);
    };

    return (
        <React.Fragment>
            <section className="section" id="faqs">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h3 className="mb-3 fw-semibold">
                                    Câu hỏi thường gặp?
                                </h3>
                                <p className="text-muted mb-4 ff-secondary">
                                    Tìm câu hỏi và câu trả lời liên quan đến hệ
                                    thống thiết kế <br /> mua, cập nhật và hỗ
                                    trợ.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="d-flex align-items-center mb-2">
                                <div className="flex-shrink-0 me-1">
                                    <i className="ri-question-line fs-24 align-middle text-success me-1"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mb-0 fw-semibold">
                                        General Questions
                                    </h5>
                                </div>
                            </div>
                            <div
                                className="accordion custom-accordionwithicon custom-accordion-border accordion-border-box"
                                id="genques-accordion"
                            >
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="genques-headingOne"
                                    >
                                        <button
                                            className={classnames(
                                                "accordion-button",
                                                "fw-medium",
                                                { collapsed: !col1 }
                                            )}
                                            type="button"
                                            onClick={t_col1}
                                            style={{ cursor: "pointer" }}
                                        >
                                            MMO Shop là gì ?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col1}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            MMO Shop là nền tảng quản lý Tiktok
                                            Shop chuyên nghiệp, Giúp bạn dễ dàng
                                            tạo, vận hành và quản lý hàng nghìn
                                            shop chỉ trên một giao diện duy
                                            nhất.
                                        </div>
                                    </Collapse>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="genques-headingTwo"
                                    >
                                        <button
                                            className={classnames(
                                                "accordion-button",
                                                "fw-medium",
                                                { collapsed: !col2 }
                                            )}
                                            type="button"
                                            onClick={t_col2}
                                            style={{ cursor: "pointer" }}
                                        >
                                            MMO Shop có gì nổi bật?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col2}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            A story can have as many themes as
                                            the reader can identify based on
                                            recurring patterns and parallels
                                            within the story itself. In looking
                                            at ways to separate themes into a
                                            hierarchy, we might find it useful
                                            to follow the example of a single
                                            book.
                                        </div>
                                    </Collapse>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="genques-headingThree"
                                    >
                                        <button
                                            className={classnames(
                                                "accordion-button",
                                                "fw-medium",
                                                { collapsed: !col3 }
                                            )}
                                            type="button"
                                            onClick={t_col3}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Lợi ích khi sử dụng MMO Shop để
                                            quản lý Tiktok Shop?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col3}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Theme features is a set of specific
                                            functionality that may be enabled by
                                            theme authors. Themes must register
                                            each individual Theme Feature that
                                            the author wishes to support. Theme
                                            support functions should be called
                                            in the theme's functions.
                                        </div>
                                    </Collapse>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="genques-headingFour"
                                    >
                                        <button
                                            className={classnames(
                                                "accordion-button",
                                                "fw-medium",
                                                { collapsed: !col4 }
                                            )}
                                            type="button"
                                            onClick={t_col4}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Tại sao chọn MMO Shop để quán lý
                                            shop thay vì các công cụ khác?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col4}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Simple is a free WordPress theme, by
                                            Themify, built exactly what it is
                                            named for: simplicity. Immediately
                                            upgrade the quality of your
                                            WordPress site with the simple theme
                                            To use the built-in Chrome theme
                                            editor.
                                        </div>
                                    </Collapse>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="genques-headingFour"
                                    >
                                        <button
                                            className={classnames(
                                                "accordion-button",
                                                "fw-medium",
                                                { collapsed: !col9 }
                                            )}
                                            type="button"
                                            onClick={t_col5}
                                            style={{ cursor: "pointer" }}
                                        >
                                            MMO Shop có an toàn để quản lý Tiktok Shop không?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col9}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Simple is a free WordPress theme, by
                                            Themify, built exactly what it is
                                            named for: simplicity. Immediately
                                            upgrade the quality of your
                                            WordPress site with the simple theme
                                            To use the built-in Chrome theme
                                            editor.
                                        </div>
                                    </Collapse>
                                </div>
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="genques-headingFour"
                                    >
                                        <button
                                            className={classnames(
                                                "accordion-button",
                                                "fw-medium",
                                                { collapsed: !col10 }
                                            )}
                                            type="button"
                                            onClick={t_col6}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Làm sao để bắt đầu quản lý shop với MMO Shop?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col10}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Simple is a free WordPress theme, by
                                            Themify, built exactly what it is
                                            named for: simplicity. Immediately
                                            upgrade the quality of your
                                            WordPress site with the simple theme
                                            To use the built-in Chrome theme
                                            editor.
                                        </div>
                                    </Collapse>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Faqs;
