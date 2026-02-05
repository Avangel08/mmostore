import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const ModalSelectPaymentMethod = ({
    show,
    onHide,
    paymentMethods,
    onSelectPaymentMethod,
}: {
    show: boolean;
    onHide: () => void;
    paymentMethods?: any[];
    onSelectPaymentMethod?: (paymentMethodId: number) => void;
}) => {
    const { t } = useTranslation();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<any>(null);

    const handleContinue = () => {
        if (selectedPaymentMethod && onSelectPaymentMethod) {
            onSelectPaymentMethod(selectedPaymentMethod.id);
        }
    };

    const handleClose = () => {
        setSelectedPaymentMethod(null);
        onHide();
    };

    return (
        <Modal
            size="lg"
            id="selectPaymentMethodModal"
            backdrop={"static"}
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <h5 className="mb-0">{t("Select Payment Method")}</h5>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-4">
                        <i className="ri-bank-card-line text-primary fs-5 me-2"></i>
                        <h5 className="mb-0 text-primary fw-bold">{t("Choose your preferred payment method")}</h5>
                    </div>
                    
                    {paymentMethods && paymentMethods.length > 0 ? (
                        <Row className="g-3">
                            {paymentMethods.map((method: any) => (
                                <Col lg={6} key={method.id}>
                                    <div 
                                        className={`payment-method-card border rounded-3 p-4 position-relative h-100 ${
                                            selectedPaymentMethod?.id === method.id 
                                                ? 'border-primary bg-primary bg-opacity-10 shadow-lg' 
                                                : 'border-light-subtle shadow-sm'
                                        }`}
                                        style={{ 
                                            cursor: 'pointer', 
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: selectedPaymentMethod?.id === method.id ? 'translateY(-2px)' : 'translateY(0)',
                                        }}
                                        onClick={() => setSelectedPaymentMethod(method)}
                                        onMouseEnter={(e) => {
                                            if (selectedPaymentMethod?.id !== method.id) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.classList.add('shadow');
                                                e.currentTarget.classList.add('border-primary');
                                                e.currentTarget.classList.remove('border-light-subtle');
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedPaymentMethod?.id !== method.id) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.classList.remove('shadow');
                                                e.currentTarget.classList.remove('border-primary');
                                                e.currentTarget.classList.add('border-light-subtle');
                                            }
                                        }}
                                    >
                                        {selectedPaymentMethod?.id === method.id && (
                                            <>
                                                <div className="position-absolute top-0 end-0 m-3">
                                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                                         style={{ width: 24, height: 24 }}>
                                                        <i className="ri-check-line text-white fw-bold" style={{ fontSize: '14px' }}></i>
                                                    </div>
                                                </div>
                                                <div className="position-absolute top-0 start-0 bg-primary" 
                                                     style={{ 
                                                         width: '4px', 
                                                         height: '100%', 
                                                         borderRadius: '4px 0 0 4px' 
                                                     }}>
                                                </div>
                                            </>
                                        )}

                                        <div className="d-flex flex-column align-items-center justify-content-center text-center h-100">
                                            {/* Payment Method Icon */}
                                            <div className="mb-3">
                                                {method.icon && method.icon !== 'fff' ? (
                                                    <div className="bg-light rounded-2 p-2 d-flex align-items-center justify-content-center"
                                                         style={{ width: 56, height: 56 }}>
                                                        <img 
                                                            src={method.icon} 
                                                            alt={method.name}
                                                            style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain' }}
                                                            onError={(e) => {
                                                                e.currentTarget.parentElement!.innerHTML = '<i class="ri-bank-line text-muted fs-4"></i>';
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="bg-light rounded-2 p-2 d-flex align-items-center justify-content-center"
                                                         style={{ width: 56, height: 56 }}>
                                                        <i className="ri-bank-line text-muted fs-4"></i>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Payment Method Name */}
                                            <div>
                                                <h4 className="mb-0 fw-bold text-dark text-center">{method.name}</h4>
                                            </div>
                                        </div>

                                        {selectedPaymentMethod?.id === method.id && (
                                            <div className="position-absolute top-0 start-0 w-100 h-100 rounded-3"
                                                 style={{
                                                     background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(13, 110, 253, 0.02) 100%)',
                                                     pointerEvents: 'none'
                                                 }}>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5">
                            <i className="ri-bank-line display-4 text-muted mb-3"></i>
                            <h5 className="text-muted">{t("No payment methods available")}</h5>
                            <p className="text-muted">{t("Please contact support for assistance")}</p>
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={handleContinue}
                    disabled={!selectedPaymentMethod}
                    className="me-2"
                >
                    {t("Continue")}
                    <i className="ri-arrow-right-line ms-1"></i>
                </Button>
                
                <Button
                    variant="light"
                    onClick={handleClose}
                >
                    {t("Cancel")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};