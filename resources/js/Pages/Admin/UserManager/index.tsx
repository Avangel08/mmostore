import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import RoleManagement from "../RoleManagement";

const UserManager = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Head title={t("User")} />

        </React.Fragment>
    );
};

UserManager.layout = (page: any) => <Layout children={page} />;

export default UserManager;
