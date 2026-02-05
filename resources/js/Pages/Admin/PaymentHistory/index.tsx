import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import TablePaymentHistory from "./TablePaymentHistory";
import PaymentHistoryFilter from "./PaymentHistoryFilter";

const PaymentHistory = () => {
  const { t } = useTranslation();
  const { paymentHistory, statusConst } = usePage().props as any;

  const fetchData = (
    currentPage: number = 1,
    perPage: number = 10,
    filters?: any
  ) => {
    router.reload({
      only: ["paymentHistory"],
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

  return (
    <React.Fragment>
      <Head title={t("Payment history")} />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <BreadCrumb
            title={t("Payment history")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <div className="mb-4">
                    <PaymentHistoryFilter 
                      onFilter={handleFilter}
                      statusConst={statusConst}
                    />
                  </div>
                  <Row>
                    <Col>
                      <TablePaymentHistory
                        data={paymentHistory || []}
                        onReloadTable={fetchData}
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

PaymentHistory.layout = (page: any) => <Layout children={page} />;
export default PaymentHistory;
