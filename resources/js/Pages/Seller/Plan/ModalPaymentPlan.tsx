import { Modal, Button, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const ModalPaymentPlan = ({
    show,
    onHide,
    data,
}: {
    show: boolean;
    onHide: () => void;
    data?: any;
}) => {

    const { t } = useTranslation();
    const bankName = data?.bank ? String(data.bank) : "";
    const accountName = data?.account_name ? String(data.account_name) : "";
    const accountNumber = data?.account_number ? String(data.account_number) : "";
    const amountVnd = data?.amount_vnd ?? 0;
    const contentBank = data?.content_bank ? String(data.content_bank) : "";
    const bankCode = data?.bank_code ? String(data.bank_code) : "";

    const qrSrc = `https://img.vietqr.io/image/VCB-${accountNumber}-compact.jpg?amount=${amountVnd}&addInfo=${encodeURIComponent(contentBank)}&accountName=${encodeURIComponent(accountName)}`;
    return (
        <Modal
            size="lg"
            id="myModal"
            backdrop={"static"}
            show={show}
            onHide={() => {
                onHide();
            }}
            centered
        >
            <Modal.Header closeButton>
                <h5 className="mb-0">{t("Instant bank transfer")}</h5>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6} className="d-flex justify-content-center align-items-start mb-3 mb-md-0">
                        {qrSrc ? (
                            <img
                                src={qrSrc}
                                alt="VietQR"
                                style={{ maxWidth: 260, width: "100%", borderRadius: 8 }}
                            />
                        ) : null}
                    </Col>
                    <Col md={6}>
                        <div className="mb-2">
                            <span>{t("Bank")}:</span>
                            <span className="fw-semibold ms-2" style={{ fontSize: 16, color: "#0066cc" }}>{bankName || t("Vietcombank")}</span>
                        </div>
                        <div className="mb-2 pt-3 border-top border-top-dashed mt-3">
                            <span>{t("Account Holder")}:</span>
                            <span className="fw-semibold ms-2" style={{ fontSize: 16, color: "#0066cc" }}>{accountName}</span>
                        </div>
                        <div className="mb-2 pt-3 border-top border-top-dashed mt-3">
                            <span>{t("Account Number")}:</span>
                            <span className="fw-semibold ms-2" style={{ fontSize: 16, color: "#0066cc" }}>{accountNumber}</span>
                        </div>
                        <div className="mb-2 pt-3 border-top border-top-dashed mt-3">
                            <span>{t("Total Price")}:</span>
                            <span className="fw-semibold ms-2" style={{ fontSize: 16, color: "#0066cc" }}>{amountVnd?.toLocaleString?.() || amountVnd} VND</span>
                        </div>
                        <div className="mb-2 pt-3 border-top border-top-dashed mt-3">
                            <span>{t("Transfer Content")}:</span>
                            <span className="fw-semibold ms-2" style={{ fontSize: 16, color: "#0066cc", wordBreak: "break-word" }}>{contentBank}</span>
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="border-top border-top-dashed mt-3">
                            <ul className="mt-3" style={{ paddingLeft: 18 }}>
                                <li className="mb-2">
                                    {t("If you make a transaction according to the above information, it may take a few minutes for the system to verify the transaction. Once the transaction is successful, your account will be automatically credited.")}
                                </li>
                                <li className="mb-2">
                                    {t("If it's been more than 10 minutes since the transaction was successful and your account has not been credited, please contact customer service.")}
                                </li>
                                <li className="mb-2">
                                    {t("Please check product and account information carefully to deposit just enough for use, the system does not support account withdrawal.")}
                                </li>
                                <li className="mb-0">
                                    {t("Customers who make a payment without providing invoice information are understood to be individual buyers who do not request an invoice. In this case, the company will issue an electronic invoice without the buyer's name.")}
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={() => {
                        onHide();
                    }}
                >
                    {t("Close")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};