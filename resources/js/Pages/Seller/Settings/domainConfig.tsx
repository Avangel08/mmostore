import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { router, usePage } from "@inertiajs/react";
import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";

type initialValuesProps = {
    domains: string[];
};

const domainRegex = /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/; // chỉ check domain hợp lệ

const DomainConfig = () => {
    const { t } = useTranslation()
    const { settings, domains, domainSuffix } = usePage().props as any

    const formik = useFormik<initialValuesProps>({
        enableReinitialize: true,
        initialValues: {
            domains: settings?.domains || [""],
        },
        validationSchema: Yup.object({
            domains: Yup.array()
                .of(Yup.string()
                    .required(t("Please enter domain"))
                    .test(
                        "is-valid-domain",
                        "Domain format is invalid",
                        (value) => !value || domainRegex.test(value)
                    )
                    // ✅ Kiểm tra không chứa suffix bị cấm
                    .test(
                        "not-contain-suffix",
                        `Domain cannot contain ${domainSuffix}`,
                        (value) =>
                            !value || !value.toLowerCase().includes(domainSuffix.toLowerCase())
                    ))
                .test("unique", t("Domains must be unique"), (list) => {
                    if (!list) return true;
                    return new Set(list).size === list.length; // kiểm tra trùng trong chính form
                })
                .test("notInDefault", t("Cannot duplicate system domains"), (list) => {
                    if (!list) return true;
                    return !list.some((item) => domains.includes(item));
                }),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("domains", JSON.stringify(values.domains));
            const url = route("seller.theme-settings.update", { id: settings.id })
            router.post(url, formData, {
                preserveScroll: true,
                onSuccess: (success: any) => {
                    if (success.props?.message?.error) {
                        showToast(t(success.props.message.error), "error");
                        return;
                    }

                    if (success.props?.message?.success) {
                        showToast(t(success.props.message.success), "success");
                        formik.resetForm();
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
        }
    })


    return (
        <React.Fragment>
            <FormikProvider value={formik}>
                <Form noValidate onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <h5 className="mb-2">{t("Domain")}<span className="text-danger">*</span></h5>
                        <p className="text-muted fs-14 mb-1">{t("To ensure that a website can be recognized and displayed to users, it must always have a primary domain name. Only one domain can be selected as the main domain")}</p>
                        <p className="text-muted fs-14 mb-3">
                            Tên miền mặc định:{" "}<span className="fst-italic">{domains}</span>
                        </p>
                        <Row>
                            <Col>
                                {/* <Form.Group>
                                    <Form.Control
                                        type="hidden"
                                        className="form-control"
                                        disabled
                                        id="setting-title-input"
                                        placeholder={t("Enter name store")}
                                        value={domains}
                                    />
                                </Form.Group> */}
                                <FieldArray
                                    name="domains"
                                    render={(arrayHelpers) => (
                                        <div className="mb-3">
                                            {formik.values.domains.map((domain, index) => (
                                                <Row key={index} className="mb-2">
                                                    <Col>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-domain"
                                                            value={domain}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            name={`domains[${index}]`}
                                                            placeholder={t("Enter your domain")}
                                                        />
                                                    </Col>
                                                    {formik.values.domains.length > 1 && <Col xs="auto">
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => arrayHelpers.remove(index)}
                                                        // disabled={formik.values.domains.length === 1}
                                                        >
                                                            <i className="ri-indeterminate-circle-line"></i>
                                                        </Button>
                                                    </Col>}
                                                </Row>
                                            ))}
                                            <Button
                                                variant="secondary"
                                                onClick={() => arrayHelpers.push("")}
                                                disabled
                                            >
                                                <i className="ri-add-circle-line"></i>{" "}{t("Add domain")}
                                            </Button>
                                        </div>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                                    {" "}
                                    {formik.errors.domains}{" "}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                    </div>
                    <div className="text-start">
                        <Button type="submit" variant="success">
                            {t("Update")}
                        </Button>
                    </div>
                </Form>
            </FormikProvider>
        </React.Fragment >
    )
}

export default DomainConfig;