import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import { Card, Col, Container, Row, Nav, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "../../../CustomSellerLayouts";
import ThemeConfigs from "./themeConfig";
import DomainConfig from "./domainConfig";
import ContactConfig from "./contactConfig";
import NotificationConfig from "./notificationConfig";
import MenuConfig from "./menuConfig";

const ThemeSettings = () => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<"themeTab" | "contactTab" | "domainTab" | "notificationTab">("themeTab")

    return (
        <React.Fragment>
            <Head title={t("Theme setting")} />
            <div className="page-content">
                <ToastContainer />
                <Container fluid>
                    <BreadCrumb
                        title={t("Theme setting")}
                        pageTitle={t("Homepage")}
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <Card.Body>
                                    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab((k as any) || "themeTab")}>
                                        <Nav variant="tabs" className="nav-tabs-custom">
                                            <Nav.Item>
                                                <Nav.Link eventKey="themeTab">
                                                    <i className="ri-store-2-line me-1"></i>
                                                    {t("Giao diện")}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="contactTab">
                                                    <i className="ri-phone-line me-1"></i>
                                                    {t("Liên hệ")}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="domainTab">
                                                    <i className="ri-global-line me-1"></i>
                                                    {t("Domain")}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="notificationTab">
                                                    <i className="ri-notification-3-line me-1"></i>
                                                    {t("Notification")}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="menuTab">
                                                    <i className="ri-menu-line me-1"></i>
                                                    {t("Menu")}
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        <Tab.Content className="mt-4">
                                            <Tab.Pane eventKey="themeTab">
                                                <ThemeConfigs activeTab={activeTab} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="contactTab">
                                                <ContactConfig activeTab={activeTab} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="domainTab">
                                                <DomainConfig activeTab={activeTab} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="notificationTab">
                                                <NotificationConfig activeTab={activeTab} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="menuTab">
                                                <MenuConfig activeTab={activeTab} />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

ThemeSettings.layout = (page: any) => <Layout children={page} />;
export default ThemeSettings;