import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import { Props } from ".";

const ContactConfig = ({validation}: Props) => {
    const { t } = useTranslation();
    const { contact_types } = usePage().props as any;

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
        const newContacts = [...validation.values.contacts, {type: "", value: ""}];
        validation.setFieldValue("contacts", newContacts);
    };

    const removeContact = (index: number) => {
        const newContacts = validation.values.contacts.filter((_, i) => i !== index);
        validation.setFieldValue("contacts", newContacts);
    };

    const updateContact = (index: number, field: 'type' | 'value', value: string) => {
        const newContacts = [...validation.values.contacts];
        newContacts[index] = {...newContacts[index], [field]: value};
        validation.setFieldValue("contacts", newContacts);
        validation.setFieldTouched(`contacts.${index}.${field}`, true);
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
            <div className="mb-3">
                <h5 className="mb-2">{t("Contact")}<span className="text-danger">*</span></h5>
                <p className="text-muted fs-14 mb-3">{t("Add your contact information for customers to reach you")}</p>
                    <div className="mb-3">
                        {validation.values.contacts.map((contact, index) => (
                            <Row key={index} className="mb-2" data-contact-index={index}>
                                <Col md={3}>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="outline-secondary"
                                            className={`w-100 d-flex align-items-center justify-content-between contact-dropdown-toggle ${(!contact.type && validation.touched.contacts) || (validation.errors.contacts?.[index] && typeof validation.errors.contacts[index] === 'object' && (validation.errors.contacts[index] as any)?.type) ? 'is-invalid' : ''}`}
                                            style={{height: '38px'}}
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
                                                >
                                                    <i className={`${type.icon} me-2`}></i>
                                                    {type.label}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {/* Show type error */}
                                    {(!contact.type && validation.touched.contacts) && (
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
                                                            isInvalid={!!(contact.type && validation.touched.contacts?.[index]?.value && validation.errors.contacts?.[index])}
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
                                                    isInvalid={!!(contact.type && validation.touched.contacts?.[index]?.value && validation.errors.contacts?.[index])}
                                                />
                                            );
                                        }
                                    })()}
                                    {contact.type && validation.touched.contacts?.[index]?.value && validation.errors.contacts?.[index] && (
                                        <div className="invalid-feedback d-block">
                                            {(validation.errors.contacts[index] as any)?.value}
                                        </div>
                                    )}
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="danger"
                                        onClick={() => removeContact(index)}
                                        disabled={validation.values.contacts.length === 1}
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
        </>
    );
};

export default ContactConfig;
