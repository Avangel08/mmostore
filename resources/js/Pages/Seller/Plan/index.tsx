import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../../utils/showToast";
import { ModalPaymentPlan } from "./ModalPaymentPlan";

const Plans = () => {
  const { t } = useTranslation();
  const { plans, currentUserPlan } = usePage().props as any;
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectPlan = (planId: number) => {
    showToast(t("Plan selection functionality will be implemented"), "info");
    // fetch data
    router.post(route("seller.plan.select"), {
      plan_id: planId
    },
      {
        replace: true,

      }
    );
  };

  return (
    <React.Fragment>
      <Head title={t("Subscription Plans")} />
      <div className="page-content">
        <ModalPaymentPlan show={showPaymentModal} onHide={() => setShowPaymentModal(false)} />
        <ToastContainer />
        <Container fluid>
          <BreadCrumb
            title={t("Subscription Plans")}
            pageTitle={t("Homepage")}
          />

          {/* Current Plan Info */}
          {!!currentUserPlan && (
            <Row className="mb-4">
              <Col xs={12}>
                <Card className="bg-primary text-white">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <h5 className="text-white mb-2">{t("Current Plan")}: {currentUserPlan.name}</h5>
                        <p className="text-white-50 mb-2">
                          {parseFloat(currentUserPlan.price).toFixed(2)} {t("per")} {currentUserPlan.interval} {t('day')}
                        </p>
                        <div className="d-flex flex-wrap gap-3 text-sm">
                          {!!currentUserPlan.sub_description && (
                            <span><i className="ri-information-line me-1"></i>{currentUserPlan.sub_description}</span>
                          )}
                          {currentUserPlan.off > 0 && (
                            <span><i className="ri-percent-line me-1"></i>{currentUserPlan.off}% {t("discount")}</span>
                          )}
                        </div>
                      </Col>
                      <Col md={4} className="text-md-end">
                        <Badge bg="success" className="mb-2 fs-6">
                          {currentUserPlan.status === 1 ? t("Active") : t("Inactive")}
                        </Badge>
                        {!!currentUserPlan.created_at && (
                          <p className="text-white-50 mb-0">
                            {t("Started on")}: {new Date(currentUserPlan.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Plans */}
          <Row className="justify-content-center">
            {!!plans && plans.length > 0 ? plans.map((plan: any) => {
              const isCurrentPlan = currentUserPlan && currentUserPlan.id === plan.id;
              return (
                <Col lg={4} md={6} key={plan.id} className="mb-4">
                  <Card className={`h-100 ${plan.best_choice ? 'border-primary' : ''} position-relative`}>
                    {!!plan.best_choice && (
                      <div className="position-absolute top-0 start-50 translate-middle">
                        <Badge bg="success" className="rounded-pill px-3 py-2">
                          <i className="ri-star-fill me-1"></i>
                          {t("Best choice")}
                        </Badge>
                      </div>
                    )}
                    <Card.Body className="p-4">
                      <div className="text-center mb-4">
                        <h4 className="fw-bold mb-1">{plan.name}</h4>
                        {!!plan.sub_description && (
                          <p className="text-muted mb-3">{plan.sub_description}</p>
                        )}
                        <div className="mb-3">
                          <h2 className="fw-bold mb-0">
                            {plan.price === 0 ? t("Free") : (plan.price)}
                            <span className="fs-6 text-muted">
                              /{plan.interval} {t('days')}
                            </span>
                          </h2>
                          {plan.off > 0 && (
                            <div className="mt-2">
                              <span className="text-decoration-line-through text-muted me-2">
                                ${parseFloat(plan.price_origin).toFixed(2)}
                              </span>
                              <Badge bg="danger" className="ms-1">
                                {plan.off}% {t("OFF")}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <Button
                          variant={plan.best_choice ? "primary" : "outline-primary"}
                          className="w-100 mb-3"
                          size="lg"
                          onClick={() => handleSelectPlan(plan.id)}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? t("Current Plan") : t("Select Plan")}
                        </Button>
                      </div>

                      {/* Plan Description */}
                      {!!plan.description && (
                        <div>
                          <h6 className="text-uppercase text-muted mb-3 fw-bold">{t("Description")}</h6>
                          <div className="text-muted small">
                            <div dangerouslySetInnerHTML={{ __html: plan.description }} />
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            }) : (
              <Col xs={12}>
                <Card className="text-center py-5">
                  <Card.Body>
                    <i className="ri-inbox-line display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">{t("No plans available")}</h5>
                    <p className="text-muted">{t("Please check back later for available subscription plans.")}</p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          {/* Additional Info */}
          {/* <Row className="mt-4">
            <Col xs={12}>
              <Card className="bg-light">
                <Card.Body className="text-center py-4">
                  <h5 className="mb-3">{t("Need help choosing the right plan?")}</h5>
                  <p className="text-muted mb-3">
                    {t("Contact our sales team for personalized recommendations and enterprise solutions.")}
                  </p>
                  <Button variant="outline-primary">
                    <i className="ri-customer-service-2-line me-2"></i>
                    {t("Contact Sales")}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

Plans.layout = (page: any) => <Layout children={page} />;
export default Plans;
