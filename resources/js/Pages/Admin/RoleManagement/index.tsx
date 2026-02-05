import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import TableRole from "./TableRole";
import { ToastContainer } from "react-toastify";
import { ModalDetailRole } from "./ModalDetailRole";

const RoleManagement = () => {
  const { t } = useTranslation();
  const { roles } = usePage().props;
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);

  const onReloadTable = (currentPage: number = 1, perPage: number = 10) => {
    router.reload({
      only: ["roles"],
      data: { page: currentPage, perPage },
    });
  };

  const openModalEdit = (id: number | string) => {
    router.reload({
      only: ["detailRole"],
      data: { id },
      replace: true,
      onSuccess: (page) => {
        setDataEdit(page.props.detailRole);
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
      <Head title={t("Role")  + " - Admin" } />
      <div className="page-content">
        <ToastContainer />
        <ModalDetailRole show={isOpenAddModal} onHide={toggleOpenAddModal} />
        <ModalDetailRole 
          show={isOpenEditModal} 
          onHide={toggleOpenEditModal} 
          dataEdit={dataEdit}
        />
        <Container fluid>
          <BreadCrumb title={t("Role")} pageTitle={t("Homepage")} />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Row style={{ marginBottom: "32px" }}>
                    <Col>
                      <Button variant="success" onClick={toggleOpenAddModal}>
                        <i className="ri-add-line align-bottom me-1"></i>{" "}
                        {t("Add role")}
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TableRole data={roles} onReloadTable={onReloadTable} onEdit={openModalEdit} />
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

RoleManagement.layout = (page: any) => <Layout children={page} />;
export default RoleManagement;
