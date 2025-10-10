import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Props } from ".";
import { FieldArray } from "formik";

const DomainConfig = ({ validation }: Props) => {
    const { t } = useTranslation()
    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <h5 className="card-title">{t("Domain")}<span className="text-danger">*</span></h5>
                    <p className="text-muted fs-14 mb-0">Để website có thể được nhận diện và hiển thị đến người dùng, website luôn phải có một tên miền chính. Chỉ có thể chọn duy nhất một tên miền làm tên miền chính</p>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <FieldArray
                                name="domains"
                                render={(arrayHelpers) => (
                                    <div className="mb-3">
                                        {validation.values.domains.map((domain, index) => (
                                            <Row key={index} className="mb-2">
                                                <Col>
                                                    <Form.Control
                                                        type="text"
                                                        className="form-control"
                                                        id="setting-domain"
                                                        value={domain}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        name={`domains[${index}]`}
                                                        placeholder={t("Enter your domain")}
                                                    />
                                                </Col>
                                                <Col xs="auto">
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => arrayHelpers.remove(index)}
                                                        disabled={validation.values.domains.length === 1}
                                                    >
                                                        <i className="ri-indeterminate-circle-line"></i>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button
                                            variant="secondary"
                                            onClick={() => arrayHelpers.push("")}
                                            disabled
                                        >
                                            <i className="ri-add-circle-line"></i>{" "}{t("Add domain")}
                                        </Button>
                                    </div>
                                )}
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </React.Fragment >
    )
}

export default DomainConfig;