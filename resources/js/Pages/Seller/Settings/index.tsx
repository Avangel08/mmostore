import { Head, router, usePage } from "@inertiajs/react";
import React from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "../../../CustomSellerLayouts";
import ThemeConfigs from "./themeConfig";
import DomainConfig from "./domainConfig";
import ContactConfig from "./contactConfig";
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
    contacts: Array<{
        type: string;
        value: string;
    }>;
};

export type Props = {
    validation: FormikProps<StoreFormValues>;
};

const ThemeSettings = () => {
    const { t } = useTranslation()
    const { settings, domains } = usePage().props as any
    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            theme: settings?.theme || "theme_1",
            storeName: settings?.storeName || "MMOShop",
            storeLogo: settings?.storeLogo || "https://coco.mmostore.local/storage/coco.mmostore.local/logo-light.png",
            pageHeaderImage: settings?.pageHeaderImage || "",
            pageHeaderText: settings?.pageHeaderText || "Hello, welcome to my store",
            domains: domains || [""],
            contacts: settings?.contacts || [{type: "", value: ""}],
        },
        validationSchema: Yup.object({
            storeName: Yup.string().required("Please Enter a Product Title"),
            pageHeaderImage: Yup.mixed().required(t("Please select a image")),
            storeLogo: Yup.mixed().required(t("Please select a logo store")),
            pageHeaderText: Yup.string().required(t("Please enter page header text")),
            domains: Yup.array().of(
                Yup.string()
                    .required()
            ),
            contacts: Yup.array().of(
                Yup.object().shape({
                    type: Yup.string().required(t("Please select contact type")),
                    value: Yup.string().when('type', {
                        is: (type: string) => type && type.length > 0,
                        then: (schema) => schema.required(t("Please enter contact value")),
                        otherwise: (schema) => schema.notRequired()
                    })
                })
            )
        }),
        onSubmit: (values) => {
            validation.setFieldTouched('contacts', true);
            values.contacts.forEach((_: any, index: number) => {
                validation.setFieldTouched(`contacts.${index}.type`, true);
                validation.setFieldTouched(`contacts.${index}.value`, true);
            });

            if (!validation.isValid) {
                setTimeout(() => {
                    const firstEmptyContact = values.contacts.findIndex((contact: any) => !contact.type);
                    if (firstEmptyContact !== -1) {
                        const contactDropdown = document.querySelector(`[data-contact-index="${firstEmptyContact}"] .contact-dropdown-toggle`);
                        if (contactDropdown) {
                            (contactDropdown as HTMLElement).focus();
                            return;
                        }
                    }

                    const firstContactWithTypeButNoValue = values.contacts.findIndex((contact: any) => contact.type && !contact.value);
                    if (firstContactWithTypeButNoValue !== -1) {
                        const contactInput = document.querySelector(`[data-contact-index="${firstContactWithTypeButNoValue}"] input[type="text"]`);
                        if (contactInput) {
                            (contactInput as HTMLElement).focus();
                            return;
                        }
                    }

                    const firstInvalidField = document.querySelector('.is-invalid');
                    if (firstInvalidField) {
                        (firstInvalidField as HTMLElement).focus();
                    }
                }, 100);
                return;
            }

            const formData = new FormData();
            formData.append("theme", values.theme);
            formData.append("store_settings", JSON.stringify({
                storeName: values.storeName,
                storeLogo: values.storeLogo,
                pageHeaderImage: values.pageHeaderImage,
                pageHeaderText: values.pageHeaderText,
                contacts: values.contacts
            }));
            formData.append("domains", JSON.stringify(values.domains));
            const url = route("seller.theme-settings.update", {id: settings.id})
            router.post(url, formData, {
                preserveScroll: true,
                onSuccess: (success: any) => {
                    if (success.props?.message?.error) {
                        showToast(t(success.props.message.error), "error");
                        return;
                    }

                    if (success.props?.message?.success) {
                        showToast(t(success.props.message.success), "success");
                        validation.resetForm();
                    } else {
                        showToast(t("Settings updated successfully"), "success");
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
            <Head title={t("Theme setting")}/>
            <div className="page-content">
                <ToastContainer/>
                <Container fluid>
                    <BreadCrumb
                        title={t("Theme setting")}
                        pageTitle={t("Homepage")}
                    />
                    <Row>
                        <Col lg={12}>
                            <FormikProvider value={validation}>
                                <Form noValidate onSubmit={validation.handleSubmit}>
                                    <ThemeConfigs validation={validation}/>
                                    <ContactConfig validation={validation}/>
                                    <DomainConfig validation={validation}/>
                                    <div className="text-end mb-3">
                                        <Button type="submit" variant="success">
                                            {t("Submit")}
                                        </Button>
                                    </div>
                                </Form>
                            </FormikProvider>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

ThemeSettings.layout = (page: any) => <Layout children={page}/>;
export default ThemeSettings;