import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import Layout from "../../../CustomSellerLayouts";

const Dashboard = () => {
    const { t } = useTranslation();

    const getSubdomain = () => {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length >= 3) {
            const subdomain = parts[0];
            return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
        }
        return 'Merdify';
    };

    const titleWeb = t("Dashboard") + " - " +  getSubdomain();


    return (
        <React.Fragment>
            <Head title={ titleWeb } />
            <div className="page-content">
                
            </div>
        </React.Fragment>
    );
};
Dashboard.layout = (page: any) => <Layout children={page} />;
export default Dashboard;
