import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import PlanFilter from "./PlanFilter";
import { confirmDelete, confirmDialog } from "../../../utils/sweetAlert";
import { showToast } from "../../../utils/showToast";
import { ModalPlan } from "./ModalPlan";
import TablePlan from "./TablePlan";
import Layout from "../../../CustomAdminLayouts";

const Plan = () => {
  const { t } = useTranslation();
  const { plans, statusConst, typeConst } = usePage().props as any;

  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);

  const fetchData = (
    currentPage: number = 1,
    perPage: number = 10,
    filters?: any
  ) => {
    router.reload({
      only: ["plans"],
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

  const openModalEdit = (id: number | string) => {
    router.reload({
      only: ["detailPlan"],
      data: { id },
      replace: true,
      onSuccess: (page) => {
        setDataEdit(page.props.detailPlan);
        setShowModal(true);
      },
    });
  };

  const onDuplicatePlan = async (id: number | string, name: string, type: string) => {
    const confirmed = await confirmDialog({
      title: t("Duplicate plan '{{name}}' ?", { name }),
      text: type == "0" ? t("The new plan will be a Normal plan") : "",
      confirmButtonText: t("Yes"),
      cancelButtonText: t("Cancel"),
    });
    if (confirmed) {
      router.post(
        route("admin.plans.duplicate-plan", { id }),
        {},
        {
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
        }
      );
    }
  }

  return (
    <React.Fragment>
      <Head title={t("Plan")  + " - Admin"} />
      <div className="page-content">
        <ToastContainer />
        <ModalPlan
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setDataEdit(null);
          }}
          dataEdit={dataEdit}
        />
        <Container fluid>
          <BreadCrumb
            title={t("Plan")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <PlanFilter onFilter={handleFilter} statusConst={statusConst} typeConst={typeConst} />
                  <Row style={{ marginBottom: "32px" }}>
                    <Col>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          onClick={() => {
                            setDataEdit(null);
                            setShowModal(true);
                          }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          {t("Add plan")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TablePlan
                        data={plans || []}
                        onReloadTable={fetchData}
                        onEdit={openModalEdit}
                        onDuplicatePlan={onDuplicatePlan}
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

Plan.layout = (page: any) => <Layout children={page} />;
export default Plan;
