import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { ModalDetail } from "../UserManager/ModalDetail";
import Table from "../UserManager/Table";

const UserManager = () => {
    const { t } = useTranslation();
    const titleWeb = t("User manager") + " - Admin";
    const { users } = usePage().props;
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [dataEdit, setDataEdit] = useState<any>(null);

    const onReloadTable = (currentPage: number = 1, perPage: number = 10) => {
        router.reload({
            only: ["users"],
            data: { page: currentPage, perPage },
        });
    };

    const openModalEdit = (id: number | string) => {
        router.reload({
            only: ["detail"],
            data: { id },
            replace: true,
            onSuccess: (page) => {
                setDataEdit(page.props.detail);
                setIsOpenEditModal(true);
            },
        });
    };

    const toggleOpenAddModal = () => {
        setIsOpenAddModal((prevState) => !prevState);
    };

    const toggleOpenEditModal = () => {
        setIsOpenEditModal((prevState) => !prevState);
    };

    return (
        <React.Fragment>
            <Head title={ titleWeb } />
            <div className="page-content">
                <ToastContainer />
                <ModalDetail show={ isOpenAddModal } onHide={ toggleOpenAddModal } />
                <ModalDetail
                    show={ isOpenEditModal }
                    onHide={ toggleOpenEditModal }
                    dataEdit={ dataEdit }
                />
                <Container fluid>
                    <BreadCrumb title={ t("User") } pageTitle={ t("Homepage") } />
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <Card.Header>
                                    <h5 className="card-title mb-0">{ t("User") }</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row style={{ marginBottom: "32px" }}>
                                        <Col>
                                            <Button variant="success" onClick={ toggleOpenAddModal }>
                                                <i className="ri-add-line align-bottom me-1"></i>{" "} {t("Add")}
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Table data={ users } onReloadTable={ onReloadTable } onEdit={ openModalEdit } />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

UserManager.layout = (page: any) => <Layout children={page} />;

export default UserManager;
