import React, { useState, useEffect } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Head, router, usePage } from "@inertiajs/react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { showToast } from "../../../utils/showToast";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

export default function product() {
  const { t } = useTranslation();
  const { product, categories } = usePage().props as any;
  const isEditMode = !!product;
  const errors = usePage().props.errors as any;
  const storageUrl = usePage().props.storageUrl as string;
  const [categoriesState, setCategoriesState] = useState(categories || []);
  const [files, setFiles] = useState<any[]>([]);

  const categoryOptions = categoriesState?.map((category: any) => ({
    value: category.id,
    label: category.name,
  }));

  const statusOptions = [
    { value: "ACTIVE", label: t("Active") },
    { value: "INACTIVE", label: t("Inactive") },
  ];

  const formik = useFormik({
    initialValues: {
      productName: product?.name || "",
      categoryId: product?.category_id || "",
      status: product?.status || "ACTIVE",
      shortDescription: product?.short_description || "",
      detailDescription: product?.detail_description || "",
      image: null as File | null,
    },
    validationSchema: Yup.object({
      productName: Yup.string()
        .max(255, t("Must be 255 characters or less"))
        .required(t("Please enter product name")),
      categoryId: Yup.string().required(t("Please select a category")),
      status: Yup.string().required(t("Please select status")),
      shortDescription: Yup.string()
        .max(150, t("Must be 150 characters or less"))
        .required(t("Please enter short description")),
      detailDescription: Yup.string().required(
        t("Please enter detailed description")
      ),
      image: isEditMode
        ? Yup.mixed().nullable()
        : Yup.mixed().required(t("Please select a product image")),
    }),
    onSubmit: (values) => {
      const url = isEditMode
        ? route("seller.product.update", { id: product.id })
        : route("seller.product.store");

      const method = isEditMode ? "put" : "post";

      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("categoryId", values.categoryId);
      formData.append("status", values.status);
      formData.append("shortDescription", values.shortDescription);
      formData.append("detailDescription", values.detailDescription);

      if (values.image) {
        formData.append("image", values.image);
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
    },
  });

  const selectedCategoryOption =
    categoryOptions?.find(
      (option: any) => option?.value === formik.values.categoryId
    ) || null;

  return (
    <React.Fragment>
      <Head title={isEditMode ? t("Edit product") : t("Add product")} />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <BreadCrumb
            title={isEditMode ? t("Edit product") : t("Add product")}
            pageTitle={t("Product Management")}
          />
          <Row className="px-3">
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">
                    {isEditMode ? t("Edit product") : t("Add product")}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Form
                    onSubmit={formik.handleSubmit}
                    noValidate
                    className="p-2"
                  >
                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group controlId="productName">
                          <Form.Label>
                            {t("Product name")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={t("Enter product name")}
                            name="productName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.productName}
                            isInvalid={
                              !!(
                                (formik.touched.productName &&
                                  formik.errors.productName) ||
                                errors?.productName
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {t(formik.errors.productName || errors?.name)}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="categoryId">
                          <Form.Label>
                            {t("Category")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            options={categoryOptions}
                            placeholder={t("Select category")}
                            value={selectedCategoryOption}
                            onChange={(selectedOption: any) => {
                              formik.setFieldValue(
                                "categoryId",
                                selectedOption?.value || ""
                              );
                            }}
                            onBlur={() =>
                              formik.setFieldTouched("categoryId", true)
                            }
                            onMenuOpen={() => {
                              router.reload({
                                only: ["categories"],
                                onSuccess: (page) => {
                                  const cats =
                                    (page?.props?.categories as any) || [];
                                  setCategoriesState(cats);
                                },
                              });
                            }}
                            classNamePrefix="react-select"
                            isSearchable={true}
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            className={
                              (formik.touched.categoryId &&
                                formik.errors.categoryId) ||
                              errors?.categoryId
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {((formik.touched.categoryId &&
                            formik.errors.categoryId) ||
                            errors?.categoryId) && (
                            <div className="invalid-feedback d-block">
                              {t(
                                formik.errors.categoryId || errors?.categoryId
                              )}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={12}>
                        <Form.Group controlId="status">
                          <Form.Label>
                            {t("Status")} <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            options={statusOptions}
                            placeholder={t("Select status")}
                            value={statusOptions.find(
                              (option) => option.value === formik.values.status
                            )}
                            onChange={(selectedOption: any) => {
                              formik.setFieldValue(
                                "status",
                                selectedOption?.value || ""
                              );
                            }}
                            onBlur={() =>
                              formik.setFieldTouched("status", true)
                            }
                            classNamePrefix="react-select"
                            className={
                              (formik.touched.status && formik.errors.status) ||
                              errors?.status
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {((formik.touched.status && formik.errors.status) ||
                            errors?.status) && (
                            <div className="invalid-feedback d-block">
                              {t(formik.errors.status || errors?.status)}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={12}>
                        <Form.Group controlId="shortDescription">
                          <Form.Label>
                            {t("Short description")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder={t("Enter short description")}
                            name="shortDescription"
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
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={12}>
                        <Form.Group controlId="detailDescription">
                          <Form.Label>
                            {t("Detail description")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <CKEditor
                          editor={ClassicEditor as any}
                            data={formik.values.detailDescription}
                            onChange={(event: any, editor: any) => {
                              const editorData = editor.getData();
                              formik.setFieldValue(
                                "detailDescription",
                                editorData
                              );
                            }}
                            onBlur={() =>
                              formik.setFieldTouched("detailDescription", true)
                            }
                          />
                          {((formik.touched.detailDescription &&
                            formik.errors.detailDescription) ||
                            errors?.detailDescription) && (
                            <div className="invalid-feedback d-block">
                              {t(
                                formik.errors.detailDescription ||
                                  errors?.detailDescription
                              )}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    {isEditMode && product?.image && (
                      <Row className="mb-4">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>
                              {t("Current product image")}
                            </Form.Label>
                            <div>
                              <a
                                target="_blank"
                                href={`${storageUrl}/${product.image}`}
                              >
                                <img
                                  src={`${storageUrl}/${
                                    product.image
                                  }?v=${Date.now()}`}
                                  alt={product.name || t("Product image")}
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

                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group controlId="image">
                          <Form.Label>
                            {isEditMode
                              ? t("New product image")
                              : t("Product image")}
                            {!isEditMode && (
                              <span className="text-danger"> *</span>
                            )}
                          </Form.Label>
                          <FilePond
                            files={files}
                            onupdatefiles={(fileItems) => {
                              setFiles(fileItems);
                              if (fileItems.length > 0 && fileItems[0].file) {
                                const file = fileItems[0].file;
                                formik.setFieldValue("image", file);
                                formik.setFieldTouched("image", true);
                              } else {
                                formik.setFieldValue("image", null);
                                formik.setFieldTouched("image", true);
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
                              (formik.touched.image && formik.errors.image) ||
                              errors?.image
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {((formik.touched.image && formik.errors.image) ||
                            errors?.image) && (
                            <div className="invalid-feedback d-block">
                              {t(formik.errors.image || errors?.image)}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <div className="d-flex gap-3">
                          <Button
                            variant="light"
                            onClick={() => {
                              formik.resetForm();
                              setFiles([]);
                              router.visit(route("seller.product.index"));
                            }}
                          >
                            {t("Back")}
                          </Button>
                          <Button variant="success" type="submit">
                            {isEditMode ? t("Update") : t("Save")}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
product.layout = (page: any) => <Layout children={page} />;
