import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import TableCategory from "./TableCategory";
import { ModalDetailCategory } from "./ModalDetailCategory";

const Category = () => {
  const { t } = useTranslation();
  const { categories } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);

  const onReloadTable = (currentPage: number = 0, perPage: number = 10) => {
    router.reload({
      only: ["categories"],
      data: { page: currentPage + 1, perPage },
    });
  };

  const openModalEdit = (id: number | string) => {
    router.reload({
      only: ["detailCategory"],
      data: { id },
      replace: true,
      onSuccess: (page) => {
        setDataEdit(page.props.detailCategory);
        setShowModal(true);
      },
    });
  };

  return (
    <React.Fragment>
      <Head title={t("Category Management")} />
      <div className="page-content">
        <ToastContainer />
        <ModalDetailCategory 
          show={showModal} 
          onHide={() => { setShowModal(false); setDataEdit(null); }} 
          dataEdit={dataEdit}
        />
        <Container fluid>
          <BreadCrumb title={t("Category Management")} pageTitle={t("Homepage")} />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">{t("Category")}</h5>
                </Card.Header>
                <Card.Body>
                  <Row style={{ marginBottom: "32px" }}>
                    <Col>
                      <Button variant="success" onClick={() => { setDataEdit(null); setShowModal(true); }}>
                        <i className="ri-add-line align-bottom me-1"></i> {t("Add category")}
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TableCategory data={categories || []} onReloadTable={onReloadTable} onEdit={openModalEdit} />
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

Category.layout = (page: any) => <Layout children={page} />;
export default Category;
