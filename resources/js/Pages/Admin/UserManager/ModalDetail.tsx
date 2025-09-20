import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Slide, toast } from "react-toastify";
import * as Yup from "yup" ;
import { showToast } from "../../../utils/showToast";

interface PageProps {
    message?: {
        success?: string;
        error?: string;
        info?: string;
    };
}
export const ModalDetail = ({ show, onHide, dataEdit }: {
    show: boolean;
    onHide: () => void;
    dataEdit?: any;
}) => {
    const maxLengthName = 50;
    const maxLengthEmail = 50;
    const { t } = useTranslation();
    const isEditMode = !!dataEdit;

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            type: "",
            status: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().max(maxLengthName, `Must be ${maxLengthName} characters or less`).required(t("Please enter this field")),
            email: Yup.string().max(maxLengthEmail, `Must be ${maxLengthEmail} characters or less`).required(t("Please enter this field")),
            type: Yup.string().required(t("Please enter this field")),
            status: Yup.string().required(t("Please enter this field")),
        }),
        onSubmit: (values) => {
            const url = isEditMode ? route("admin.user.update", { id: dataEdit.id }) : route("admin.user.add");
            const method = isEditMode ? "put" : "post";
            const submissionData = {
                ...values,
            };

            router[method](url, submissionData, {
                onSuccess: () => {
                    formik.resetForm();
                    onHide();
                },
                onError: (errors) => {
                    if (typeof errors === 'object') {
                        const errorMessages = Object.values(errors).flat();
                        const message = errorMessages.join(", ");
                        showToast(message, "error");
                    } else {
                        showToast("An error occurred", "error");
                    }
                },
            });
        },
    });

    useEffect(() => {
        if (dataEdit) {
            formik.setValues({
                name: dataEdit.name || "",
                email: dataEdit.email || "",
                type: dataEdit.type || "",
                status: dataEdit.status || "",
            });
        } else {
            formik.setValues({
                name: "",
                email: "",
                type: "",
                status: "",
            });
        }
    }, [dataEdit]);

    useEffect(() => {
        if (!show) {
            formik.resetForm();
        }
    }, [show]);

    return (
        <Modal
            id="myModal"
            backdrop={"static"}
            show={show}
            onHide={() => { formik.resetForm(); onHide(); }}
            centered
        >
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Modal.Header closeButton>
                    <h5>{ isEditMode ? t("Edit") : t("Add") }</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>{ t("Name") } <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={ t("Enter name") }
                            maxLength={ maxLengthName }
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            value={ formik.values.name }
                            isInvalid={ !!(formik.touched.name && formik.errors.name) }
                        />
                        <Form.Control.Feedback type="invalid">{ formik.errors.name }</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>{t("Email")} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={ t("Enter email") }
                            maxLength={ maxLengthEmail }
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            value={ formik.values.email }
                            isInvalid={ !!(formik.touched.email && formik.errors.email) }
                        />
                        <Form.Control.Feedback type="invalid">{ formik.errors.email }</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="type">
                        <Form.Label>{ t("Type") } <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="type"
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            value={ formik.values.type }
                            isInvalid={ !!(formik.touched.type && formik.errors.type) }
                        >
                            <option value="">{ t("Select type") }</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SELLER">SELLER</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{ formik.errors.type }</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="status_user">
                        <Form.Label>{ t("Status") } <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="status"
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            value={ formik.values.status }
                            isInvalid={ !!(formik.touched.status && formik.errors.status) }
                        >
                            <option value="">{ t("Select status") }</option>
                            <option value="0">{ t("Inactive") }</option>
                            <option value="1">{ t("Active") }</option>
                            <option value="2">{ t("Block") }</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{ formik.errors.status }</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => { formik.resetForm(); onHide(); }}>{ t("Close") }</Button>
                    <Button variant="primary" type="submit">{ isEditMode ? t("Update") : t("Save changes") }</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};