import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import TableCategory from "./TableCategory";
import { useQueryParams } from "../../../hooks/useQueryParam";
import Filter from "./Filter";
import axios from "axios";

const PaymentHistory = () => {
  const { t } = useTranslation();
  const { paymentHistories } = usePage().props;
  const params = useQueryParams();
  
  // Store current filters in state
  const [currentFilters, setCurrentFilters] = useState<any>({
    name: params?.name || "",
    createdDateStart: params?.createdDateStart || "",
    createdDateEnd: params?.createdDateEnd || "",
  });
  
  const buildQuery = (p: any = {}) => ({
    page: Number(p.page || 1),
    perPage: Number(p.perPage || 10),
    search: p.name || "",
    start_time: p.createdDateStart || "",
    end_time: p.createdDateEnd || "",
  });

  const fetchData = (
    currentPage: number = 1,
    perPage: number = 10,
    filters?: any
  ) => {
    const queryData = buildQuery({
      page: currentPage,
      perPage: perPage,
      ...(filters || currentFilters),
    });
    
    router.reload({
      only: ["paymentHistories"],
      data: queryData,
    });
  };

  const handleFilter = (
    currentPage: number = 1,
    perPage: number = 10,
    filters: any
  ) => {
    setCurrentFilters(filters);
    fetchData(currentPage, perPage, filters);
  };
  
  const handlePagination = (page: number, perPage: number) => {
    fetchData(page, perPage, currentFilters);
  };
  
  return (
    <React.Fragment>
      <Head title={t("Payment History")} />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <BreadCrumb
            title={t("Payment History")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Filter onFilter={handleFilter} currentFilters={currentFilters} />
                  <Row style={{ marginBottom: "15px" }}>
                    <Col>
                      <div className="d-flex gap-2">
                       {/* Button */}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TableCategory
                        data={paymentHistories || []}
                        onReloadTable={handlePagination}
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
