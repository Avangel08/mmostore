import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { router, usePage } from "@inertiajs/react";
import { showToast } from "../../../utils/showToast";
import { copyToClipboard } from "../../../utils/copyToClipboard";
import { confirmDelete } from "../../../utils/sweetAlert";
import moment from "moment";

export default function TabToken() {
    const { t } = useTranslation();
    const token = usePage().props.token as any;
    const tokenId = token?.id || null;
    const plainTextToken = token?.token_plain_text || null;
    const createdAt = token?.created_at || null;
    const lastUsedAt = token?.last_used_at || null;
    const [showToken, setShowToken] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const fetchToken = () => {
        router.reload({
            replace: true,
            only: ['token'],
        });
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchToken();
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const handleToggleVisibility = () => {
        setShowToken(!showToken);
    };

    const handleCopyToken = async () => {
        if (!plainTextToken) {
            showToast(t("No token available to copy"), "error");
            return;
        }

        if (isCopied) {
            return;
        }

        setIsCopied(true);

        try {
            const isCopySuccess = await copyToClipboard(plainTextToken);
            if (isCopySuccess) {
                showToast(t("Token copied"), "success");
            } else {
                showToast(t("Failed to copy token. Please try copy manually"), "error");
            }
        } finally {
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        }
    };

    const handleCreateToken = () => {
        if (!!tokenId) {
            showToast(t("You already have a token. Please reload page to see your token"), "error");
            return;
        }

        router.post(route('seller.profile.create-token'), {}, {
            onSuccess: (page: any) => {
                if (page.props?.message?.error) {
                    showToast(t(page.props.message.error), "error");
                    return;
                }

                if (page.props?.message?.success) {
                    showToast(t(page.props.message.success), "success");
                    fetchToken();
                }
            },
            onError: (errors: any) => {
                Object.keys(errors).forEach((key) => {
                    showToast(errors[key], "error");
                });
            }
        });
    };

    const handleDeleteToken = async () => {
        if (!tokenId) {
            showToast(t("No token available to delete"), "error");
            return;
        }

        const confirmed = await confirmDelete({
            title: t("Delete this token?"),
            text: t("Once deleted, you will not be able to recover it."),
            confirmButtonText: t("Delete now"),
            cancelButtonText: t("Cancel"),
        });

        if (!confirmed) {
            return;
        }

        router.delete(route('seller.profile.delete-token', tokenId), {
            onSuccess: (page: any) => {
                if (page.props?.message?.error) {
                    showToast(t(page.props.message.error), "error");
                    return;
                }

                if (page.props?.message?.success) {
                    showToast(t(page.props.message.success), "success");
                }
            },
            onError: (errors: any) => {
                Object.keys(errors).forEach((key) => {
                    showToast(errors[key], "error");
                });
            }
        });
    };

    return (
        <Form noValidate>
            <Row>
                <Col lg={8}>
                    <div className="mb-3">
                        {!Boolean(plainTextToken) ? (
                            <div>
                                <p className="text-muted mb-3">
                                    {t("You don't have an API Token yet.")}
                                </p>
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleCreateToken}
                                >
                                    <i className="ri-add-line me-1"></i>
                                    {t("Create API Token")}
                                </Button>
                            </div>
                        ) : (
                            <Form.Group controlId="api_token">
                                <h5>
                                    {t("API Token")}
                                </h5>
                                <Col lg={12} className="mb-3">
                                    <div className="mb-3 text-muted">
                                        <small>
                                            {t("Use this token to authenticate API requests. Keep it secure and don't share it with others.")}
                                        </small>
                                    </div>
                                </Col>

                                <small className="d-block mb-2">
                                    <div>{t('Created date')}:  {createdAt ? moment(createdAt).format("DD/MM/YYYY HH:mm") : t("Unknown")}</div>
                                </small>

                                <small className="d-block mb-3">
                                    <div>{t('Last use')}: {lastUsedAt ? moment(lastUsedAt).format("DD/MM/YYYY HH:mm") : t("Unknown")}</div>
                                </small>

                                <div className="d-flex gap-2">
                                    <div className="position-relative flex-grow-1">
                                        <Form.Control
                                            type={showToken ? "text" : "password"}
                                            className="form-control pe-5"
                                            value={plainTextToken}
                                            readOnly
                                            style={{ fontFamily: 'monospace' }}
                                        />
                                        <Button
                                            variant="link"
                                            className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-muted pe-3"
                                            onClick={handleToggleVisibility}
                                            style={{
                                                zIndex: 10,
                                                padding: '0.375rem 0.5rem'
                                            }}
                                            title={showToken ? t("Hide token") : t("Show token")}
                                        >
                                            <i className={showToken ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                        </Button>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={isCopied ? "outline-success" : "outline-primary"}
                                        onClick={handleCopyToken}
                                        disabled={isCopied}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        <i className={`${isCopied ? 'ri-check-line' : 'ri-file-copy-line'} me-1`}></i>
                                        {isCopied ? t("Copied") : t("Copy")}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline-danger"
                                        onClick={handleDeleteToken}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        <i className="ri-delete-bin-line me-1"></i>
                                        {t("Delete")}
                                    </Button>
                                </div>
                            </Form.Group>
                        )}
                    </div>
                </Col>
            </Row>
        </Form>
    );
}