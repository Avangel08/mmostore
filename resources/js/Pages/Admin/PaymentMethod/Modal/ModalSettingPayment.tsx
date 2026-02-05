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
  dataOptions
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
  dataOptions?: any;
}) => {
  const maxLengthName = 150;
  const { t } = useTranslation();
  const errors = usePage().props.errors as any;

  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [isVerifyingSePay, setIsVerifyingSePay] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const isEditMode = !!dataEdit;

  const validationSchema: any = useMemo(() => {
    return Yup.object({
      type: Yup.string()
        .required(t("Please select a type")),
      key: Yup.string()
        .required(t("Please select a bank")),
      account_name: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter this field")),
      account_number: Yup.string()
        .required(t("Please enter this field")),
      user_name: Yup.string()
        .when('type', {
          is: (val: string) => dataOptions?.listTypeOptions?.[val] === "BANK",
          then: (schema) => schema.required(t("Please enter this field")),
          otherwise: (schema) => schema.notRequired(),
        }),
      password: Yup.string()
        .when('type', {
          is: (val: string) => dataOptions?.listTypeOptions?.[val] === "BANK",
          then: (schema) => schema.required(t("Please enter this field")),
          otherwise: (schema) => schema.notRequired(),
        }),
      ...(showOtp
        ? {
          otp: Yup.string().required(t("Please enter this field")),
        }
        : {}),
      api_key: Yup.string()
        .when('type', {
          is: (val: string) => dataOptions?.listTypeOptions?.[val] === "SEPAY",
          then: (schema) => schema.required(t("Please enter this field")),
          otherwise: (schema) => schema.notRequired(),
        }),
    });
  }, [showOtp, t, dataOptions]);

  const formik = useFormik<{
    id: string;
    type: string;
    key: string;
    account_name: string;
    account_number: string;
    user_name: string;
    password: string;
    otp: string;
    api_key: string;
  }>({
    initialValues: {
      id: dataEdit?.id || "",
      type: dataEdit?.type || "BANK",
      key: dataEdit?.key || "",
      account_name: dataEdit?.details?.account_name || "",
      account_number: dataEdit?.details?.account_number ?? "",
      user_name: dataEdit?.details?.user_name ?? "",
      password: dataEdit?.details?.password ?? "",
      otp: "",
      api_key: dataEdit?.details?.api_key ?? "",
    },
    validationSchema,
    onSubmit: (values) => {
      const url = isEditMode
        ? route("admin.payment-method.update", { id: dataEdit.id })
        : route("admin.payment-method.store");
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
      });
    },
  });

  // Reset form when modal opens/closes or when dataEdit changes
  useEffect(() => {
    if (show) {
      formik.setValues({
        id: dataEdit?.id || "",
        type: dataEdit?.type ? String(dataEdit?.type) : "0",
        key: dataEdit?.key || "",
        account_name: dataEdit?.details?.account_name || "",
        account_number: dataEdit?.details?.account_number ?? "",
        user_name: dataEdit?.details?.user_name ?? "",
        password: dataEdit?.details?.password ?? "",
        otp: "",
        api_key: dataEdit?.details?.api_key ?? "",
      });
      setShowOtp(false);
      setCanSubmit(false);
      setIsVerifyingBank(false);
      setIsVerifyingSePay(false);
      setShowWebhook(false);
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
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>
              {t("Type")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.type}
              isInvalid={!!((formik.touched.type && formik.errors.type) || errors?.type)}
            >
              <option value="">{t("Select type")}</option>
              {dataOptions?.listTypeOptions && Object.keys(dataOptions.listTypeOptions).map((key: string) => (
                <option key={key} value={key} selected={formik.values.type === key}>{t(dataOptions.listTypeOptions[key])}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.type || errors?.type)}
            </Form.Control.Feedback>
          </Form.Group>

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
              {
                dataOptions?.listTypeOptions?.[formik.values.type] === "BANK"
                  ? (dataOptions?.listBank && Object.keys(dataOptions.listBank).map((key: string) => (
                    <option key={key} value={key} selected={formik.values.key === key}>
                      {t(dataOptions.listBank[key])}
                    </option>
                  )))
                  : (dataOptions?.listBankSePay && Object.keys(dataOptions.listBankSePay).map((key: string) => (
                    <option key={key} value={dataOptions.listBankSePay[key].code} selected={formik.values.key === dataOptions.listBankSePay[key].code}>
                      {t(dataOptions.listBankSePay[key].short_name)}
                    </option>
                  )))
              }

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


          {dataOptions?.listTypeOptions?.[formik.values.type] === "BANK" && (
            <>
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
                disabled={isVerifyingBank}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsVerifyingBank(true);
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
                    setIsVerifyingBank(false);
                    return;
                  }
                  router.post(
                    route("admin.payment-method.verify-payment"),
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
                          setIsVerifyingBank(false);
                          return;
                        }

                        if (props.props?.message?.info) {
                          showToast(t(props.props.message.info), "success");
                          setShowOtp(true);
                          setCanSubmit(true);
                          setIsVerifyingBank(false);
                          return;
                        }

                        showToast(t(props.props?.message?.success || "Verified successfully"), "success");
                        setCanSubmit(true);
                        setIsVerifyingBank(false);
                        return;
                      },
                      onError: () => {
                        showToast(t("Verification failed"), "error");
                        setIsVerifyingBank(false);
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
                <Form.Group className="mb-3">
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
            </>
          )}

          {dataOptions?.listTypeOptions?.[formik.values.type] === "SEPAY" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>
                  {t("Api Key")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="api_key"
                  type="text"
                  placeholder={t("Enter API key")}
                  maxLength={maxLengthName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.api_key}
                  isInvalid={
                    !!((formik.touched.api_key && formik.errors.api_key) || errors?.api_key)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {t(formik.errors.api_key || errors?.api_key)}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                variant="success"
                type="button"
                className="mb-3"
                disabled={isVerifyingSePay}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsVerifyingSePay(true);
                  formik.setTouched({
                    key: true,
                    account_name: true,
                    account_number: true,
                    user_name: false,
                    password: false,
                    otp: formik.touched.otp || false,
                    api_key: true,
                  });

                  const currentErrors = await formik.validateForm();
                  if (currentErrors.key || currentErrors.account_name || currentErrors.account_number || currentErrors.api_key) {
                    showToast(t("Please enter this field"), "error");
                    setIsVerifyingSePay(false);
                    return;
                  }
                  router.post(
                    route("admin.payment-method.verify-sepay"),
                    {
                      key: formik.values.key,
                      account_name: formik.values.account_name,
                      account_number: formik.values.account_number,
                      api_key: formik.values.api_key,
                    },
                    {
                      preserveScroll: true,
                      preserveState: true,
                      only: [],
                      onSuccess: (props: any) => {
                        if (props.props?.message?.error) {
                          showToast(t(props.props.message.error), "error");
                          setCanSubmit(false);
                          setIsVerifyingSePay(false);
                          return;
                        }

                        showToast(t(props.props?.message?.success || "Verified successfully"), "success");
                        setShowWebhook(true);
                        setCanSubmit(true);
                        setIsVerifyingSePay(false);
                        return;
                      },
                      onError: () => {
                        showToast(t("Verification failed"), "error");
                        setIsVerifyingSePay(false);
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

              {showWebhook && (
                <Form.Group className="mb-3">
                  <Form.Label>
                    {t("Link Webhook")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    value={dataOptions?.linkWebhook}
                    readOnly
                  />
                </Form.Group>
              )}
            </>
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