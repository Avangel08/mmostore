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
                                    {t("Frequently Asked Questions")} (FAQ)
                                </h3>
                                <p className="text-muted mb-4 ff-secondary">
                                    {t("Find quick answers to all your questions about using the platform, purchasing plans, updates, and support from the MMO Store team.")}
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
                                            {t("What is MMO Shop")}
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col1}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            {t("txtQuestionsWhatIsMMO")}
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
                                            {t("Is MMO Shop suitable for beginners?")}
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col2}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            {t("txtQuestionsBeginners")}
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
                                            {t("What are the benefits of using MMO Shop for management?")}
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col3}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            - {t("Create a website in 5 minutes: Choose a template, add products, connect payment – your site is ready to go instantly.")}<br />
                                            - {t("SEO & Google-friendly: Optimized loading speed, user-friendly URLs, and easy to rank in search results.")}<br />
                                            - {t("Smart reporting & management: Track revenue, inventory, and customer behavior – all clearly displayed on your dashboard.")}<br />
                                            - {t("Dedicated support & consulting: Experienced MMO team assists you from design to operation.")}
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
                                            {t("Does MMO Shop help me optimize SEO for my website?")}
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col4}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            {t("txtQuestionsOptimizeSEO")}
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
                                            {t("Does MMO Shop have order and customer management features?")}
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col9}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            {t("txtQuestionsFeatures")}
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
                                            {t("Does MMO Shop offer a trial plan?")}
                                        </button>
                                    </h2>
                                    <Collapse
                                        in={col10}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body ff-secondary">
                                            {t("txtQuestionsTrialPlan")}
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
