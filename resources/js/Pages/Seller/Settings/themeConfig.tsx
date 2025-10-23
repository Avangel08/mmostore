import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { Link, router, usePage } from "@inertiajs/react";
import * as Yup from "yup";
import CustomCKEditor from "../../../Components/CustomCKEditor";
import { showToast } from "../../../utils/showToast";
import Select from "react-select";

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Import image

import img1 from "../../../../images/landing/showcase/theme-store-1.png"
import img2 from "../../../../images/landing/showcase/theme-store-2.png"
import img3 from "../../../../images/landing/showcase/theme-store-3.png"

type initialValuesProps = {
    theme: string;
    storeName: string;
    storeLogo: string;
    pageHeaderImage: string;
    pageHeaderText: string;
    currency: string;
    metaDescription: string;
};

const LIST_THEMES = [
    {
        key: "theme_1",
        label: "Theme 1",
        image: img1
    },
    {
        key: "theme_2",
        label: "Theme 2",
        image: img2
    },
    {
        key: "theme_3",
        label: "Theme 3",
        image: img3
    },

]


const ThemeConfigs = () => {
    const { t } = useTranslation()
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [files, setFiles] = useState<any>([]);
    const errors = usePage().props.errors as any;
    const storageUrl = usePage().props.storageUrl as string;
    const { settings, currency_options } = usePage().props as any
    const isEditMode = Boolean(settings);

    const formik = useFormik<initialValuesProps>({
        enableReinitialize: true,
        initialValues: {
            theme: settings?.theme || "theme_1",
            storeName: settings?.storeName || "",
            storeLogo: settings?.storeLogo || "",
            pageHeaderImage: settings?.pageHeaderImage || "",
            pageHeaderText: settings?.pageHeaderText || "Hello, welcome to my store",
            currency: settings?.currency || "VND",
            metaDescription: settings?.metaDescription || ""
        },
        validationSchema: Yup.object({
            storeName: Yup.string().required("Please enter store name"),
            pageHeaderImage: Yup.mixed().required("Please select a image"),
            storeLogo: Yup.mixed().required("Please select a logo store"),
            pageHeaderText: Yup.string().required("Please enter page header text"),
            currency: Yup.string().required(t("Please choose currency")),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("theme", values.theme);
            formData.append("storeName", values.storeName);
            formData.append("storeLogo", values.storeLogo);
            formData.append("pageHeaderImage", values.pageHeaderImage);
            formData.append("pageHeaderText", values.pageHeaderText);
            formData.append("currency", values.currency);
            formData.append("metaDescription", values.metaDescription);
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

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            setSelectedImage(e.target.result);
            formik.setFieldValue("storeLogo", file);
            formik.setFieldTouched("storeLogo", true);
        };
        reader.readAsDataURL(file);
    };

    return (
        <React.Fragment>
            <Form noValidate onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">{t("Store")}</h5>
                        <div className="d-flex gap-2">
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-success"
                            >
                                <i className="ri-eye-line align-bottom me-1"></i>
                                {t("View store")}
                            </a>
                        </div>
                    </div>
                    <Row>
                        <Col>
                            <div className="mb-3">
                                <div className="fs-13 mb-3 fw-medium">
                                    <span>{t('Theme')}{" "}<span className="text-danger">*</span></span>
                                </div>
                                <Row>
                                    {LIST_THEMES.map(sub => (
                                        <Col key={sub.key} xs="4">
                                            <div className="text-center">
                                                <img src={sub.image} className="rounded avatar-xl mb-2" />
                                                <Form.Group className="d-flex align-items-center justify-content-center gap-2">
                                                    <Form.Check
                                                        type="radio"
                                                        name="theme"
                                                        value={String(sub.key)}
                                                        id={`${sub.key}`}
                                                        disabled={sub.key === "theme_2" || sub.key === "theme_3"}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        checked={formik.values.theme === String(sub.key)}
                                                    />
                                                    <Form.Label
                                                        htmlFor={`${sub.key}`}
                                                        className={`text-muted mb-0 ${sub.key === "theme_2" || sub.key === "theme_3" ? "cursor-default" : "cursor-pointer"}`}
                                                    >
                                                        {t(sub.label)}
                                                    </Form.Label>
                                                </Form.Group>
                                                {sub.key === "theme_2" || sub.key === "theme_3" ? (
                                                    <div style={{ fontSize: 12, fontStyle: "italic", color: "#fd7e14" }}>
                                                        {t("Coming soon")}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            {/** Currency */}
                            {/* <div className="mb-3">
                                <Form.Group controlId="currency">
                                    <Form.Label>
                                        {t("Currency")}{" "}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Select
                                        options={currency_options}
                                        placeholder={t("Select currency")}
                                        name="currency"
                                        value={currency_options.find(
                                            (option: any) => option.value === formik.values.currency
                                        )}
                                        onChange={(selectedOption: any) => {
                                            formik.setFieldValue(
                                                "currency",
                                                selectedOption?.value || ""
                                            );
                                        }}
                                        onBlur={() =>
                                            formik.setFieldTouched("currency", true)
                                        }
                                    />
                                    {((formik.touched.currency &&
                                        formik.errors.currency) ||
                                        errors?.currency) && (
                                            <div className="invalid-feedback d-block">
                                                {t(
                                                    formik.errors.currency || errors?.currency
                                                )}
                                            </div>
                                        )}
                                </Form.Group>
                            </div> */}
                            {/** Store Name */}
                            <div className="mb-3">
                                <Form.Group>
                                    <Form.Label
                                        className="form-label"
                                        htmlFor="setting-title-input"
                                    >
                                        {t('Store name')}{" "}<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="storeName"
                                        id="setting-title-input"
                                        placeholder={t("Enter name store")}
                                        value={formik.values.storeName}
                                        isInvalid={!!(formik.touched?.storeName && formik.errors?.storeName)}
                                    />
                                </Form.Group>
                                <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                                    {" "}
                                    {formik.errors.storeName}{" "}
                                </Form.Control.Feedback>
                            </div>
                            {/** Store Logo */}
                            {isEditMode && settings?.storeLogo && (
                                <div className="mb-3">
                                    <div className="fs-13 mb-3 fw-medium">
                                        <span>{t("Current store logo")}</span>
                                    </div>
                                    <a
                                        target="_blank"
                                        href={`${storageUrl}/${settings?.storeLogo}`}
                                    >
                                        <img
                                            src={`${storageUrl}/${settings?.storeLogo}?v=${Date.now()}`}
                                            style={{
                                                maxWidth: "200px",
                                                maxHeight: "200px",
                                                objectFit: "contain",
                                                border: "1px solid #dee2e6",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    </a>
                                </div>
                            )}
                            <div className="mb-4">
                                <h5 className="fs-14 mb-2">{t("Logo")}{" "}<span className="text-danger">*</span></h5>
                                <p className="text-muted fst-italic">Kích thước tối thiểu: 124 × 17 px</p>
                                <div className="text-center">
                                    <div className="position-relative d-inline-block">
                                        <div className="position-absolute top-100 start-100 translate-middle">
                                            <Form.Group>
                                                <Form.Label
                                                    htmlFor="customer-image-input"
                                                    className="mb-0"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="right"
                                                    title="Select Image"
                                                >
                                                    <div className="avatar-xs cursor-pointer">
                                                        <div className="avatar-title bg-light border rounded-circle text-muted">
                                                            <i className="ri-image-fill"></i>
                                                        </div>
                                                    </div>
                                                </Form.Label>
                                                <Form.Control
                                                    className="form-control d-none"
                                                    id="customer-image-input"
                                                    type="file"
                                                    name="storeLogo"
                                                    accept="image/png, image/gif, image/jpeg"
                                                    onChange={handleImageChange}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="avatar-lg">
                                            <div className="avatar-title bg-light rounded">
                                                <img
                                                    src={selectedImage}
                                                    id="product-img"
                                                    alt=""
                                                    className="avatar-md h-auto"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {formik.errors.storeLogo && formik.touched.storeLogo ? (
                                    <div className="invalid-feedback d-block">
                                        {t(formik.errors.storeLogo || errors?.storeLogo)}
                                    </div>
                                ) : null}
                            </div>

                            {/** Page header image */}
                            {isEditMode && settings?.pageHeaderImage && (
                                <div className="mb-3">
                                    <div className="fs-13 mb-3 fw-medium">
                                        <span>{t("Current page header image")}</span>
                                    </div>
                                    <a
                                        target="_blank"
                                        href={`${storageUrl}/${settings?.pageHeaderImage}`}
                                    >
                                        <img
                                            src={`${storageUrl}/${settings?.pageHeaderImage}?v=${Date.now()}`}
                                            style={{
                                                maxWidth: "200px",
                                                maxHeight: "200px",
                                                objectFit: "contain",
                                                border: "1px solid #dee2e6",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    </a>
                                </div>
                            )}
                            <div className="mb-3">
                                <Form.Label>{t('Page header image')}{" "}<span className="text-danger">*</span></Form.Label>
                                <p className="text-muted fst-italic">Kích thước yêu cầu: 262 × 195 px</p>
                                <FilePond
                                    files={files}
                                    onupdatefiles={(fileItems) => {
                                        setFiles(fileItems);
                                        if (fileItems.length > 0 && fileItems[0].file) {
                                            const file = fileItems[0].file;
                                            formik.setFieldValue("pageHeaderImage", file);
                                            formik.setFieldTouched("pageHeaderImage", true);
                                        } else {
                                            formik.setFieldValue("pageHeaderImage", null);
                                            formik.setFieldTouched("pageHeaderImage", true);
                                        }
                                    }}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    name="pageHeaderImage"
                                    acceptedFileTypes={[
                                        "image/jpeg",
                                        "image/jpg",
                                        "image/png",
                                        "image/gif",
                                        "image/webp",
                                    ]}
                                    labelIdle={t(
                                        `📷 ${t(
                                            "Drag & Drop your image or"
                                        )} <span class="filepond--label-action">${t(
                                            "Choose file"
                                        )}</span>`
                                    )}
                                    maxFileSize={"2MB"}
                                    instantUpload={false}
                                    credits={false}
                                    className={
                                        (formik.touched.pageHeaderImage && formik.errors.pageHeaderImage) ||
                                            errors?.pageHeaderImage
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {((formik.touched.pageHeaderImage && formik.errors.pageHeaderImage) ||
                                    errors?.pageHeaderImage) && (
                                        <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                                            {t(formik.errors.pageHeaderImage || errors?.pageHeaderImage)}
                                        </Form.Control.Feedback>
                                    )}
                            </div>
                            {/** Page header text */}
                            <div className="mb-3">
                                <Form.Label>{t("Page header text")}</Form.Label>
                                <CustomCKEditor
                                    data={formik.values.pageHeaderText}
                                    onChange={(data: string) => {
                                        formik.setFieldValue("pageHeaderText", data);
                                    }}
                                    onBlur={() =>
                                        formik.setFieldTouched("pageHeaderText", true)
                                    }
                                    placeholder={t("Enter detailed description")}
                                />
                                {((formik.touched.pageHeaderText && formik.errors.pageHeaderText) ||
                                    errors?.pageHeaderText) && (
                                        <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                                            {t(formik.errors.pageHeaderText || errors?.pageHeaderText)}
                                        </Form.Control.Feedback>
                                    )
                                }
                            </div>
                            {/** Meta tags */}
                            <h5 className="mb-3">{t("Meta tags")}</h5>
                            {/** Meta description */}
                            <div className="mb-3">
                                <Form.Group>
                                    <Form.Label
                                        className="form-label"
                                        htmlFor="setting-meta-description-input"
                                    >
                                        {t('Meta description')}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="metaDescription"
                                        id="setting-meta-description-input"
                                        placeholder={t("Enter meta description")}
                                        value={formik.values.metaDescription}
                                    />
                                </Form.Group>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="text-start">
                    <Button type="submit" variant="success">
                        {t("Update")}
                    </Button>
                </div>
            </Form>
        </React.Fragment>
    )
}

export default ThemeConfigs;