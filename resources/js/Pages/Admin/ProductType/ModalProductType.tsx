import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";
import CustomCKEditor from "../../../Components/CustomCKEditor";

export const ModelProductType = ({
  show,
  onHide,
  dataEdit,
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
}) => {
  const maxLengthName = 150;
  const { t } = useTranslation();
  const isEditMode = !!dataEdit;
  const errors = usePage().props.errors as any;
  const statusConst = usePage().props.statusConst as any;

  const statusOptions = Object.entries(statusConst || {}).map(([key, value]) => ({
    value: (key as string ?? "")?.toString(),
    label: t(value as string ?? ""),
  }));

  const formik = useFormik({
    initialValues: {
      productTypeName: dataEdit?.name || "",
      productTypeStatus: dataEdit?.status ?? "ACTIVE",
      description: dataEdit?.description ?? "",
    },
    validationSchema: Yup.object({
      productTypeName: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter this field")),
      productTypeStatus: Yup.string()
        .required(t("Please select status")),
      description: Yup.string(),
    }),
    onSubmit: (values) => {
      const url = isEditMode
        ? route("admin.product-types.update", { id: dataEdit.id })
        : route("admin.product-types.store");

      const method = isEditMode ? "put" : "post";

      router[method](url, values, {
        replace: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: (success: any) => {
          if (success.props?.message?.error) {
            showToast(t(success.props.message.error), "error");
            return;
          }
          formik.resetForm();
          onHide();

          if (success.props?.message?.success) {
            showToast(t(success.props.message.success), "success");
          }
        },
      });
    },
  });

  const selectedStatusOption = statusOptions?.find(
    (option: any) => option?.value === formik.values.productTypeStatus
  ) ?? null;

  useEffect(() => {
    if (show) {
      formik.setValues({
        productTypeName: dataEdit?.name || "",
        productTypeStatus: dataEdit?.status ?? "ACTIVE",
        description: dataEdit?.description ?? "",
      });
    } else {
      formik.resetForm();
    }
  }, [show, dataEdit]);

  useEffect(() => {
    formik.setErrors(errors || {});
  }, [errors]);

  return (
    <Modal
      id="myModal"
      backdrop={"static"}
      show={show}
      onHide={() => {
        formik.resetForm();
        onHide();
      }}
      centered
      size="xl"
    >
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Header closeButton>
          <h5>{isEditMode ? t("Edit product type") : t("Add product type")}</h5>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="productTypeName">
            <Form.Label>
              {t("Product type name")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t("Enter product type name")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.productTypeName}
              isInvalid={
                !!((formik.touched.productTypeName && formik.errors.productTypeName))
              }
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.productTypeName as string ?? "")}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3" controlId="productTypeStatus">
            <Form.Label>
              {t("Status")} <span className="text-danger">*</span>
            </Form.Label>
            <Select
              options={statusOptions}
              placeholder={t("Select status")}
              value={selectedStatusOption}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("productTypeStatus", selectedOption?.value ?? "");
              }}
              onBlur={() => formik.setFieldTouched("productTypeStatus", true)}
              className={
                (formik?.touched?.productTypeStatus && formik?.errors?.productTypeStatus)
                  ? "is-invalid"
                  : ""
              }
            />
            {((formik?.touched?.productTypeStatus && formik?.errors?.productTypeStatus)) && (
              <div className="invalid-feedback d-block">
                {t(formik?.errors?.productTypeStatus as string ?? "")}
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.productTypeStatus as string ?? "")}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>
              {t("Description")}
            </Form.Label>
            <CustomCKEditor
              data={formik.values.description}
              onChange={(data: string) => {
                formik.setFieldValue("description", data);
              }}
              onBlur={() => formik.setFieldTouched("description", true)}
              placeholder={t("Enter product type description")}
            />
            {((formik?.touched?.description && formik?.errors?.description)) && (
              <div className="invalid-feedback d-block">
                {t(formik?.errors?.description as string ?? "")}
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => {
              formik.resetForm();
              onHide();
            }}
          >
            {t("Close")}
          </Button>
          <Button variant="primary" type="submit">
            {isEditMode ? t("Update") : t("Save changes")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};