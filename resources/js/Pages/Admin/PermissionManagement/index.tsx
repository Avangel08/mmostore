import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import Layout from "../../../CustomAdminLayouts";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import TablePermission from "./TablePermission";
import { useFormik } from "formik";
import { ModalAddNewGroupPermission } from "./ModalAddNewGroupPermission";
import { ToastContainer } from "react-toastify";

const PermissionManagement = () => {
  const { t } = useTranslation();
  const { groupPermissions } = usePage().props;
  const [isOpenAddModal, setIsOpenAddModal] = React.useState(false);

  const onReloadTable = (currentPage: number = 0, perPage: number = 10) => {
    router.reload({
      only: ["groupPermissions"],
      data: { page: currentPage + 1, perPage },
    });
  };

  const toggleAddModal = () => {
    setIsOpenAddModal((prevState) => !prevState);
  };
  return (
    <React.Fragment>
      <Head title={t("Permission Management")} />
      <div className="page-content">
        <ToastContainer />
        <ModalAddNewGroupPermission show={isOpenAddModal} onHide={toggleAddModal} />
        <Container fluid>
          <BreadCrumb
            title={t("Permission Management")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">
                    {t("List group permission")}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row style={{ marginBottom: "32px" }}>
                    <Col>
                      <Button variant="success" onClick={toggleAddModal}>
                        <i className="ri-add-line align-bottom me-1"></i>{" "}
                        {t("Add group permission")}
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TablePermission
                        data={groupPermissions}
                        onReloadTable={onReloadTable}
                      />
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

PermissionManagement.layout = (page: any) => <Layout children={page} />;
export default PermissionManagement;
