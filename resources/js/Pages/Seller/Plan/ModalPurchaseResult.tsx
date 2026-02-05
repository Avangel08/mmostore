import React from "react";
import { Modal, Button, Badge, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface ModalPurchaseResultProps {
    show: boolean;
    onHide: () => void;
    data: any;
    onShowCheckout?: () => void;
}

export const ModalPurchaseResult: React.FC<ModalPurchaseResultProps> = ({
    show,
    onHide,
    data,
    onShowCheckout,
}) => {
    const { t } = useTranslation();

    if (!data) return null;
    console.log(data);

    // Status constants: PENDING = 0, COMPLETE = 1, REJECT = 2
    const isSuccess = data.status === 1;
    const isRejected = data.status === 2;

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className={`${isSuccess ? 'bg-success' : isRejected ? 'bg-danger' : 'bg-warning'} bg-opacity-10`}>
                <Modal.Title className="d-flex align-items-center">
                    {isSuccess && (
                        <>
                            <i className="ri-checkbox-circle-fill text-success fs-3 me-2"></i>
                            <span>{t("Plan Activated Successfully")}</span>
                        </>
                    )}
                    {isRejected && (
                        <>
                            <i className="ri-error-warning-fill text-danger fs-3 me-2"></i>
                            <span>{t("Payment Rejected")}</span>
                        </>
                    )}
                    {!isSuccess && !isRejected && (
                        <>
                            <i className="ri-time-fill text-warning fs-3 me-2"></i>
                            <span>{t("Payment Processing")}</span>
                        </>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Status Alert */}
                {isSuccess && (
                    <Alert variant="success" className="mb-4">
                        <div className="d-flex align-items-center">
                            <i className="ri-checkbox-circle-line fs-4 me-2"></i>
                            <div>
                                <strong>{t("Congratulations!")}</strong> {t("Your plan has been activated successfully")}
                            </div>
                        </div>
                    </Alert>
                )}

                {isRejected && (
                    <Alert variant="danger" className="mb-4">
                        <div className="d-flex align-items-center">
                            <i className="ri-error-warning-line fs-4 me-2"></i>
                            <div>
                                <strong>{t("Payment Failed")}</strong>
                                {data.system_note && (
                                    <div className="mt-1 small">{t(data.system_note)}</div>
                                )}
                            </div>
                        </div>
                    </Alert>
                )}

                {/* Transaction Details */}
                <div className="mb-4">
                    <h6 className="text-uppercase text-muted mb-3" style={{ fontSize: '12px', fontWeight: 600 }}>
                        {t("Transaction Details")}
                    </h6>

                    <div className="row g-3">
                        {/* Plan Name */}
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="ri-vip-crown-line text-primary me-2"></i>
                                    <small className="text-muted">{t("Plan Name")}</small>
                                </div>
                                <div className="fw-semibold">{data.checkout?.name || '-'}</div>
                            </div>
                        </div>

                        {/* Required Amount */}
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="ri-money-dollar-circle-line text-warning me-2"></i>
                                    <small className="text-muted">{t("Required Amount")}</small>
                                </div>
                                <div className="fw-semibold">
                                    {new Intl.NumberFormat('vi-VN').format(data.checkout?.amount_vnd || 0)} đ
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="ri-bank-card-line text-success me-2"></i>
                                    <small className="text-muted">{t("Payment Method")}</small>
                                </div>
                                <div className="fw-semibold">{data.payment_method?.name || '-'}</div>
                            </div>
                        </div>

                        {/* Transaction ID */}
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="ri-file-list-line text-info me-2"></i>
                                    <small className="text-muted">{t("Transaction ID")}</small>
                                </div>
                                <div className="fw-semibold font-monospace small">{data.transaction_id || '-'}</div>
                            </div>
                        </div>

                        {/* Amount Paid */}
                        <div className="col-md-6">
                            <div className={`p-3 bg-light rounded ${data.checkout?.amount_vnd && data.amount_vnd < data.checkout.amount_vnd ? 'border border-danger' : ''}`}>
                                <div className="d-flex align-items-center mb-2">
                                    <i className={`ri-money-dollar-circle-line me-2 ${data.checkout?.amount_vnd && data.amount_vnd < data.checkout.amount_vnd ? 'text-danger' : 'text-success'}`}></i>
                                    <small className="text-muted">{t("Amount Paid")}</small>
                                </div>
                                <div className={`fw-semibold ${data.checkout?.amount_vnd && data.amount_vnd < data.checkout.amount_vnd ? 'text-danger' : ''}`}>
                                    {new Intl.NumberFormat('vi-VN').format(data.amount_vnd)} đ
                                </div>
                                {data.checkout?.amount_vnd && data.amount_vnd < data.checkout.amount_vnd && (
                                    <small className="text-danger">
                                        {t("Insufficient amount")}
                                    </small>
                                )}
                            </div>
                        </div>

                        {/* Content Bank */}
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="ri-message-line text-secondary me-2"></i>
                                    <small className="text-muted">{t("Transfer Content")}</small>
                                </div>
                                <div className="fw-semibold font-monospace small">{data.checkout?.content_bank || '-'}</div>
                            </div>
                        </div>

                        {/* Payment Date */}
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="ri-calendar-check-line text-info me-2"></i>
                                    <small className="text-muted">{t("Payment Date")}</small>
                                </div>
                                <div className="fw-semibold">
                                    {data.payment_date ? moment(data.payment_date).format('DD/MM/YYYY HH:mm:ss') : '-'}
                                </div>
                            </div>
                        </div>

                        {/* Expiration Date */}
                        {isSuccess && data.charge?.expires_on && (
                            <div className="col-md-6">
                                <div className="p-3 bg-light rounded">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="ri-time-line text-warning me-2"></i>
                                        <small className="text-muted">{t("Expires On")}</small>
                                    </div>
                                    <div className="fw-semibold">
                                        {moment(data.charge.expires_on).format('DD/MM/YYYY HH:mm:ss')}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status */}
                        <div className="col-12">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <i className="ri-information-line text-primary me-2"></i>
                                        <small className="text-muted">{t("Status")}</small>
                                    </div>
                                    <Badge
                                        bg={isSuccess ? 'success' : isRejected ? 'danger' : 'warning'}
                                        className="px-3 py-2"
                                    >
                                        {isSuccess && t("Completed")}
                                        {isRejected && t("Rejected")}
                                        {!isSuccess && !isRejected && t("Processing")}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {isSuccess ? (
                    <Button
                        variant="success"
                        onClick={() => {
                            onHide();
                            window.location.reload();
                        }}
                        className="px-4"
                    >
                        <i className="ri-check-line me-2"></i>
                        {t("Close")}
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={() => {
                            onHide();
                            if (onShowCheckout) {
                                onShowCheckout();
                            }
                        }}
                        className="px-4"
                    >
                        <i className="ri-arrow-left-line me-2"></i>
                        {t("Back")}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};
