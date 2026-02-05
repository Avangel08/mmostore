import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { Head, usePage } from "@inertiajs/react";
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
import { LayoutContext } from "../../Layouts/LayoutContext";
import { useThemeConfig } from "../../hooks/useThemeConfig";
import { useDispatch } from "react-redux";
import { changeLayoutTheme } from "../../../../../slices/thunk";

interface DepositProps {
    // Add any props if needed
}

type PageWithLayout = React.FC<DepositProps> & { layout?: (page: React.ReactNode) => React.ReactNode };

const Index: PageWithLayout = () => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const layoutCtx = useContext(LayoutContext);
    const pingDeposit = layoutCtx?.pingDeposit as (() => Promise<boolean>);
    const intervalRefs = useRef<any[]>([])
    const theme = useThemeConfig()
    const dispatch: any = useDispatch();

    const { listPaymentMethod } : any = usePage().props ;

    useEffect(() => {
        if (theme) {
            dispatch(changeLayoutTheme(theme?.theme));
        }
    }, [theme, dispatch])

    // Auto-select first payment method on mount
    useEffect(() => {
        if (listPaymentMethod && listPaymentMethod.length > 0 && !formik.values.payment_method_id) {
            const firstPaymentMethod = listPaymentMethod[0];
            handlePaymentMethodChange(firstPaymentMethod);
        }
    }, [listPaymentMethod])

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

    const handlePaymentMethodChange = (paymentMethod: any) => {
        const methodId = paymentMethod?.id !== undefined && paymentMethod?.id !== null ? String(paymentMethod.id) : '';
        formik.setFieldValue('payment_method_id', methodId);

        if (paymentMethod?.amount !== undefined && paymentMethod?.amount !== null) {
            setSelectedAmount(paymentMethod.amount);
            setCustomAmount(paymentMethod.amount);
            formik.setFieldValue('amount', paymentMethod.amount);
        }
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
            payment_method_id: Yup.string()
                .required(t("Please select payment method")),
            amount: Yup.number()
                .min(10000, t("Amount must be at least 10000"))
                .required(t("Please enter amount"))
        });
    }, [t]);

    const formik = useFormik({
        initialValues: {
            payment_method_id: '',
            amount: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            const url = route("buyer.deposit.checkout");
            await axios.post(url, values).then((response) => {
                if (response.data.status === "success") {
                    setShowModal(true);
                    setData(response.data.data);
                    handlePayNow();
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
            <Head title={theme?.storeName ?? ""} />
            <PageHeader title={theme?.pageHeaderText ?? ""} />
            <ModalDeposit show={showModal} onHide={() => setShowModal(false)} data={data} />
            <ToastContainer />
            {listPaymentMethod?.length > 0 ? (
            <Container className="mt-4 custom-container" fluid>
                <Card className="shadow-sm p-2" style={{ minHeight: "50vh" }}>
                    <Card.Body>
                        <Form onSubmit={formik.handleSubmit} noValidate>
                            <div className="deposit-section">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>1. {t('Select your subscription method')}</h6>
                                        <div className="payment-methods">
                                            {listPaymentMethod?.map((paymentMethod: any , index: number) => (
                                                <Card key={index}>
                                                    <Card.Body>
                                                        <div>
                                                            <div className="form-check mb-2">
                                                                <Form.Check.Input 
                                                                    className="form-check-input" 
                                                                    type="radio" 
                                                                    id={paymentMethod.id}
                                                                    name="payment_method_id"
                                                                    value={paymentMethod.id}
                                                                    checked={formik.values.payment_method_id === paymentMethod.id}
                                                                    onChange={() => handlePaymentMethodChange(paymentMethod)}
                                                                />
                                                                <Form.Check.Label className="form-check-label" htmlFor={paymentMethod.id}>
                                                                    <div className="d-flex align-items-center">
                                                                        <span className="d-block justify-content-center">{paymentMethod.title} ( {paymentMethod.name} )</span>
                                                                        {/* <img
                                                                            src={vcb}
                                                                            alt="Bank Transfer"
                                                                            className="ms-3"
                                                                            style={{ height: "20px" }}
                                                                        /> */}
                                                                    </div>
                                                                </Form.Check.Label>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            ))}
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
            ) : (
                <Container className="mt-4 custom-container" fluid>
                    <Card className="shadow-sm p-2" style={{ minHeight: "50vh" }}>
                        <Card.Body>
                            <h6>{t('No payment methods available. Please contact support')}</h6>
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </React.Fragment>
    );
};
Index.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default Index;