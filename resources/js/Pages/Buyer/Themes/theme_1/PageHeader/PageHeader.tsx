import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import { usePage } from "@inertiajs/react";

import hero from "../../../../../../images/hero/hero.png"

const PageHeader = ({ theme }: any) => {
    const storageUrl = usePage().props.storageUrl as string;

    return (
        <React.Fragment>
            <section className="section job-hero-section pb-3" id="hero" style={{ background: "linear-gradient(180deg, #004577 0%, #122B3D 100%)" }}>
                <Container fluid className="custom-container">
                    <Row className="justify-content-between">
                        <Col lg={2}>
                            <div>
                                <img src={theme?.pageHeaderImage ? `${storageUrl}/${theme.pageHeaderImage}?v=${Date.now()}` : hero} alt="" style={{ width: "100%" }} />
                            </div>
                        </Col>
                        <Col lg={9}>
                            <div className="text-white" dangerouslySetInnerHTML={{ __html: theme?.pageHeaderText }} />
                            {/* <div>
                                <h3 className="display-8 fw-semibold text-capitalize mb-3 lh-base text-white">
                                </h3>
                                <p className="lh-base mb-4 text-white">
                                    <i className="ri-error-warning-line"></i> Mỗi tài khoản MAIL được bán duy nhất và một lần ( Không chia sẻ)
                                </p>
                                <p className="lh-base mb-4 text-white">
                                    <i className="ri-error-warning-line"></i> Nhằm bảo mật phải đúng thiết bị + trình duyệt đã mua mới có thể xem được dữ liệu và tải xuống. Tất cả Dữ liệu đơn hàng sẽ được tự động xóa sau 24h
                                </p>
                                <p className="lh-base mb-4 text-white">
                                    <i className="ri-error-warning-line"></i> Phương pháp đọc email qua IMAP, POP3 và SMTP ko còn khả dụng nữa để truy cập và đọc được tất cả hòm thư gửi về bạn phải sử dụng phương thức
                                    thông qua (OAuth2)
                                </p>
                                <p className="lh-base mb-4 text-white">
                                    <i className="ri-error-warning-line"></i> Chúng tôi đã tích hợp đọc mail qua OAuth2 trên website và API để sử dụng khi mua mail bạn tải full định dạng bao gồm Refresh_token và client_id. Mỗi Refresh_token có thời gian tồn tại là 90 ngày, sau 90 ngày, nếu không được làm mới, Refresh_token sẽ không thể sử dụng được nữa
                                </p>
                            </div> */}
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    )
}

export default PageHeader;