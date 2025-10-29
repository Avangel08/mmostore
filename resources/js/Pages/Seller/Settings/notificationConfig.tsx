import React, { useState } from "react";
import { Button, Col, Form, Row, Card, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { router, usePage } from "@inertiajs/react";
import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";

type initialValuesProps = {
    enabled: boolean;
    groupId: string;
    topicId: string;
    message: string;
};

const NotificationConfig = ({ activeTab }: any) => {
    const { t } = useTranslation();
    const errors = usePage().props.errors as any;
    const { settings } = usePage().props as any;
    const [isTesting, setIsTesting] = useState(false);

    const formik = useFormik<initialValuesProps>({
        enableReinitialize: true,
        initialValues: {
            enabled: settings?.notification?.enabled || false,
            groupId: settings?.notification?.groupId || "",
            topicId: settings?.notification?.topicId || "",
            message: settings?.notification?.message || `{paid_time}
                Order ID: {order_id}
                Tổng tiền: {amount}
                Số lượng: {quantity}
                Sản phẩm: {product_name}`,
        },
        validationSchema: Yup.object({
            groupId: Yup.string().when("enabled", {
                is: true,
                then: (schema) => schema.required(t("Please enter group ID")),
                otherwise: (schema) => schema,
            }),
            topicId: Yup.string().when("enabled", {
                is: true,
                then: (schema) => schema.required(t("Please enter topic ID")),
                otherwise: (schema) => schema,
            }),
            message: Yup.string().when("enabled", {
                is: true,
                then: (schema) => schema.required(t("Please enter message")),
                otherwise: (schema) => schema,
            }),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("notification[enabled]", values.enabled.toString());
            formData.append("notification[groupId]", values.groupId);
            formData.append("notification[topicId]", values.topicId);
            formData.append("notification[message]", values.message);
            formData.append("tab", activeTab);
            
            const url = route("seller.theme-settings.update", { id: settings.id });
            router.post(url, formData, {
                preserveScroll: true,
                onSuccess: (success: any) => {
                    if (success.props?.message?.error) {
                        showToast(t(success.props.message.error), "error");
                        return;
                    }

                    if (success.props?.message?.success) {
                        showToast(t(success.props.message.success), "success");
                        formik.resetForm();
                    } else {
                        showToast(t("Settings updated successfully"), "success");
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

    const testTelegramNotification = async () => {
        if (!formik.values.groupId || !formik.values.topicId) {
            showToast(t("Please enter group ID and topic ID first"), "error");
            return;
        }

        setIsTesting(true);
        try {
            const formData = new FormData();
            formData.append("groupId", formik.values.groupId);
            formData.append("topicId", formik.values.topicId);
            formData.append("message", formik.values.message);
            formData.append("test", "true");

            const url = route("seller.theme-settings.test-telegram");
            router.post(url, formData, {
                preserveScroll: true,
                onSuccess: (success: any) => {
                    if (success.props?.message?.error) {
                        showToast(t(success.props.message.error), "error");
                    } else if (success.props?.message?.success) {
                        showToast(t(success.props.message.success), "success");
                    } else {
                        showToast(t("Test notification sent successfully"), "success");
                    }
                },
                onError: (errors: any) => {
                    Object.keys(errors).forEach((key) => {
                        showToast(t(errors[key]), "error");
                    });
                },
                onFinish: () => {
                    setIsTesting(false);
                },
            });
        } catch (error) {
            showToast(t("Error sending test notification"), "error");
            setIsTesting(false);
        }
    };

    return (
        <React.Fragment>
            <Form noValidate onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <Alert variant="info" className="mb-4">
                        <div className="d-flex align-items-start">
                            <div>
                                <h6 className="alert-heading">{t("How to setup Telegram notifications")}</h6>
                                <ol className="mb-0">
                                    <li>{t("Create a Telegram group and add bot @mmoshopio_bot to the group")}</li>
                                    <li>{t("Get the group ID (usually starts with -)")}</li>
                                    <li>{t("Create a topic in the group and get the topic ID")}</li>
                                    <li>{t("Enter the group ID and topic ID below")}</li>
                                </ol>
                            </div>
                        </div>
                    </Alert>

                    <Row>
                        <Col>
                            {/* Enable/Disable Telegram Notifications */}
                            <div className="mb-4">
                                <Form.Group>
                                    <Form.Check
                                        type="switch"
                                        id="enabled"
                                        label={t("Enable Telegram notifications")}
                                        checked={formik.values.enabled}
                                        onChange={(e) => {
                                            formik.setFieldValue("enabled", e.target.checked);
                                        }}
                                    />
                                </Form.Group>
                            </div>

                            {formik.values.enabled && (
                                <>
                                    {/* Telegram Group ID */}
                                    <div className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="form-label" htmlFor="groupId">
                                                {t("Group ID")} <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                name="groupId"
                                                id="groupId"
                                                placeholder={t("Enter your group ID")}
                                                value={formik.values.groupId}
                                                isInvalid={!!(formik.touched?.groupId && formik.errors?.groupId)}
                                            />
                                            <Form.Text className="text-muted">
                                                {t("Group ID usually starts with - (e.g., -1001234567890)")}
                                            </Form.Text>
                                        </Form.Group>
                                        {formik.touched?.groupId && formik.errors?.groupId && (
                                            <div className="invalid-feedback d-block">
                                                {t(formik.errors.groupId)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Telegram Topic ID */}
                                    <div className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="form-label" htmlFor="topicId">
                                                {t("Topic ID")} <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                name="topicId"
                                                id="topicId"
                                                placeholder={t("Enter your topic ID")}
                                                value={formik.values.topicId}
                                                isInvalid={!!(formik.touched?.topicId && formik.errors?.topicId)}
                                            />
                                            <Form.Text className="text-muted">
                                                {t("Topic ID is a number after Group ID (e.g., 123)")}
                                            </Form.Text>
                                        </Form.Group>
                                        {formik.touched?.topicId && formik.errors?.topicId && (
                                            <div className="invalid-feedback d-block">
                                                {t(formik.errors.topicId)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Template */}
                                    <div className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="form-label" htmlFor="message">
                                                {t("Message")} <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={8}
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                name="message"
                                                id="message"
                                                placeholder={t("Enter your message")}
                                                value={formik.values.message}
                                                isInvalid={!!(formik.touched?.message && formik.errors?.message)}
                                            />
                                            <Form.Text className="text-muted">
                                                {t("Available : {paid_time}, {order_id}, {amount}, {quantity}, {product_name}")}
                                            </Form.Text>
                                        </Form.Group>
                                        {formik.touched?.message && formik.errors?.message && (
                                            <div className="invalid-feedback d-block">
                                                {t(formik.errors.message)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <Button
                                            variant="outline-primary"
                                            onClick={testTelegramNotification}
                                            disabled={isTesting || !formik.values.groupId || !formik.values.topicId}
                                        >
                                            {isTesting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    {t("Send Test Notification")}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ri-send-plane-line me-2"></i>
                                                    {t("Send Test Notification")}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </div>

                <div className="text-start">
                    <Button type="submit" variant="success">
                        {t("Update")}
                    </Button>
                </div>
            </Form>
        </React.Fragment>
    );
};

export default NotificationConfig;
