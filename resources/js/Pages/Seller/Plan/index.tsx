import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../../utils/showToast";
import { ModalCheckoutPlan } from "./ModalCheckoutPlan";
import { ModalSelectPaymentMethod } from "./ModalSelectPaymentMethod";
import axios from "axios";

const Plans = () => {
  const { t } = useTranslation();
  const { plans, paymentMethods, currentUserPlan } = usePage().props as any;
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showCheckoutPlanModal, setShowCheckoutPlanModal] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleSelectPlan = async (planId: number) => {
    if (!planId) {
      showToast(t("Invalid plan selected"), "error");
      return;
    }

    if (!paymentMethods || paymentMethods?.length === 0) {
      showToast(t("No payment methods available. Please contact support"), "error");
      return;
    }

    setSelectedPlanId(planId);
    router.reload({
      only: ['paymentMethods'],
      onSuccess: () => {
        setShowPaymentMethodModal(true);
        setData(null);
      },
      onError: () => {
        showToast(t("Failed to load payment methods"), "error");
      }
    });
  };

  const handlePaymentMethodSelect = async (paymentMethodId: number) => {
    if (!selectedPlanId) {
      showToast(t("No plan selected"), "error");
      return;
    }

    const selectedPaymentMethod = paymentMethods.find((method: any) => method.id === paymentMethodId);

    if (!selectedPaymentMethod || !selectedPaymentMethod?.id) {
      showToast(t("No valid payment method found. Please contact support"), "error");
      return;
    }

    const url = route("seller.plan.checkout");
    await axios.post(url, {
      plan_id: selectedPlanId,
      payment_method_id: selectedPaymentMethod.id,
    }).then((response) => {
      if (response.data.status === "success") {
        setData(response.data.data);
        setShowPaymentMethodModal(false);
        setShowCheckoutPlanModal(true);
      } else {
        showToast(t(response.data.message), "error");
      }
    }).catch((error) => {
      showToast(t(error.response.data.message), "error");
    });
  };

  const handleClosePaymentMethodModal = () => {
    setShowPaymentMethodModal(false);
    setSelectedPlanId(null);
  };

  const handleCloseCheckoutPlanModal = () => {
    setShowCheckoutPlanModal(false);
    setData(null);
    setSelectedPlanId(null);
  };

  const handleBackToPaymentMethod = () => {
    setShowCheckoutPlanModal(false);
    setData(null);
    router.reload({
      only: ['paymentMethods'],
      onSuccess: () => {
        setShowPaymentMethodModal(true);
      },
      onError: () => {
        showToast(t("Failed to load payment methods"), "error");
      }
    });
  };

  return (
    <React.Fragment>
      <Head title={t("Subscription Plans")} />
      <div className="page-content">
        <ModalSelectPaymentMethod 
          show={showPaymentMethodModal}
          onHide={handleClosePaymentMethodModal}
          paymentMethods={paymentMethods}
          onSelectPaymentMethod={handlePaymentMethodSelect}
        />
        <ModalCheckoutPlan 
          show={showCheckoutPlanModal} 
          onHide={handleCloseCheckoutPlanModal} 
          data={data}
          onBack={handleBackToPaymentMethod}
        />
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
                        <h5 className="text-white mb-2">{t("Current Plan")}: {currentUserPlan?.name}</h5>
                        <p className="text-white-50 mb-2">
                          {parseFloat(currentUserPlan?.price).toFixed(2)} {t("per")} {currentUserPlan?.interval} {t('day')}
                        </p>
                        <div className="d-flex flex-wrap gap-3 text-sm">
                          {!!currentUserPlan.sub_description && (
                            <span><i className="ri-information-line me-1"></i>{currentUserPlan?.sub_description}</span>
                          )}
                          {currentUserPlan.off > 0 && (
                            <span><i className="ri-percent-line me-1"></i>{currentUserPlan?.off}% {t("discount")}</span>
                          )}
                        </div>
                      </Col>
                      <Col md={4} className="text-md-end">
                        <Badge bg="success" className="mb-2 fs-6">
                          {currentUserPlan?.status === 1 ? t("Active") : t("Inactive")}
                        </Badge>
                        {!!currentUserPlan?.created_at && (
                          <p className="text-white-50 mb-0">
                            {t("Started on")}: {new Date(currentUserPlan?.created_at).toLocaleDateString()}
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
                            {plan.price === 0 ? t("Free") : (plan.price + " đ")}
                            <span className="fs-6 text-muted">
                              /{plan.interval} {t('days')}
                            </span>
                          </h2>
                          {plan.off > 0 && (
                            <div className="mt-2">
                              <span className="text-decoration-line-through text-muted me-2">
                                {plan.price_origin}
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
                          variant={isCurrentPlan ? "secondary" : "outline-primary"}
                          className="w-100 mb-3"
                          size="lg"
                          onClick={() => handleSelectPlan(plan.id)}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? (
                            <>
                              <i className="ri-check-line me-2"></i>
                              {t("Current Plan")}
                            </>
                          ) : (
                            <>
                              <i className="ri-arrow-right-line me-2"></i>
                              {t("Select Plan")}
                            </>
                          )}
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
                    <p className="text-muted">{t("Please check back later")}</p>
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
