import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { ModalDetail } from "./ModalDetail";
import UserFilter from "./Filter";
import Table from "../UserManager/Table";
import { showToast } from "../../../utils/showToast";
import PlanFilter from "../Plan/PlanFilter";

const UserManager = () => {
    const { t } = useTranslation();
    const titleWeb = t("User") + " - Admin";
    const { users, message, status, type, verifyStatus } = usePage().props as any;
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [dataEdit, setDataEdit] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
    const handleSelectionChange = (ids: (string | number)[]) => {
        setSelectedIds(ids);
    };

    const handleBulkDelete = () => {
        if (!selectedIds.length) return;
        router.delete(route("admin.user.delete"), {
            data: { ids: selectedIds },
            onSuccess: () => {
                setSelectedIds([]);
                onReloadTable();
            },
        });
    };

    const fetchData = (
        currentPage: number = 1,
        perPage: number = 10,
        filters?: any
    ) => {
        router.reload({
            only: ["users"],
            replace: true,
            data: {
                page: currentPage,
                perPage: perPage,
                ...filters,
            },
        });
    };

    const handleFilter = (
        currentPage: number = 1,
        perPage: number = 10,
        filters: any
    ) => {
        fetchData(currentPage, perPage, filters);
    };

    // Handle flash messages from session
    useEffect(() => {
        if (message?.success) {
            showToast(t(message.success), "success");
        }
        if (message?.error) {
            showToast(t(message.error), "error");
        }
    }, [message]);

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
                                <Card.Body>
                                    <UserFilter onFilter={handleFilter} status={status} type={type} verifyStatus={verifyStatus} />
                                    <Row style={{ marginBottom: "32px" }}>
                                        <Col>
                                            {selectedIds.length > 0 && (
                                                <Button variant="danger" onClick={ handleBulkDelete }>
                                                    <i className="ri-delete-bin-5-line align-bottom me-1"></i>{" "} {t("Delete")}
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Table data={ users } onReloadTable={ onReloadTable } onEdit={ openModalEdit } onSelectionChange={ handleSelectionChange } />
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
