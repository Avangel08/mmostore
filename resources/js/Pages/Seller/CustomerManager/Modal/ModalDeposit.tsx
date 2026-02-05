import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import * as Yup from "yup";
import { showToast } from "../../../../utils/showToast";

export const ModalDeposit = ({
  show,
  onHide,
  dataEdit,
  paymentMethods,
  listPaymentType,
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
  paymentMethods?: any;
  listPaymentType?: any;
}) => {

  const { t } = useTranslation();
  const errors = usePage().props.errors as any;

  const [transactionCode, setTransactionCode] = useState("");

  // Generate transaction code
  const generateTransactionCode = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `M${year}${month}${day}${randomChars}`;
  };

  // Initialize transaction code when modal opens
  useEffect(() => {
    if (show) {
      setTransactionCode(generateTransactionCode());
    }
  }, [show]);

  const validationSchema = useMemo(() => {
    return Yup.object({
      payment_method_id: Yup.string()
        .required(t("Please select payment method")),
      transaction_type: Yup.string()
        .required(t("Please select transaction type")),
      currency: Yup.string()
        .required(t("Please select currency")),
      amount: Yup.number()
        .min(1, t("Minimum amount is 1"))
        .required(t("Please enter amount")),
      note: Yup.string()
        .max(500, t("Note must be less than 500 characters")),
    });
  }, [t]);

  const formik = useFormik({
    initialValues: {
      payment_method_id: "",
      transaction_type: "",
      currency: "VND",
      amount: "",
      note: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const url = route("seller.customer-manager.deposit");
      const method = "post";

      const submitData = {
        ...values,
        transaction_code: transactionCode,
        customer_id: dataEdit?.id,
      };

      router[method](url, submitData, {
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (show) {
      formik.setValues({
        payment_method_id: "",
        transaction_type: "",
        currency: "VND",
        amount: "",
        note: "",
      });
    } else {
      formik.resetForm();
    }
  }, [show]);

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
          <h5>{t("Update balance")}</h5>
        </Modal.Header>
        <Modal.Body>
          {/* Payment Method */}
          <Form.Group className="mb-3" controlId="paymentMethod">
            <Form.Label>
              {t("Payment Method")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="payment_method_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.payment_method_id}
              isInvalid={!!((formik.touched.payment_method_id && formik.errors.payment_method_id) || errors?.payment_method_id)}
            >
              <option value="">{t("Select payment method")}</option>
              {paymentMethods.map((paymentMethod: any) => (
                <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.name} ({listPaymentType[paymentMethod.type]})</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.payment_method_id || errors?.payment_method_id)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Transaction Type */}
          <Form.Group className="mb-3" controlId="transactionType">
            <Form.Label>
              {t("Transaction Type")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="transaction_type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.transaction_type}
              isInvalid={!!((formik.touched.transaction_type && formik.errors.transaction_type) || errors?.transaction_type)}
            >
              <option value="">{t("Select transaction type")}</option>
              <option value="1">{t("Add money to account")}</option>
              <option value="3">{t("Subtract money from account")}</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.transaction_type || errors?.transaction_type)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Currency */}
          <Form.Group className="mb-3" controlId="currency">
            <Form.Label>
              {t("Currency")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="currency"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currency}
              isInvalid={!!((formik.touched.currency && formik.errors.currency) || errors?.currency)}
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.currency || errors?.currency)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Amount */}
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>
              {t("Amount")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="amount"
              type="number"
              placeholder={t("Enter amount")}
              min="1"
              step="1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amount}
              isInvalid={!!((formik.touched.amount && formik.errors.amount) || errors?.amount)}
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.amount || errors?.amount)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Transaction Code */}
          <Form.Group className="mb-3" controlId="transactionCode">
            <Form.Label>
              {t("Transaction Code")} <span className="text-danger">*</span>
            </Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                value={transactionCode}
                readOnly
                className="bg-light"
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => setTransactionCode(generateTransactionCode())}
                title={t("Generate new transaction code")}
              >
                <i className="ri-refresh-line"></i>
              </Button>
            </div>
          </Form.Group>

          {/* Note */}
          <Form.Group className="mb-3" controlId="note">
            <Form.Label>
              {t("Note")}
            </Form.Label>
            <Form.Control
              name="note"
              as="textarea"
              rows={3}
              placeholder={t("Enter note (optional)")}
              maxLength={500}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.note}
              isInvalid={!!((formik.touched.note && formik.errors.note) || errors?.note)}
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.note || errors?.note)}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {formik.values.note?.length || 0}/500 {t("Characters")}
            </Form.Text>
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
            {t("Submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};