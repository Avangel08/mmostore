import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showToast } from "../../../utils/showToast";

type initialValuesProps = {
    contacts: Array<{
        type: string;
        value: string;
    }>;
};

const ContactConfig = () => {
    const { t } = useTranslation();
    const { contact_types } = usePage().props as any;
    const { settings } = usePage().props as any

    const formik = useFormik<initialValuesProps>({
        enableReinitialize: true,
        initialValues: {
            contacts: settings?.contacts || [{ type: "", value: "" }],
        },
        validationSchema: Yup.object({
            contacts: Yup.array().of(
                Yup.object({
                    type: Yup.string().required("Please select contact type"),
                    value: Yup.string().required("Please enter contact value"),
                })
            ),
        }),
        onSubmit: (values) => {
            formik.setFieldTouched('contacts', true);
            values.contacts.forEach((_: any, index: number) => {
                formik.setFieldTouched(`contacts.${index}.type`, true);
                formik.setFieldTouched(`contacts.${index}.value`, true);
            });

            if (!formik.isValid) {
                setTimeout(() => {
                    const firstEmptyContact = values.contacts.findIndex((contact: any) => !contact.type);
                    if (firstEmptyContact !== -1) {
                        const contactDropdown = document.querySelector(`[data-contact-index="${firstEmptyContact}"] .contact-dropdown-toggle`);
                        if (contactDropdown) {
                            (contactDropdown as HTMLElement).focus();
                            return;
                        }
                    }

                    const firstContactWithTypeButNoValue = values.contacts.findIndex((contact: any) => contact.type && !contact.value);
                    if (firstContactWithTypeButNoValue !== -1) {
                        const contactInput = document.querySelector(`[data-contact-index="${firstContactWithTypeButNoValue}"] input[type="text"]`);
                        if (contactInput) {
                            (contactInput as HTMLElement).focus();
                            return;
                        }
                    }

                    const firstInvalidField = document.querySelector('.is-invalid');
                    if (firstInvalidField) {
                        (firstInvalidField as HTMLElement).focus();
                    }
                }, 100);
                return;
            }

            const formData = new FormData();
            formData.append("contacts", JSON.stringify(values.contacts));
            const url = route("seller.theme-settings.update", { id: settings.id })
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
        }
    })

    const getContactTypesArray = () => {
        if (Array.isArray(contact_types)) {
            return contact_types;
        }

        return Object.values(contact_types);
    };

    const CONTACT_TYPES = getContactTypesArray();

    const getContactConfig = (type: string) => {
        if (!contact_types || typeof contact_types !== 'object') {
            return null;
        }
        return contact_types[type] || null;
    };

    const addContact = () => {
        const newContacts = [...formik.values.contacts, { type: "", value: "" }];
        formik.setFieldValue("contacts", newContacts, false);
    };

    const removeContact = (index: number) => {
        const newContacts = formik.values.contacts.filter((_, i) => i !== index);
        formik.setFieldValue("contacts", newContacts);
    };

    const updateContact = (index: number, field: 'type' | 'value', value: string) => {
        const newContacts = [...formik.values.contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        formik.setFieldValue("contacts", newContacts);
        formik.setFieldTouched(`contacts.${index}.${field}`, false);
    };

    return (
        <>
            <style>
                {`
                    .contact-dropdown-toggle:focus,
                    .contact-dropdown-toggle:active,
                    .contact-dropdown-toggle.show {
                        background-color: white !important;
                        border-color: #ced4da !important;
                        color: #495057 !important;
                        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
                    }
                    .contact-dropdown-toggle:hover {
                        background-color: #f8f9fa !important;
                        border-color: #ced4da !important;
                        color: #495057 !important;
                    }
                    .contact-dropdown-toggle.is-invalid {
                        border-color: #dc3545 !important;
                    }
                    .contact-dropdown-toggle.is-invalid:focus {
                        border-color: #dc3545 !important;
                        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
                    }
                `}
            </style>
            <Form noValidate onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <h5 className="mb-2">{t("Contact")}<span className="text-danger">*</span></h5>
                    <p className="text-muted fs-14 mb-3">{t("Add your contact information for customers to reach you")}</p>
                    <div className="mb-3">
                        {formik.values.contacts.map((contact, index) => (
                            <Row key={index} className="mb-2" data-contact-index={index}>
                                <Col md={3}>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="outline-secondary"
                                            className={`w-100 d-flex align-items-center justify-content-between contact-dropdown-toggle ${(!contact.type && formik.touched.contacts) || (formik.errors.contacts?.[index] && typeof formik.errors.contacts[index] === 'object' && (formik.errors.contacts[index] as any)?.type) ? 'is-invalid' : ''}`}
                                            style={{ height: '38px' }}
                                        >
                                            {contact.type ? (
                                                <div className="d-flex align-items-center">
                                                    <i className={`${CONTACT_TYPES.find((t: any) => t.value === contact.type)?.icon} me-2`}></i>
                                                    {CONTACT_TYPES.find((t: any) => t.value === contact.type)?.label}
                                                </div>
                                            ) : (
                                                <span className="text-muted">{t("Select contact type")}</span>
                                            )}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100">
                                            {CONTACT_TYPES.map((type: any) => (
                                                <Dropdown.Item
                                                    key={type.value}
                                                    onClick={() => updateContact(index, 'type', type.value)}
                                                    className="d-flex align-items-center"
                                                    disabled={!!formik.values.contacts.find(contact => contact.type === type.value)}
                                                >
                                                    <i className={`${type.icon} me-2`}></i>
                                                    {type.label}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {/* Show type error */}
                                    {(!contact.type && formik.touched.contacts) && (
                                        <div className="invalid-feedback d-block">
                                            {t("Please select contact type")}
                                        </div>
                                    )}
                                </Col>
                                <Col md={8}>
                                    {(() => {
                                        const config = getContactConfig(contact.type);
                                        if (contact.type && config && config.url_format) {
                                            return (
                                                <>
                                                    <div className="input-group">
                                                        <span className="input-group-text" style={{
                                                            backgroundColor: '#f8f9fa',
                                                            borderColor: '#ced4da',
                                                            color: '#6c757d',
                                                            fontSize: '14px',
                                                            minWidth: '120px'
                                                        }}>
                                                            {config.url_format}
                                                        </span>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={config.placeholder || t("Enter contact information")}
                                                            value={contact.value}
                                                            onChange={(e) => updateContact(index, 'value', e.target.value)}
                                                            isInvalid={!!(contact.type && formik.touched.contacts?.[index]?.value && formik.errors.contacts?.[index])}
                                                        />
                                                    </div>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <Form.Control
                                                    type="text"
                                                    placeholder={config?.placeholder || t("Enter contact information")}
                                                    value={contact.value}
                                                    onChange={(e) => updateContact(index, 'value', e.target.value)}
                                                    isInvalid={!!(contact.type && formik.touched.contacts?.[index]?.value && formik.errors.contacts?.[index])}
                                                />
                                            );
                                        }
                                    })()}
                                    {contact.type && formik.touched.contacts?.[index]?.value && formik.errors.contacts?.[index] && (
                                        <div className="invalid-feedback d-block">
                                            {(formik.errors.contacts[index] as any)?.value}
                                        </div>
                                    )}
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="danger"
                                        onClick={() => removeContact(index)}
                                        disabled={formik.values.contacts.length === 1}
                                    >
                                        <i className="ri-indeterminate-circle-line"></i>
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button
                            variant="secondary"
                            onClick={addContact}
                            type="button"
                        >
                            <i className="ri-add-circle-line"></i>{" "}{t("Add Contact")}
                        </Button>
                    </div>
                </div>
                <div className="text-start">
                    <Button type="submit" variant="success">
                        {t("Update")}
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default ContactConfig;
