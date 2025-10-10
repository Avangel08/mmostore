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
import { ModalSettingPayment } from "./Modal/ModalSettingPayment";
import axios from "axios";

const PaymentHistory = () => {
  const { t } = useTranslation();
  const { paymentHistories, listBank, paymentMethod } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const params = useQueryParams();
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
    router.reload({
      only: ["paymentHistories"],
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
      const response = await axios.get(route("seller.payment-history.edit"));
      setDataEdit(response.data.paymentMethod);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching payment method:", error);
    }
  };

  useEffect(() => {
    if (paymentMethod) {
      setDataEdit(paymentMethod);
    }
  }, [paymentMethod]);

  return (
    <React.Fragment>
      <Head title={t("Payment History")} />
      <div className="page-content">
        <ToastContainer />
        <ModalSettingPayment
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          dataEdit={dataEdit}
          listBank={listBank}
        />
        <Container fluid>
          <BreadCrumb
            title={t("Payment History")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Filter onFilter={handleFilter} />
                  <Row style={{ marginBottom: "32px" }}>
                    <Col>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          onClick={openModalEdit}
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          {t("Setting Payment")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TableCategory
                        data={paymentHistories || []}
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
