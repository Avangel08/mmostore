import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { useQueryParams } from "../../../hooks/useQueryParam";
import Filter from "./Filter";
import { ModalSettingPayment } from "./Modal/ModalSettingPayment";
import axios from "axios";
import TablePaymentMethod from "./TablePaymentMethod";
import { showToast } from "../../../utils/showToast";
import { confirmDelete } from "../../../utils/sweetAlert";

const PaymentSetting = () => {
  const { t } = useTranslation();
  const { paymentMethods } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [dataOptions, setDataOptions] = useState<any>(null);
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
    start_time: p.createdDateStart || p.start_time || "",
    end_time: p.createdDateEnd || p.end_time || "",
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
      only: ["paymentMethods"],
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

  const openModalEdit = async (id: number | string) => {
    try {
      const response = await axios.get(route("admin.payment-method.edit", { id }));
      setDataEdit(response.data.paymentMethod);
      setDataOptions({
        listTypeOptions: response.data.listTypeOptions,
        listBank: response.data.listBank,
        listBankSePay: response.data.listBankSePay,
        linkWebhook: response.data.linkWebhook,
      });
      setShowModal(true);
    } catch (error) {
    }
  };

  const openModalCreate = async () => {
    try {
      const response = await axios.get(route("admin.payment-method.create"));
      setDataEdit(null);
      setDataOptions({
        listTypeOptions: response.data.listTypeOptions,
        listBank: response.data.listBank,
        listBankSePay: response.data.listBankSePay,
        linkWebhook: response.data.linkWebhook,
      });
      setShowModal(true);
    } catch (error) {
    }
  };

  const onDelete = async (id: number | string, name: any) => {
    if (!id) {
      showToast(t("Invalid ID"), "error");
      return;
    }

    const confirmed = await confirmDelete({
      title: t("Delete payment method '{{name}}'?", { name }),
      text: t("Once deleted, you will not be able to recover it."),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("admin.payment-method.destroy", { id }), {
        replace: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page: any) => {
          if (page.props?.message?.error) {
            showToast(t(page.props.message.error), "error");
            return;
          }
          if (page.props?.message?.success) {
            showToast(t(page.props.message.success), "success");
          }
        },
      });
    }
  };

  return (
    <React.Fragment>
      <Head title={t("Payment Method")} />
      <div className="page-content">
        <ToastContainer />
        <ModalSettingPayment
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          dataEdit={dataEdit}
          dataOptions={dataOptions}
        />
        <Container fluid>
          <BreadCrumb
            title={t("Payment Method")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Filter onFilter={handleFilter} currentFilters={currentFilters} />
                  <Row style={{ marginBottom: "32px" }}>
                    <Col>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          onClick={openModalCreate}
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          {t("Add Payment Method")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TablePaymentMethod
                        data={paymentMethods || []}
                        onReloadTable={handlePagination}
                        onDelete={onDelete}
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
    </React.Fragment>
  );
};

PaymentSetting.layout = (page: any) => <Layout children={page} />;
export default PaymentSetting;
