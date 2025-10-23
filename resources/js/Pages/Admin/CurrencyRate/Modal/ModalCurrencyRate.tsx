import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Form, Button, FormControlProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { NumericFormat } from "react-number-format";
import { showToast } from "../../../../utils/showToast";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { english } from "flatpickr/dist/l10n/default.js";
import moment from "moment";

export const ModalCurrencyRate = ({
  show,
  onHide,
  dataEdit,
  dataOptions
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
  dataOptions?: any;
}) => {
  const { t, i18n } = useTranslation();
  const errors = usePage().props.errors as any;
  const flatpickrRef = useRef<any>(null);
  const isEditMode = !!dataEdit;

  const getFlatpickrLocale = () => {
    switch (i18n.language) {
      case "vi":
        return Vietnamese;
      default:
        return english;
    }
  };

  const minVnd = 1000;
  const maxVnd = 999999999.99;

  const validationSchema: any = useMemo(() => {
    return Yup.object({
      to_vnd: Yup.number()
        .required(t("Please enter this field"))
        .min(minVnd, t("This field must be greater than or equal to {{min}}", { min: minVnd }))
        .max(maxVnd, t("This field must be less than or equal to {{max}}", { max: maxVnd })),
      date: Yup.string()
        .required(t("Please select this field")),
      status: Yup.string()
        .required(t("Please select this field")),
    });
  }, [t]);

  const formik = useFormik<{
    id: string;
    to_vnd: number;
    date: string;
    status: string;
  }>({
    initialValues: {
      id: dataEdit?.id || "",
      to_vnd: dataEdit?.to_vnd || minVnd,
      date: dataEdit?.date || moment().format("YYYY-MM-DD"),
      status: dataEdit?.status ? String(dataEdit.status) : "ACTIVE",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const url = isEditMode
        ? route("admin.currency-rates.update", { id: dataEdit.id })
        : route("admin.currency-rates.store");
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
        },
        onError: (errors: any) => {
          Object.keys(errors).forEach((key) => {
            showToast(t(errors[key]), "error");
          });
        }
      });
    },
  });

  useEffect(() => {
    if (show) {
      formik.setValues({
        id: dataEdit?.id || "",
        to_vnd: dataEdit?.to_vnd || minVnd,
        date: dataEdit?.date || moment().format("YYYY-MM-DD"),
        status: dataEdit?.status ? String(dataEdit.status) : "ACTIVE",
      });
    } else {
      formik.resetForm();
    }
  }, [show, dataEdit]);

  console.log(dataOptions?.statusList);

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
          <h5>{t("Currency Rate")}</h5>
        </Modal.Header>
        <Modal.Body>
          {/* VND Rate */}
          <Form.Group className="mb-3" controlId="to_vnd">
            <Form.Label>
              {t("VND Rate")}
              <span className="text-danger">*</span>
            </Form.Label>
            <NumericFormat
              customInput={Form.Control as React.ComponentType<FormControlProps>}
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              placeholder={t("Enter VND Rate")}
              fixedDecimalScale={false}
              allowNegative={false}

              onValueChange={(values) => {
                formik.setFieldValue("to_vnd", values.floatValue || "");
              }}
              isAllowed={(values) => {
                const { floatValue } = values;
                return floatValue === undefined || floatValue <= maxVnd;
              }}
              onBlur={formik.handleBlur}
              value={formik.values.to_vnd}
              isInvalid={!!(formik.touched.to_vnd && formik.errors.to_vnd)}
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.to_vnd || errors?.to_vnd)}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="date">
            <Form.Label>
              {t("Effective from date")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Flatpickr
              name="date"
              ref={flatpickrRef}
              className="form-control"
              placeholder={t("Select date")}
              options={{
                dateFormat: "Y-m-d",
                locale: getFlatpickrLocale(),
              }}
              value={formik.values.date}
              onChange={(dates: any) => {
                formik.setFieldValue("date", dates[0] ? moment(dates[0]).format("YYYY-MM-DD") : "");
              }}
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.date || errors?.date)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>
              {t("Status")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              isInvalid={!!((formik.touched.status && formik.errors.status) || errors?.status)}
            >
              {dataOptions?.statusList && Object.keys(dataOptions.statusList).map((key: any) => (
                <option key={key} value={key}>
                  {t(dataOptions?.statusList[key])}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.status || errors?.status)}
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
          <Button
            variant="primary"
            type="submit"
          >
            {t("Save changes")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};