import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import * as Yup from "yup";
import { showToast } from "../../../../utils/showToast";

export const ModalSettingPayment = ({
  show,
  onHide,
  dataEdit,
  listBank,
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
  listBank?: any;
}) => {

  const maxLengthName = 150;
  const { t } = useTranslation();
  const errors = usePage().props.errors as any;

  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const validationSchema = useMemo(() => {
    return Yup.object({
      key: Yup.string()
        .required(t("Please select a bank")),
      account_name: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter this field")),
      account_number: Yup.string()
        .required(t("Please enter this field")),
      user_name: Yup.string()
        .required(t("Please enter this field")),
      password: Yup.string()
        .required(t("Please enter this field")),
      ...(showOtp
        ? {
          otp: Yup.string().required(t("Please enter this field")),
        }
        : {}),
    });
  }, [showOtp, t]);

  const formik = useFormik({
    initialValues: {
      key: dataEdit?.key || "",
      account_name: dataEdit?.details?.account_name || "",
      account_number: dataEdit?.details?.account_number ?? "",
      user_name: dataEdit?.details?.user_name ?? "",
      password: dataEdit?.details?.password ?? "",
      otp: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const url = route("seller.payment-history.store");
      const method = "post";

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
      });
    },
  });

  // Reset form when modal opens/closes or when dataEdit changes
  useEffect(() => {
    if (show) {
      formik.setValues({
        key: dataEdit?.key || "",
        account_name: dataEdit?.details?.account_name || "",
        account_number: dataEdit?.details?.account_number ?? "",
        user_name: dataEdit?.details?.user_name ?? "",
        password: dataEdit?.details?.password ?? "",
        otp: "",
      });
      setShowOtp(false);
      setCanSubmit(false);
      setIsVerifying(false);
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
          <h5>{t("Setting Payment")}</h5>
        </Modal.Header>
        <Modal.Body>
          {/* Bank key */}
          <Form.Group className="mb-3" controlId="key">
            <Form.Label>
              {t("Bank")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="key"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.key}
              isInvalid={!!((formik.touched.key && formik.errors.key) || errors?.key)}
            >
              <option value="">{t("Select bank")}</option>
              {listBank && Object.keys(listBank).map((key: string) => (
                <option key={key} value={key} selected={formik.values.key === key}>{t(listBank[key])}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.key || errors?.key)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Account name */}
          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              {t("Account name")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="account_name"
              type="text"
              placeholder={t("Enter account name")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.account_name}
              isInvalid={
                !!((formik.touched.account_name && formik.errors.account_name) || errors?.account_name)
              }
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.account_name || errors?.account_name)}
            </Form.Control.Feedback>
          </Form.Group>
          {/* Account number */}
          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              {t("Account number")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="account_number"
              type="text"
              placeholder={t("Enter account number")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.account_number}
              isInvalid={
                !!((formik.touched.account_number && formik.errors.account_number) || errors?.account_number)
              }
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.account_number || errors?.account_number)}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              {t("User name")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="user_name"
              type="text"
              placeholder={t("0974 xxx xxx")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user_name}
              isInvalid={
                !!((formik.touched.user_name && formik.errors.user_name) || errors?.user_name)
              }
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.user_name || errors?.user_name)}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              {t("Password")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="password"
              type="text"
              placeholder={t("Enter password")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={
                !!((formik.touched.password && formik.errors.password) || errors?.password)
              }
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.password || errors?.password)}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="success"
            type="button"
            className="mb-3"
            disabled={isVerifying}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsVerifying(true);
              formik.setTouched({
                key: true,
                account_name: true,
                account_number: true,
                user_name: true,
                password: true,
                otp: formik.touched.otp || false,
              });

              const currentErrors = await formik.validateForm();
              if (currentErrors.key || currentErrors.account_name || currentErrors.account_number || currentErrors.user_name || currentErrors.password) {
                showToast(t("Please enter this field"), "error");
                setIsVerifying(false);
                return;
              }
              router.post(
                route("seller.payment-history.verify-payment"),
                {
                  key: formik.values.key,
                  account_name: formik.values.account_name,
                  account_number: formik.values.account_number,
                  user_name: formik.values.user_name,
                  password: formik.values.password,
                  otp: formik.values.otp ?? null,
                },
                {
                  preserveScroll: true,
                  preserveState: true,
                  only: [],
                  onSuccess: (props: any) => {
                    if (props.props?.message?.error) {
                      showToast(t(props.props.message.error), "error");
                      setCanSubmit(false);
                      setIsVerifying(false);
                      return;
                    }

                    if (props.props?.message?.info) {
                      showToast(t(props.props.message.info), "success");
                      setShowOtp(true);
                      setCanSubmit(true);
                      setIsVerifying(true);
                      return;
                    }

                    showToast(t(props.props?.message?.success || "Verified successfully"), "success");
                    setCanSubmit(true);
                    setIsVerifying(true);
                    return;
                  },
                  onError: () => {
                    showToast(t("Verification failed"), "error");
                    setIsVerifying(false);
                  },
                  onFinish: () => {
                    // setIsVerifying(false);
                  },
                }
              );
            }}
          >
            {t("Verify Payment")}
          </Button>

          {showOtp && (
            <Form.Group className="mb-3" controlId="categoryName">
              <Form.Label>
                {t("OTP")}
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="otp"
                type="text"
                placeholder={t("Enter OTP")}
                maxLength={maxLengthName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.otp}
                isInvalid={
                  !!((formik.touched.otp && formik.errors.otp) || errors?.otp)
                }
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.otp || errors?.otp)}
              </Form.Control.Feedback>
            </Form.Group>
          )}

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
          <Button variant="primary" type="submit" disabled={!canSubmit}>
            {t("Save changes")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};