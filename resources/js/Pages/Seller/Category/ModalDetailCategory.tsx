import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";

export const ModalDetailCategory = ({
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
      categoryName: dataEdit?.name || "",
      categoryStatus: dataEdit?.status ?? "ACTIVE",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter this field")),
      categoryStatus: Yup.string()
        .required(t("Please select status")),
    }),
    onSubmit: (values) => {
      const url = isEditMode
        ? route("seller.category.update", { id: dataEdit.id })
        : route("seller.category.store");

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
    (option: any) => option?.value === formik.values.categoryStatus
  ) ?? null;

  useEffect(() => {
    if (show) {
      formik.setValues({
        categoryName: dataEdit?.name || "",
        categoryStatus: dataEdit?.status ?? "ACTIVE",
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
    >
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Header closeButton>
          <h5>{isEditMode ? t("Edit category") : t("Add category")}</h5>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              {t("Category name")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t("Enter category name")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.categoryName}
              isInvalid={
                !!((formik.touched.categoryName && formik.errors.categoryName))
              }
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.categoryName as string ?? "")}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3" controlId="categoryStatus">
            <Form.Label>
              {t("Status")} <span className="text-danger">*</span>
            </Form.Label>
            <Select
              options={statusOptions}
              placeholder={t("Select status")}
              value={selectedStatusOption}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("categoryStatus", selectedOption?.value ?? "");
              }}
              onBlur={() => formik.setFieldTouched("categoryStatus", true)}
              className={
                (formik?.touched?.categoryStatus && formik?.errors?.categoryStatus)
                  ? "is-invalid"
                  : ""
              }
            />
            {((formik?.touched?.categoryStatus && formik?.errors?.categoryStatus)) && (
              <div className="invalid-feedback d-block">
                {t(formik?.errors?.categoryStatus as string ?? "")}
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.categoryStatus as string ?? "")}
            </Form.Control.Feedback>
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