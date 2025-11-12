import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { showToast } from "../../../../utils/showToast";

import * as Yup from "yup";

export const ModalVerifyStore = ({
    show,
    onHide,
    dataVerifyStore,
    storeCategoryOptions,
    onReloadOptions
}: {
    show: boolean;
    onHide: () => void;
    dataVerifyStore: any;
    storeCategoryOptions: { value: string; label: string }[];
    onReloadOptions: () => void;
}) => {
    const { t } = useTranslation();
    const errors = usePage().props.errors as any;

    const formik = useFormik({
        initialValues: {
            stores: [] as { store_id: string | number; store_category_ids: (string | number)[] }[],
        },
        validationSchema: Yup.object({
            stores: Yup.array()
                .min(1, t("Please verify at least one store"))
                .of(
                    Yup.object({
                        store_id: Yup.mixed().required(),
                        store_category_ids: Yup.array(),
                    })
                ),
        }),
        onSubmit: (values) => {
            const url = route("admin.user.verify-store");
            const dataToSend = {
                stores: values.stores
            };

            router.post(url, dataToSend, {
                replace: true,
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page: any) => {
                    if (page.props?.message?.success) {
                        formik.resetForm();
                        onHide();
                    }
                },
                onError: (errors: any) => {
                    showToast(t("An error occurred while saving verification information"), "error");
                }
            });
        },
    });

    const getSelectedStoreCategoryItems = (storeId: string) => {
        const storeData = formik.values.stores.find(s => s.store_id === storeId);
        return storeCategoryOptions?.filter(
            (option: any) => storeData?.store_category_ids.includes(option?.value)
        ) || [];
    };

    const updateStoreCategories = (storeId: string, selectedCategoryIds: string[]) => {
        const updatedStores = [...formik.values.stores];
        const existingStoreIndex = updatedStores.findIndex(s => s.store_id === storeId);

        if (existingStoreIndex >= 0) {
            updatedStores[existingStoreIndex].store_category_ids = selectedCategoryIds;
        } else {
            updatedStores.push({ store_id: storeId, store_category_ids: selectedCategoryIds });
        }

        formik.setFieldValue("stores", updatedStores);
    };

    useEffect(() => {
        if (show) {
            const initialStores = dataVerifyStore?.stores?.map((store: any) => ({
                store_id: store.id,
                store_category_ids: store.store_categories?.map((category: any) => category.id) || []
            })) || [];

            formik.setValues({
                stores: initialStores,
            });
        } else {
            formik.resetForm();
        }
    }, [show, dataVerifyStore]);

    useEffect(() => {
        formik.setErrors(errors || {});
    }, [errors]);

    return (
        <Form onSubmit={formik.handleSubmit} noValidate>
            <Modal
                id="myModal"
                backdrop={"static"}
                show={show}
                onHide={() => {
                    formik.resetForm();
                    onHide();
                }}
                centered
                scrollable
            >

                <Modal.Header closeButton>
                    <h5>{t("Verify store")}</h5>
                </Modal.Header>
                <Modal.Body>
                    {formik.touched.stores && formik.errors.stores && typeof formik.errors.stores === 'string' && (
                        <div className="alert alert-danger mb-3">
                            {t(formik.errors.stores)}
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="bg-light rounded p-3 mb-5">
                            <div className="row align-items-center mb-2">
                                <div className="col-lg-4">
                                    <span className="fw-semibold">{t("Name user")}:</span>
                                </div>
                                <div className="col-lg-8">
                                    <span className="text-dark">{dataVerifyStore?.name || '-'}</span>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-lg-4">
                                    <span className="fw-semibold">Email:</span>
                                </div>
                                <div className="col-lg-8">
                                    <span className="text-dark">{dataVerifyStore?.email || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {!!dataVerifyStore?.stores && dataVerifyStore?.stores.length > 0 && (
                            <div className="stores-container">
                                <h6 className="fw-semibold mb-3">{t('Registered stores')}:</h6>

                                {dataVerifyStore?.stores?.map((store: any, storeIdx: number) => {
                                    const storeFieldName = `stores.${storeIdx}.store_category_ids`;
                                    const storeError = formik.errors.stores && Array.isArray(formik.errors.stores) && formik.errors.stores[storeIdx] as any;
                                    const storeTouched = formik.touched.stores && Array.isArray(formik.touched.stores) && formik.touched.stores[storeIdx] as any;
                                    const isVerified = !!store.verified_at;
                                    return (
                                        <div key={storeIdx} className="store-card border rounded mb-4 p-3 bg-white">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <h6 className="mb-0 ">
                                                    <i className="ri-store-2-line me-2"></i>
                                                    {!!store?.name && <>
                                                        {t('Store')}: <span className="fw-bold fst-italic">{store.name}</span>
                                                    </>}
                                                    <span className={`ms-3 badge border ${isVerified ? 'border-success text-success' : 'border-danger text-danger'} bg-white`}>
                                                        {isVerified ? t('Verified') : t('Not verified')}
                                                    </span>
                                                </h6>
                                            </div>

                                            <Form.Group className="mb-3" controlId={`store_category_ids_${store.id}`}>
                                                <Form.Label>
                                                    <span className="fw-bold">{t("Store category")}:</span> <small className="fst-italic text-muted">(Bỏ trống để huỷ xác minh)</small>
                                                </Form.Label>
                                                <Select
                                                    isMulti
                                                    options={storeCategoryOptions}
                                                    placeholder={t("Select store categories")}
                                                    onMenuOpen={onReloadOptions}
                                                    value={getSelectedStoreCategoryItems(store.id)}
                                                    onChange={(selectedOptions: any) => {
                                                        const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
                                                        updateStoreCategories(store.id, values);
                                                    }}
                                                    onBlur={() => formik.setFieldTouched(storeFieldName, true)}
                                                    className={
                                                        (storeTouched?.store_category_ids && storeError?.store_category_ids)
                                                            ? "is-invalid"
                                                            : ""
                                                    }
                                                />
                                                {(storeTouched?.store_category_ids && storeError?.store_category_ids) && (
                                                    <div className="invalid-feedback d-block">
                                                        {t(storeError.store_category_ids as string ?? "")}
                                                    </div>
                                                )}
                                            </Form.Group>

                                            {store?.domain && store.domain.length > 0 ? (
                                                <div className="domains-grid">
                                                    <div className="mb-2 d-flex align-items-center justify-content-between">
                                                        <span className="fw-bold">Link domain:</span>
                                                        {/* <span className="badge bg-info text-white">
                                                            {store?.domain?.length || 0} {t('domains')}
                                                        </span> */}
                                                    </div>
                                                    <div className="row g-2">
                                                        {store.domain.map((domainItem: string, index: number) => (
                                                            <div key={`${store.id}-${index}`} className="col-12 col-md-12">
                                                                <div className="domain-item bg-light rounded p-2 h-100">
                                                                    <div className="d-flex align-items-center">
                                                                        <i className="fas fa-globe text-muted me-2"></i>
                                                                        <a
                                                                            href={`https://${domainItem}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-decoration-none text-primary fw-medium flex-grow-1"
                                                                            title={`${t('Visit')} ${domainItem}`}
                                                                        >
                                                                            {!!domainItem && `https://${domainItem}`}
                                                                        </a>
                                                                        <i className="fas fa-external-link-alt text-muted ms-2" style={{ fontSize: '0.75rem' }}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-3 text-muted">
                                                    <i className="fas fa-exclamation-circle me-2"></i>
                                                    {t('No domains registered for this store')}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {(!dataVerifyStore?.stores || dataVerifyStore?.stores.length === 0) && (
                            <div className="text-center py-4 text-muted">
                                <i className="fas fa-store-slash fs-1 mb-3 d-block"></i>
                                <h6>{t('No stores found')}</h6>
                                <p className="mb-0">{t('This user has not registered any stores yet.')}</p>
                            </div>
                        )}
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => {
                            formik.resetForm();
                            onHide();
                        }}
                    >
                        {t("Cancel")}
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={
                            !dataVerifyStore?.stores ||
                            dataVerifyStore?.stores.length === 0
                        }
                        onClick={() => {
                            formik.submitForm();
                        }}
                    >
                        {t("Save verify information")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
};