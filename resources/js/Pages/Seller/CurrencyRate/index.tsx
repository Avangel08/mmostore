import { useTranslation } from "react-i18next";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Filter from "./Filter";
import { useQueryParams } from "../../../hooks/useQueryParam";
import axios from "axios";
import { showToast } from "../../../utils/showToast";
import { confirmDelete } from "../../../utils/sweetAlert";
import TableCurrencyRate from "./TableCurrencyRate";
import Layout from "../../../CustomSellerLayouts";
import { ModalCurrencyRate } from "./Modal/ModalCurrencyRate";

const CurrencyRatePage = () => {
  const { t } = useTranslation();
  const { currencyRates } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [dataOptions, setDataOptions] = useState<any>(null);
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
      only: ["currencyRates"],
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
      const response = await axios.get(route("seller.currency-rate.edit", { id }));
      setDataEdit(response.data.currencyRate);
      setDataOptions({
        statusList: response.data.statusList,
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching currency rate:", error);
    }
  };

  const openModalCreate = async () => {
    try {
      const response = await axios.get(route("seller.currency-rate.create"));
      setDataEdit(null);
      setDataOptions({
        statusList: response.data.statusList,
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching currency rate:", error);
    }
  };

  const onDelete = async (id: number | string) => {
    if (!id) {
      showToast(t("Invalid ID"), "error");
      return;
    }

    const confirmed = await confirmDelete({
      title: t("Do you want to delete?"),
      text: t("Once deleted, you will not be able to recover it."),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("seller.currency-rate.destroy", { id }), {
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


