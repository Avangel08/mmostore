import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Props } from ".";

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
import { usePage } from "@inertiajs/react";
import CustomCKEditor from "../../../Components/CustomCKEditor";

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


const ThemeConfigs = ({ validation }: Props) => {
    const { t } = useTranslation()
    const [selectedImage, setSelectedImage] = useState<any>(validation?.values.storeLogo ?? null);
    const [files, setFiles] = useState<any>([]);
    const errors = usePage().props.errors as any;
    const storageUrl = usePage().props.storageUrl as string;
    const { settings } = usePage().props as any
    const isEditMode = Boolean(settings);
    
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            setSelectedImage(e.target.result);
            validation.setFieldValue("storeLogo", e.target.result);
            validation.setFieldTouched("storeLogo", true);
        };
        reader.readAsDataURL(file);
    };

    return (
        <React.Fragment>
            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">{t("Store")}</h5>
                    <div className="d-flex gap-2">
                        <Button variant="outline-success" size="sm">
                            <i className="ri-eye-line align-bottom me-1"></i>{" "}
                            {t("View store")}
                        </Button>
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
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        checked={validation.values.theme === String(sub.key)}
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
                                            { t("Coming soon") }
										</div>
									) : null}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
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
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        name="storeName"
                                        id="setting-title-input"
                                        placeholder={t("Enter name store")}
                                        value={validation.values.storeName}
                                        isInvalid={
                                            !!(
                                                (validation.touched.storeName &&
                                                    validation.errors.storeName) ||
                                                errors?.productName
                                            )
                                        }
                                    />
                                </Form.Group>
                                <Form.Control.Feedback type="invalid">
                                    {" "}
                                    {validation.errors.storeName}{" "}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-4">
                                <h5 className="fs-14 mb-1">{t("Logo")}{" "}<span className="text-danger">*</span></h5>
                                <p className="text-muted">{t("Add a logo for your store")}</p>
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
                                {validation.errors.storeLogo && validation.touched.storeLogo ? (
                                    <div className="invalid-feedback d-block">
                                        {t(validation.errors.storeLogo || errors?.storeLogo)}
                                    </div>
                                ) : null}
                            </div>

                            {isEditMode && settings?.image && (
                                <Row className="mb-4">
                                    <Col md={12}>
                                        <Form.Group>
                                            <div className="mb-3">
                                                <div className="fs-13 mb-3 fw-medium">
                                                    <span>{t("Current product image")}</span>
                                                </div>
                                                <a
                                                    target="_blank"
                                                    href={`${storageUrl}/${settings?.store_settings?.pageHeaderImage}`}
                                                >
                                                    <img
                                                        src={`${storageUrl}/${settings?.store_settings?.pageHeaderImage}?v=${Date.now()}`}
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
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            {/** Page header image */}
                            <div className="mb-3">
                                <Form.Label>{t("Page header image")}{" "}<span className="text-danger">*</span></Form.Label>
                                <FilePond
                                    files={files}
                                    onupdatefiles={(fileItems) => {
                                        setFiles(fileItems);
                                        if (fileItems.length > 0 && fileItems[0].file) {
                                            const file = fileItems[0].file;
                                            validation.setFieldValue("pageHeaderImage", file);
                                            validation.setFieldTouched("pageHeaderImage", true);
                                        } else {
                                            validation.setFieldValue("pageHeaderImage", null);
                                            validation.setFieldTouched("pageHeaderImage", true);
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
                                        (validation.touched.pageHeaderImage && validation.errors.pageHeaderImage) ||
                                            errors?.pageHeaderImage
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {((validation.touched.pageHeaderImage && validation.errors.pageHeaderImage) ||
                                    errors?.pageHeaderImage) && (
                                        <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                                            {t(validation.errors.pageHeaderImage || errors?.pageHeaderImage)}
                                        </Form.Control.Feedback>
                                    )}
                            </div>
                            {/** Page header text */}
                            <div className="mb-3">
                                <Form.Label>{t("Page header text")}</Form.Label>
                                <CustomCKEditor
                                    data={validation.values.pageHeaderText}
                                    onChange={(data: string) => {
                                        validation.setFieldValue("pageHeaderText", data);
                                    }}
                                    onBlur={() =>
                                        validation.setFieldTouched("pageHeaderText", true)
                                    }
                                    placeholder={t("Enter detailed description")}
                                />
                                {((validation.touched.pageHeaderText && validation.errors.pageHeaderText) ||
                                    errors?.pageHeaderText) && (
                                        <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                                            {t(validation.errors.pageHeaderText || errors?.pageHeaderText)}
                                        </Form.Control.Feedback>
                                    )
                                }
                            </div>
                        </Col>
                    </Row>
            </div>

        </React.Fragment>
    )
}

export default ThemeConfigs;