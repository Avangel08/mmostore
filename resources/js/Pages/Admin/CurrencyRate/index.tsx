import { useTranslation } from "react-i18next";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Filter from "./CurrencyRateFilter";
import { useQueryParams } from "../../../hooks/useQueryParam";
import axios from "axios";
import { showToast } from "../../../utils/showToast";
import { confirmDelete } from "../../../utils/sweetAlert";
import TableCurrencyRate from "./TableCurrencyRate";
import { ModalCurrencyRate } from "./Modal/ModalCurrencyRate";
import Layout from "../../../CustomAdminLayouts";

const CurrencyRatePage = () => {
  const { t } = useTranslation();
  const { currencyRates } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [dataOptions, setDataOptions] = useState<any>(null);

  const fetchData = (
    page: number = 1,
    perPage: number = 10,
    filters?: any
  ) => {
    router.reload({
      only: ["currencyRates"],
      data: {
        page: page,
        perPage: perPage,
        ...(filters || {}),
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

  const openModalEdit = async (id: number | string) => {
    try {
      const response = await axios.get(route("admin.currency-rates.edit", { id }));
      setDataEdit(response.data.currencyRate);
      setDataOptions({
        statusList: response.data.statusList,
      });
      setShowModal(true);
    } catch (error) {
    }
  };

  const openModalCreate = async () => {
    try {
      const response = await axios.get(route("admin.currency-rates.create"));
      setDataEdit(null);
      setDataOptions({
        statusList: response.data.statusList,
      });
      setShowModal(true);
    } catch (error) {
    }
  };

  const onDelete = async (id: number | string, rate?: number | string) => {
    if (!id) {
      showToast(t("Invalid ID"), "error");
      return;
    }

    const confirmed = await confirmDelete({
      title: t("Delete rate {{rate}}?", { rate: rate || "" }),
      text: t("Once deleted, you will not be able to recover it."),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("admin.currency-rates.destroy", { id }), {
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
      <Head title={t("Currency Rate")} />
      <div className="page-content">
        <ToastContainer />
        <ModalCurrencyRate
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setDataEdit(null);
          }}
          dataEdit={dataEdit}
          dataOptions={dataOptions}
        />
        <Container fluid>
          <BreadCrumb
            title={t("Currency Rate")}
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
                        <Button variant="success" onClick={openModalCreate}>
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          {t("Add currency rate")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TableCurrencyRate
                        data={currencyRates || []}
                        onReloadTable={fetchData}
                        onEdit={openModalEdit}
                        onDelete={onDelete}
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

CurrencyRatePage.layout = (page: any) => <Layout children={page} />;

export default CurrencyRatePage;


