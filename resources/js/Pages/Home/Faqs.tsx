import React, { useState } from "react";
import { Col, Container, Row, Collapse } from "react-bootstrap";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

const Faqs = () => {
    const { t } = useTranslation();
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
                                    CÂU HỎI THƯỜNG GẶP (FAQ)
                                </h3>
                                <p className="text-muted mb-4 ff-secondary">
                                    Tìm câu trả lời nhanh cho mọi thắc mắc của bạn về cách sử dụng, mua gói, cập nhật và hỗ trợ từ đội ngũ MMO Store.
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
                                        {t("General Questions")}
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
                                            MMO Store là nền tảng xây dựng website bán hàng chuyên biệt cho sản phẩm số, giúp bạn dễ dàng bán tài nguyên kỹ thuật số như: Gmail, tài khoàn Facebook, tài khoản Tiktok, tài khoản Telegram,... Tạo shop bán hàng online trong 5 phút, hỗ trợ các nền tảng như WooCommerce, Shopify, Sapo Web và Zozo Web Sale.
                                            Bạn có thể dễ dàng xây dựng website riêng, quản lý sản phẩm số, xử lý đơn hàng, chăm sóc khách hàng và theo dõi hiệu quả bán hàng trên một giao diện duy nhất.
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
                                            MMO Shop có phù hợp cho người mới bắt đầu không?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col2}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Hoàn toàn phù hợp!
                                            Giao diện trực quan, thao tác kéo – thả, mẫu website có sẵn giúp bạn tạo shop MMO riêng mà không cần kỹ năng kỹ thuật.
                                            Chỉ vài phút là bạn đã có một trang bán hàng hoàn chỉnh, tối ưu SEO và sẵn sàng hoạt động.
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
                                            Lợi ích khi sử dụng MMO Shop để quản lý là gì?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col3}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            - Tạo website trong 5 phút: Chọn giao diện, thêm sản phẩm, kết nối thanh toán – website sẵn sàng hoạt động ngay.
                                            - Chuẩn SEO – Chuẩn Google: Tối ưu tốc độ tải, URL thân thiện, dễ lên top tìm kiếm.
                                            - Báo cáo & quản lý thông minh: Thống kê doanh thu, tồn kho, hành vi khách hàng – tất cả hiển thị rõ ràng trên dashboard.
                                            - Hỗ trợ & tư vấn tận tâm: Đội ngũ MMO chuyên môn cao, hỗ trợ từ thiết kế đến vận hành.
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
                                            MMO Shop có giúp tôi tối ưu SEO cho website không?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col4}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Có! MMO Shop được tích hợp các công cụ SEO thân thiện, giúp website của bạn dễ dàng lên top tìm kiếm Google. Từ việc tạo URL thân thiện, tối ưu tốc độ tải trang cho đến thêm từ khóa và meta tag – tất cả đều được hỗ trợ tự động.
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
                                            MMO Shop có tính năng quản lý đơn hàng và khách hàng không?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col9}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Có. Bạn có thể xử lý đơn hàng, gửi sản phẩm, theo dõi khách hàng và doanh thu ngay trong một dashboard.
                                            Hệ thống báo cáo chi tiết giúp bạn nắm bắt tình hình kinh doanh theo thời gian thực, mà không cần dùng thêm công cụ ngoài.
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
                                            MMO Shop có gói dùng thử không?
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col10}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            Có. Bạn có thể tạo shop miễn phí trong 5 phút, trải nghiệm toàn bộ tính năng trước khi nâng cấp lên gói trả phí để mở khóa các tiện ích nâng cao như SEO chuyên sâu, tích hợp thanh toán tự động và tùy chỉnh giao diện mở rộng.
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
