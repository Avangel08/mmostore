import { Head, router, usePage } from "@inertiajs/react";
import React from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import TableRole from "./TableRole";

const RoleManagement = () => {
  const { t } = useTranslation();
  const { roles } = usePage().props;
  console.log(roles);

  return (
    <React.Fragment>
      <Head title={t("Role Management")} />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={t("Role Management")} pageTitle={t("Homepage")} />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">{t("Role Management")}</h5>
                </Card.Header>
                <Card.Body>
                  <TableRole data={roles} />
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
