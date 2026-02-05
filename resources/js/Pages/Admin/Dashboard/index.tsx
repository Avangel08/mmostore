import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import RoleManagement from "../RoleManagement";

const Dashboard = () => {
    const { t } = useTranslation();
    const titleWeb = t("Dashboard") + " - Admin";

    return (
        <React.Fragment>
            <Head title={ titleWeb }/>

        </React.Fragment>
    );
};

Dashboard.layout = (page: any) => <Layout children={page} />;

export default Dashboard;
