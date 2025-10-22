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
import { ModalDeposit } from "./Modal/ModalDeposit";

const CustomerManager = () => {
  const { t } = useTranslation();
  const { customers, paymentMethods, listPaymentType } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [showModalDeposit, setShowModalDeposit] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [dataDeposit, setDataDeposit] = useState<any>(null);
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

  const openModalEdit = async (id: number | string) => {
    try {
      const response = await axios.get(route("seller.customer-manager.edit", { id }));
      setDataEdit(response.data.data);
      setShowModal(true);
    } catch (error) {
    }
  };

  const openModalDeposit = async (id: number | string) => {
    
    const response = await axios.get(route("seller.customer-manager.edit", { id })).then((response) => {
      setDataDeposit(response.data.data);
      setShowModalDeposit(true);
    }).catch((error) => {
    });
  };

  return (
    <React.Fragment>
      <Head title={t("Customer")} />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <BreadCrumb
            title={t("Customer")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Filter onFilter={handleFilter} />
                  <Row>
                    <Col>
                      <TableCustomerManager
                        data={customers || []}
                        onReloadTable={fetchData}
                        onDeposit={openModalDeposit}
                        onEdit={openModalEdit}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Deposit Modal */}
      <ModalDeposit
        show={showModalDeposit}
        onHide={() => setShowModalDeposit(false)}
        dataEdit={dataDeposit}
        paymentMethods={paymentMethods}
        listPaymentType={listPaymentType}
      />
    </React.Fragment>
  );
};

CustomerManager.layout = (page: any) => <Layout children={page} />;
export default CustomerManager;
