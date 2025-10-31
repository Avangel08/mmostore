import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../../utils/showToast";
import { CKEditorContent } from "../../../Components/CKEditorContent";
import { ModalCheckoutPlan } from "./ModalCheckoutPlan";
import { ModalSelectPaymentMethod } from "./ModalSelectPaymentMethod";
import axios from "axios";
import moment from "moment";

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
      <style>
        {`
          .pricing-box {
            border: 1px solid #e9ecef;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: visible;
          }
          .pricing-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .best-choice-badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #198754;
            color: white;
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.3px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            z-index: 10;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }
          .best-choice-badge i {
            font-size: 9px;
          }
          .plan-features ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .plan-features li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #f8f9fa;
          }
          .plan-features li:last-child {
            border-bottom: none;
          }
          .plan-features .d-flex .flex-shrink-0 {
            width: 20px;
          }
          .plan-glow {
            position: relative;
          }
          .plan-glow::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #198754, #20c997, #198754);
            border-radius: 0.85rem;
            z-index: -1;
            opacity: 0.7;
            animation: glow 2s ease-in-out infinite alternate;
          }
          @keyframes glow {
            from {
              opacity: 0.5;
            }
            to {
              opacity: 0.8;
            }
          }
        `}
      </style>
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

          {/* Plans Header */}
          {!!currentUserPlan && (
            <Row className="justify-content-center mt-4">
              <Col lg={5}>
                <div className="text-center mb-4">
                  <h4 className="fw-semibold fs-22">{t("Current your plan")}</h4>
                </div>
              </Col>
            </Row>
          )}

          {/* Current Plan Info */}
          {!!currentUserPlan && (
            <Row className="justify-content-center mb-5">
              <Col lg={8}>
                <Card className="pricing-box border-success shadow-lg">
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <div className="avatar-lg bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                        <i className="ri-vip-crown-line fs-1 text-success"></i>
                      </div>
                      <h4 className="fw-bold mb-2">{currentUserPlan?.name}</h4>
                      <p className="text-muted mb-0">{t("Your Current Active Plan")}</p>
                    </div>

                    <Row className="g-4">
                      <Col md={4}>
                        <div className="text-center p-3 bg-light rounded">
                          <div className="d-flex align-items-center justify-content-center mb-2">
                            <i className="ri-calendar-line text-primary me-2"></i>
                            <h6 className="text-muted mb-0">{t("Started On")}</h6>
                          </div>
                          <p className="mb-0 fw-bold h6">
                            {currentUserPlan?.active_on
                              ? moment(currentUserPlan.active_on).format('DD/MM/YYYY')
                              : moment(currentUserPlan.created_at).format('DD/MM/YYYY')
                            }
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center p-3 bg-light rounded">
                          <div className="d-flex align-items-center justify-content-center mb-2">
                            <i className="ri-calendar-check-line text-warning me-2"></i>
                            <h6 className="text-muted mb-0">{t("Expires On")}</h6>
                          </div>
                          <p className="mb-0 fw-bold h6">
                            {currentUserPlan?.expires_on
                              ? moment(currentUserPlan.expires_on).format('DD/MM/YYYY')
                              : t("No expiration")
                            }
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center p-3 bg-light rounded">
                          <div className="d-flex align-items-center justify-content-center mb-2">
                            <i className="ri-time-line text-success me-2"></i>
                            <h6 className="text-muted mb-0">{t("Days Remaining")}</h6>
                          </div>
                          <p className="mb-0 fw-bold h6">
                            {currentUserPlan?.expires_on ? (
                              (() => {
                                const today = moment();
                                const expiryDate = moment(currentUserPlan.expires_on);
                                const diffDays = expiryDate.diff(today, 'days');
                                return diffDays > 0 ? `${diffDays} ${t("days")}` : t("Expired");
                              })()
                            ) : t("Unlimited")}
                          </p>
                        </div>
                      </Col>
                    </Row>

                    {/* Plan Description & Features */}
                    {(currentUserPlan?.description || currentUserPlan?.feature) && (
                      <div className="mt-4 pt-3 border-top">
                        {currentUserPlan?.description && (
                          <div className="mb-3">
                            <h6 className="mb-2">{t("Description")}</h6>
                            <div
                              className="text-muted small"
                              dangerouslySetInnerHTML={{ __html: currentUserPlan.description }}
                            />
                          </div>
                        )}
                        {currentUserPlan?.feature && (
                          <div>
                            <h6 className="mb-2">{t("Features")}</h6>
                            <div
                              className="text-muted small"
                              dangerouslySetInnerHTML={{ __html: currentUserPlan.feature }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Plan Benefits Section */}
          {!!plans && plans.length > 0 && (
            <Row className="justify-content-center mt-5">
              <Col lg={8}>
                <div className="text-center mb-4">
                  <h4 className="fw-semibold fs-22">{t("Choose the plan that's right for you")}</h4>
                  <p className="text-muted mb-0">{t("Explore subscription plans designed to fit your needs")}</p>
                </div>
                {/* <Row className="text-center">
                  <Col md={4} className="mb-4">
                    <div className="p-4">
                      <div className="avatar-lg bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                        <i className="ri-shield-check-line fs-2 text-primary"></i>
                      </div>
                      <h5 className="mb-2">{t("Secure & Reliable")}</h5>
                      <p className="text-muted mb-0">{t("Bank-level security with 99.9% uptime guarantee")}</p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-4">
                    <div className="p-4">
                      <div className="avatar-lg bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                        <i className="ri-customer-service-2-line fs-2 text-success"></i>
                      </div>
                      <h5 className="mb-2">{t("24/7 Support")}</h5>
                      <p className="text-muted mb-0">{t("Round-the-clock customer support for all your needs")}</p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-4">
                    <div className="p-4">
                      <div className="avatar-lg bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                        <i className="ri-rocket-line fs-2 text-warning"></i>
                      </div>
                      <h5 className="mb-2">{t("Fast & Easy")}</h5>
                      <p className="text-muted mb-0">{t("Quick setup and intuitive interface for seamless experience")}</p>
                    </div>
                  </Col>
                </Row> */}
              </Col>
            </Row>
          )}

          {/* Plans */}
          <Row className="justify-content-center">
            {!!plans && plans.length > 0 ? plans.map((plan: any) => {
              const isCurrentPlan = currentUserPlan && currentUserPlan.id === plan.id;
              return (
                <Col xxl={3} lg={6} key={plan.id} className="mb-4">
                  <Card className={`pricing-box h-100 ${plan.best_choice ? 'best-choice' : ''}`}>
                    {!!plan.best_choice && (
                      <div className="best-choice-badge" style={{ width: 'fit-content', padding: '4px 8px', fontSize: '12px' }}>
                        <i className="ri-star-fill"></i>
                        <span>{t("Best choice")}</span>
                      </div>
                    )}
                    <Card.Body className="bg-light m-2 p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fw-semibold">{plan.name}</h5>
                        </div>
                        <div className="ms-auto">
                          <h2 className="mb-0">
                            {plan.price === 0 ? (
                              <span className="fs-5">{t("Free")}</span>
                            ) : (
                              <>
                                {new Intl.NumberFormat('vi-VN').format(plan.price)} <small className="fs-13">đ</small>
                                <small className="fs-13 text-muted">/{plan.interval} {t('days')}</small>
                              </>
                            )}
                          </h2>
                        </div>
                      </div>

                      {!!plan.sub_description && (
                        <p className="text-muted">{plan.sub_description}</p>
                      )}

                      {/* Plan Features List */}
                      {!!plan.feature && (
                        <div className="mb-4">
                          <div
                            className="plan-features"
                            dangerouslySetInnerHTML={{ __html: plan.feature }}
                          />
                        </div>
                      )}

                      <div className="mt-3 pt-2">
                        <Button
                          variant={isCurrentPlan ? "secondary" : "primary"}
                          className={`w-100 ${isCurrentPlan ? 'disabled' : ''}`}
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
                        <div className="mt-3 pt-3 border-top">
                          <h6 className="text-uppercase text-muted mb-2 fw-bold" style={{ fontSize: '12px' }}>
                            {t("Description")}
                          </h6>
                          <div className="text-muted small">
                            <CKEditorContent htmlContent={plan.description} />
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
