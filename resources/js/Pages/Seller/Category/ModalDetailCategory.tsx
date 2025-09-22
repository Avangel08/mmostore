import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import * as Yup from "yup" ;
import { showToast } from "../../../utils/showToast";

export const ModalDetailCategory = ({
  show,
  onHide,
  dataEdit,
  refetchData
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
  refetchData: () => void;
}) => {
  const maxLengthName = 150;
  const { t } = useTranslation();
  const isEditMode = !!dataEdit;
  const errors = usePage().props.errors as any;

  const formik = useFormik({
    initialValues: {
      categoryName: dataEdit?.name || "",
      categoryStatus: dataEdit?.status ? dataEdit.status : 1,
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter this field")),
      categoryStatus: Yup.number()
        .required(t("Please select status")),
    }),
    onSubmit: (values) => {
      const url = isEditMode 
        ? route("seller.category.update", { id: dataEdit.id })
        : route("seller.category.store");
      
      const method = isEditMode ? "put" : "post";
      
      router[method](url, values, {
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
          refetchData();
        },
      });
    },
  });

  // Reset form when modal opens/closes or when dataEdit changes
  useEffect(() => {
    if (show) {
      formik.setValues({
        categoryName: dataEdit?.name || "",
        categoryStatus: dataEdit?.status ? dataEdit.status : 1,
      });
    } else {
      formik.resetForm();
    }
  }, [show, dataEdit]);

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
                !!((formik.touched.categoryName && formik.errors.categoryName) || errors?.categoryName)
              }
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.categoryName || errors?.categoryName)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3" controlId="categoryStatus">
            <Form.Label>
              {t("Status")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.categoryStatus}
              isInvalid={!!((formik.touched.categoryStatus && formik.errors.categoryStatus) || errors?.categoryStatus)}
            >
              <option value={1}>{t("Active")}</option>
              <option value={0}>{t("Inactive")}</option>
            </Form.Select>  
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.categoryStatus || errors?.categoryStatus)}
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