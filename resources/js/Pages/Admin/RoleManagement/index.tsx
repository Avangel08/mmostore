import { Head } from "@inertiajs/react";
import React from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import AllTasks from "../../Tasks/TaskList/AllTasks";

const RoleManagement = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Head title={t("Role Management")} />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={t("Role Management")} pageTitle={t("Homepage")} />
          <Row>
            <Col xs={12}>
            "abc"
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

RoleManagement.layout = (page: any) => <Layout children={page} />;
export default RoleManagement;
