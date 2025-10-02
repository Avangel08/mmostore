import React, { useMemo, useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import PageHeader from "../PageHeader/PageHeader";
import { Container, Card, Button, Form } from "react-bootstrap";
import Layout from "../../Layouts";
import vcb from "../../../../../../images/icons/icon-vcb.png"
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { showToast } from "../../../../../utils/showToast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { ModalDeposit } from "./Modal/ModalDeposit";
import Cleave from "cleave.js/react";
import { useContext } from "react";
import { LayoutContext } from "../../Layouts/LayoutContext";

interface DepositProps {
    // Add any props if needed
}

const Index: React.FC<DepositProps> = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('bankTransfer');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const layoutCtx = useContext(LayoutContext);
    const pingDeposit = layoutCtx?.pingDeposit as (() => Promise<boolean>);
    const intervalRefs = useRef<any[]>([])

    const { t } = useTranslation();

    const handlePayNow = async () => {
        clearPingDeposit();
        const interval = setInterval(async () => {
            const ok = await pingDeposit();
            if (ok) {
                clearInterval(interval);
            }
        }, 3000);
        intervalRefs.current.push(interval);
    }

    const clearPingDeposit = () => {
        intervalRefs.current.forEach((intervalId: any) => clearInterval(intervalId));
        intervalRefs.current = []
    }

    const handlePaymentMethodChange = (method: string) => {
        setSelectedPaymentMethod(method);
        formik.setFieldValue('paymentMethod', method);
    };

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount(amount);
        formik.setFieldValue('amount', amount);
    };

    const handleCustomAmountChange = (value: number | null) => {
        setCustomAmount(value);
        setSelectedAmount(null);
        formik.setFieldValue('amount', value);
    };

    const validationSchema = useMemo(() => {
        return Yup.object({
            paymentMethod: Yup.string()
                .required(t("Please select payment method")),
            amount: Yup.number()
                .min(10000, t("Amount must be at least 10000"))
                .required(t("Please enter amount"))
        });
    }, [t]);

    const formik = useFormik({
        initialValues: {
            paymentMethod: "bankTransfer",
            amount: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            const url = route("buyer.deposit.checkout");
            await axios.post(url, values).then((response) => {
                if (response.data.status === "success") {
                    setShowModal(true);
                    setData(response.data.data);
                } else {
                    showToast(t(response.data.message), "error");
                }
            }).catch((error) => {
                showToast(t(error.response.data.message), "error");
            });
        },
    });

    return (
        <React.Fragment>
            <ModalDeposit show={showModal} onHide={() => setShowModal(false)} data={data} />
            <Head title="Deposit" />
            <ToastContainer />
            <PageHeader title="Hỗ Trợ và Chính Sách Bảo Hành" />
            <Container className="mt-4">
                <Card className="shadow-sm p-2" style={{ minHeight: "50vh" }}>
                    <Card.Body>
                        <Form onSubmit={formik.handleSubmit} noValidate>
                            <div className="deposit-section">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>1. {t('Select your subscription method')}</h6>
                                        <div className="payment-methods">
                                            <Card>
                                                <Card.Body>
                                                    <Form.Check
                                                        type="radio"
                                                        id="bankTransfer"
                                                        name="paymentMethod"
                                                        label={
                                                            <div className="d-flex align-items-center">
                                                                <span className="d-block justify-content-center">{t('You cab transfer money directly via Vietcombank')}</span>
                                                                <img
                                                                    src={vcb}
                                                                    alt="Bank Transfer"
                                                                    className="ms-3"
                                                                    style={{ height: "30px" }}
                                                                />
                                                            </div>
                                                        }
                                                        checked={selectedPaymentMethod === 'bankTransfer'}
                                                        onChange={() => handlePaymentMethodChange('bankTransfer')}
                                                        className="mb-3"
                                                    />
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <h6>2. {t('Deposit amount')}</h6>
                                        <div className="amount-options mb-3">
                                            <div className="btn-group w-100">
                                                {[10000, 20000, 50000, 100000, 500000].map((amount) => (
                                                    <Button
                                                        key={amount}
                                                        variant={selectedAmount === amount ? "primary" : "outline-secondary"}
                                                        onClick={() => handleAmountSelect(amount)}
                                                    >
                                                        {amount.toLocaleString('vi-VN')}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <Form.Label>{t('Or enter custom amount')}:</Form.Label>
                                            <Form.Control
                                                name="amount"
                                                type="text"
                                                placeholder={t('Enter amount')}
                                                value={customAmount ? customAmount.toLocaleString('vi-VN') : ''}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\./g, '');
                                                    const numValue = rawValue ? Number(rawValue) : null;
                                                    handleCustomAmountChange(numValue);
                                                    formik.setFieldValue('amount', numValue);
                                                }}
                                                onBlur={formik.handleBlur}
                                                className={`form-control ${formik.touched.amount && formik.errors.amount ? 'is-invalid' : ''}`}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {t(formik.errors.amount || '')}
                                            </Form.Control.Feedback>
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-100"
                                            type="submit"
                                            disabled={formik.isSubmitting}
                                            onClick={handlePayNow}
                                        >
                                            {formik.isSubmitting ? t('Processing...') : t('Pay now')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </React.Fragment>
    );
};
Index.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default Index;