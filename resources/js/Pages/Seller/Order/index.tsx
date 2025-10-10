import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import Table from "./Table";
import { useQueryParams } from "../../../hooks/useQueryParam";
import Filter from "./Filter";
import axios from "axios";

const Order = () => {
  const { t } = useTranslation();
  const { orders, categories, products } = usePage().props;
  
  const [ showModal, setShowModal ] = useState(false);
  const [ dataEdit, setDataEdit ] = useState<any>(null);
  const params = useQueryParams();
  const buildQuery = (p: any = {}) => ({
    page: Number(p.page || 1),
    perPage: Number(p.perPage || 10),
    search: p.search || "",
    date_from: p.createdDateStart || "",
    date_to: p.createdDateEnd || "",
    status: p.status || "",
    payment_status: p.payment_status || "",
    category_id: p.category_id || "",
    product_id: p.product_id || "",
  });

  const fetchData = (
      currentPage: number = 1,
      perPage: number = 10,
      filters?: any
  ) => {
    router.reload({
      only: ["orders"],
      data: buildQuery({
        page: currentPage,
        perPage: perPage,
        ...(filters || {}),
      }),
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
        <Head title={t("Order")} />
        <div className="page-content">
          <ToastContainer />
          <Container fluid>
            <BreadCrumb
                title={t("Order")}
                pageTitle={t("Homepage")}
            />
            <Row>
              <Col xs={12}>
                <Card>
                  <Card.Body>
                    <Filter 
                      onFilter={handleFilter} 
                      categories={categories as Array<{_id: string; name: string}>}
                      products={products as Array<{_id: string; name: string; category_id: string; category?: {_id: string; name: string}}>}
                    />
                    <Row>
                      <Col>
                        <Table
                            data={ orders || [] }
                            onReloadTable={ fetchData }
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

Order.layout = (page: any) => <Layout children={page} />;
export default Order;
