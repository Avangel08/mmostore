import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react"
import { useFormik } from "formik";
import { useTranslation } from "react-i18next"
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "../../../CustomAdminLayouts";
import CustomCKEditor from "../../../Components/CustomCKEditor";
import Select from "react-select";

// import file
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import { showToast } from "../../../utils/showToast";


const PostForm = () => {
    const { post, optionStatus, optionVisibility, errors } = usePage().props as any
    console.log({ post })
    const isEditMode = !!post;
    const [files, setFiles] = useState<any[]>([]);
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            title: post?.data?.title || "",
            content: post?.data?.content || "",
            thumbnail: null as File | null,
            status: post?.data?.status || "PUBLISHED",
            visibility: post?.data?.visibility || "PUBLIC",
            category_id: null,
            published_at: post?.data?.published_at || null,
            shortDescription: post?.data?.short_description || ""
        },
        // validationSchema: ({}),
        onSubmit: (values) => {
            try {
                const url = isEditMode
                    ? route("admin.posts.update", { id: post.id })
                    : route("admin.posts.store");

                const method = isEditMode ? "put" : "post";

                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("visibility", values.visibility);
                formData.append("status", values.status);
                formData.append("content", values.content);
                formData.append("published_at", values.published_at);
                formData.append("shortDescription", values.shortDescription);
                if (values.thumbnail) {
                    formData.append("thumbnail", values.thumbnail);
                }

                if (method === "put") {
                    formData.append("_method", "PUT");
                }

                router.post(url, formData, {
                    preserveScroll: true,
                    onSuccess: (success: any) => {
                        if (success.props?.message?.error) {
                            showToast(t(success.props.message.error), "error");
                            return;
                        }
                        if (success.props?.message?.success) {
                            showToast(t(success.props.message.success), "success");
                        }
                        if (isEditMode) {
                            setFiles([]);
                        } else {
                            setTimeout(() => {
                                router.get(route("seller.product.index"));
                            }, 1500);
                        }
                    },
                    onError: (errors: any) => {
                        Object.keys(errors).forEach((key) => {
                            showToast(t(errors[key]), "error");
                        });
                    },
                });
            } catch (error) {
                console.log(error)
            } finally {
                formik.setSubmitting(false);
            }
        }
    })

    const translatedOptions = (arr: any) => {
        return arr.map((option: any) => (
            { value: option.value, label: t(option.label) }
        ))
    }

    return (
        <React.Fragment>
            <Head title="Create Post | Admin Panel" />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Create Post" pageTitle="Posts" />
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col lg={8}>
                                <Card>
                                    <Card.Body>
                                        {/** Post title */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t("Title")}{" "}
                                                <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                placeholder={t("Enter post title")}
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {t(formik.errors.title || errors?.title)}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        {/** Post thumbnail */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                {t("Thumbnail Image")}{" "}
                                                <span className="text-danger">*</span>
                                            </Form.Label>
                                            <FilePond
                                                files={files}
                                                onupdatefiles={(fileItems) => {
                                                    setFiles(fileItems);
                                                    if (fileItems.length > 0 && fileItems[0].file) {
                                                        const file = fileItems[0].file;
                                                        formik.setFieldValue("thumbnail", file);
                                                        formik.setFieldTouched("thumbnail", true);
                                                    } else {
                                                        formik.setFieldValue("thumbnail", null);
                                                        formik.setFieldTouched("thumbnail", true);
                                                    }
                                                }}
                                                allowMultiple={false}
                                                maxFiles={1}
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
                                                allowRevert={true}
                                                allowRemove={true}
                                                instantUpload={false}
                                                credits={false}
                                                className={
                                                    (formik.touched.thumbnail && formik.errors.thumbnail) ||
                                                        errors?.thumbnail
                                                        ? "is-invalid"
                                                        : ""
                                                }
                                            />
                                            {((formik.touched.thumbnail && formik.errors.thumbnail) ||
                                                errors?.thumbnail) && (
                                                    <div className="invalid-feedback d-block">
                                                        {t(formik.errors.thumbnail || errors?.thumbnail)}
                                                    </div>
                                                )}
                                        </Form.Group>
                                        {/** Post short description */}
                                        <Form.Group controlId="shortDescription" className="mb-3">
                                            <Form.Label>
                                                {t("Short description")}{" "}
                                                <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder={t("Enter short description")}
                                                name="shortDescription"
                                                maxLength={255}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.shortDescription}
                                                isInvalid={
                                                    !!(
                                                        (formik.touched.shortDescription &&
                                                            formik.errors.shortDescription) ||
                                                        errors?.shortDescription
                                                    )
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {t(
                                                    formik.errors.shortDescription ||
                                                    errors?.shortDescription
                                                )}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        {/** Post content */}
                                        <Form.Group controlId="content" className="mb-3">
                                            <Form.Label>
                                                {t("Content")}{" "}
                                                <span className="text-danger">*</span>
                                            </Form.Label>
                                            <CustomCKEditor
                                                data={formik.values.content}
                                                onChange={(data: string) => {
                                                    formik.setFieldValue("content", data);
                                                }}
                                                onBlur={() =>
                                                    formik.setFieldTouched("content", true)
                                                }
                                                placeholder={t("Enter post content")}
                                            />
                                            {((formik.touched.content &&
                                                formik.errors.content) ||
                                                errors?.content) && (
                                                    <div className="invalid-feedback d-block">
                                                        {t(
                                                            formik.errors.content ||
                                                            errors?.content
                                                        )}
                                                    </div>
                                                )}
                                        </Form.Group>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>
                                                        {t("Category")}{" "}
                                                        <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Select
                                                        options={[]}
                                                        placeholder={t("Select category")}
                                                        name="category_id"
                                                        value={[].find(
                                                            (option: any) => option.value === formik.values.category_id
                                                        )}
                                                        onChange={(selectedOption: any) => {
                                                            formik.setFieldValue(
                                                                "category_id",
                                                                selectedOption?.value || ""
                                                            );
                                                        }}
                                                    // onBlur={() =>
                                                    //     formik.setFieldTouched("category_id", true)
                                                    // }
                                                    />
                                                    {((formik.touched.category_id &&
                                                        formik.errors.category_id) ||
                                                        errors?.category_id) && (
                                                            <div className="invalid-feedback d-block">
                                                                {t(
                                                                    formik.errors.category_id || errors?.category_id
                                                                )}
                                                            </div>
                                                        )}
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="form-label">{t("Published Date")}</Form.Label>
                                                    <Flatpickr
                                                        className="form-control"
                                                        options={{
                                                            dateFormat: "d M Y, H:i",
                                                            enableTime: true
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>

                                <div className="text-end mb-4">
                                    {/* <button className="btn btn-secondary me-2" type="button">
                                        Cancel
                                    </button> */}
                                    <button
                                        className="btn btn-success"
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? t("Processing...") : t("Create")}
                                    </button>
                                </div>

                            </Col>

                            <Col lg={4}>
                                <Card>
                                    <Card.Header>
                                        <h5 className="card-title mb-0">{t("Post Settings")}</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t("Status")}{" "}</Form.Label>
                                            <Select
                                                options={translatedOptions(optionStatus)}
                                                placeholder={t("Select status")}
                                                name="status"
                                                value={translatedOptions(optionStatus).find(
                                                    (option: any) => option.value === formik.values.status
                                                )}
                                                onChange={(selectedOption: any) => {
                                                    formik.setFieldValue(
                                                        "status",
                                                        selectedOption?.value || ""
                                                    );
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>{t("Visibility")}</Form.Label>
                                            <Select
                                                options={translatedOptions(optionVisibility)}
                                                placeholder={t("Select visibility")}
                                                name="visibility"
                                                value={translatedOptions(optionVisibility).find(
                                                    (option: any) => option.value === formik.values.visibility
                                                )}
                                                onChange={(selectedOption: any) => {
                                                    formik.setFieldValue(
                                                        "visibility",
                                                        selectedOption?.value || ""
                                                    );
                                                }}
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        </React.Fragment>
    )
}

PostForm.layout = (page: any) => <Layout children={page} />;

export default PostForm;