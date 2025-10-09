import { Head, router, usePage } from "@inertiajs/react";
import React from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "../../../CustomSellerLayouts";
import ThemeConfigs from "./themeConfig";
import DomainConfig from "./domainConfig";

//formik
import { FormikProps, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";

type StoreFormValues = {
    theme: string;
    storeName: string;
    storeLogo: string;
    pageHeaderImage: string;
    pageHeaderText: string;
    domains: string[];
};

export type Props = {
    validation: FormikProps<StoreFormValues>;
};

const ThemeSettings = () => {
    const { t } = useTranslation()
    const { settings, domains } = usePage().props as any
    console.log({ settings })
    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            theme: settings?.theme || "theme_1",
            storeName: settings?.storeName || "MMOShop",
            storeLogo: settings?.storeLogo || "https://coco.mmostore.local/storage/coco.mmostore.local/logo-light.png",
            pageHeaderImage: settings?.pageHeaderImage || "",
            pageHeaderText: settings?.pageHeaderText || "Hello, welcome to my store",
            domains: domains || [""],
        },
        validationSchema: Yup.object({
            storeName: Yup.string().required("Please Enter a Product Title"),
            pageHeaderImage: Yup.mixed().required(t("Please select a image")),
            storeLogo: Yup.mixed().required(t("Please select a logo store")),
            pageHeaderText: Yup.string().required(t("Please enter page header text")),
            domains: Yup.array().of(
                Yup.string()
                    .required()
            )
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("theme", values.theme);
            formData.append("store_settings", JSON.stringify({
                storeName: values.storeName,
                storeLogo: values.storeLogo,
                pageHeaderImage: values.pageHeaderImage,
                pageHeaderText: values.pageHeaderText
            }));
            formData.append("domains", JSON.stringify(values.domains));
            const url = route("seller.theme-settings.update", { id: settings.id })
            console.log({values})
            return;
            router.put(url, formData, {
                preserveScroll: true,
                onSuccess: (success: any) => {
                    if (success.props?.message?.error) {
                        showToast(t(success.props.message.error), "error");
                        return;
                    }

                    if (success.props?.message?.success) {
                        showToast(t(success.props.message.success), "success");
                        validation.resetForm();
                    }
                },
                onError: (errors: any) => {
                    Object.keys(errors).forEach((key) => {
                        showToast(t(errors[key]), "error");
                    });
                },
            });
        },
    });

    return (
        <React.Fragment>
            <Head title={t("Theme Settings Management")} />
            <div className="page-content">
                <ToastContainer />
                <Container fluid>
                    <BreadCrumb
                        title={t("Theme Settings Management")}
                        pageTitle={t("Homepage")}
                    />
                    <Row>
                        <Col lg={7}>
                            <FormikProvider value={validation}>
                                <Form noValidate onSubmit={validation.handleSubmit}>
                                    <ThemeConfigs validation={validation} />
                                    <DomainConfig validation={validation} />
                                    <div className="text-end mb-3">
                                        <Button type="submit" variant="success">
                                            {t("Submit")}
                                        </Button>
                                    </div>
                                </Form>
                            </FormikProvider>
                        </Col>
                        <Col lg={5}>
                            <Card>
                                <Card.Header>
                                    <h5 className="card-title mb-0">{t("Preview")}</h5>
                                </Card.Header>
                                <Card.Body>
                                    Empty :)
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

ThemeSettings.layout = (page: any) => <Layout children={page} />;
export default ThemeSettings;