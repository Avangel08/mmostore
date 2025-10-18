import React, { useEffect } from "react";
import { useThemeConfig } from "../../hooks/useThemeConfig";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { changeLayoutTheme } from "../../../../../slices/thunk";
import PageHeader from "../PageHeader/PageHeader";
import { Head, router, usePage } from "@inertiajs/react";
import { Card, Col, Container, Row, ToastContainer } from "react-bootstrap";
import TablePaymentHistory from "./TablePaymentHistory";
import Layout from "../../Layouts";

interface PaymentHistoryProps {
    // Add any props if needed
}

const PaymentHistory = () => {
    const { listBalanceHistory } = usePage().props;
    const theme = useThemeConfig()
    const dispatch: any = useDispatch();
    useEffect(() => {
        if (theme) {
            dispatch(changeLayoutTheme(theme?.theme));
        }
    }, [theme, dispatch])

    const { t } = useTranslation();

    const buildQuery = (p: any = {}) => ({
        page: Number(p.page || 1),
        perPage: Number(p.perPage || 10),
        search: p.name || "",
        start_time: p.createdDateStart || "",
        end_time: p.createdDateEnd || "",
    });

    const fetchData = (
        currentPage: number = 1,
        perPage: number = 10,
        filters?: any
    ) => {
        router.reload({
            only: ["listBalanceHistory"],
            data: buildQuery({
                page: currentPage,
                perPage: perPage,
                ...(filters || {}),
            }),
        });
    };
    return (
        <React.Fragment>
            <Head title={`${t("Payment History")} - ${theme?.storeName ?? ""}`} />
            <PageHeader theme={theme} />
            <ToastContainer />
            <Container fluid className="custom-container mt-4">
                <Row>
                    <Col>
                        <Card className="shadow-sm p-2" style={{ minHeight: "50vh" }}>
                            <Card.Header>
                                <h5 className="card-title mb-0">{t("Payment History")}</h5>
                            </Card.Header>
                            <Card.Body>
                                <TablePaymentHistory
                                    data={listBalanceHistory || []}
                                    onReloadTable={fetchData}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
};
PaymentHistory.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default PaymentHistory;