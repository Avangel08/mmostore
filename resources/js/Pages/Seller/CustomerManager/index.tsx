import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import TableCustomerManager from "./TableCustomerManager";
import { useQueryParams } from "../../../hooks/useQueryParam";
import Filter from "./Filter";
import axios from "axios";

const CustomerManager = () => {
  const { t } = useTranslation();
  const { customers } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const params = useQueryParams();
  const buildQuery = (p: any = {}) => ({
    page: Number(p.page || 1),
    perPage: Number(p.perPage || 10),
    search: p.search || "",
    start_time: p.createdDateStart || "",
    end_time: p.createdDateEnd || "",
  });

  const fetchData = (
    currentPage: number = 1,
    perPage: number = 10,
    filters?: any
  ) => {
    router.reload({
      only: ["customers"],
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

  const openModalEdit = async () => {
    try {
      const response = await axios.get(route("seller.customer-manager.edit"));
      setDataEdit(response.data.customer);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching payment method:", error);
    }
  };

  return (
    <React.Fragment>
      <Head title={t("Customer Manager")} />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <BreadCrumb
            title={t("Customer Manager")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">{t("Customer Manager")}</h5>
                </Card.Header>
                <Card.Body>
                  <Filter onFilter={handleFilter} />
                  <Row>
                    <Col>
                      <TableCustomerManager
                        data={customers || []}
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

CustomerManager.layout = (page: any) => <Layout children={page} />;
export default CustomerManager;
