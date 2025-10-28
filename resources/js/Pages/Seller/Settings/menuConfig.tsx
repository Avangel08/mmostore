import React, { useCallback, useMemo } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";

const optionStatus = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

// Component con — chỉ render lại khi props thay đổi
const MenuItem = React.memo(
    ({ index, item, onChange, onBlur, setFieldValue, setFieldTouched, remove, t, menusLength }: any) => {
        const statusOptions = useMemo(
            () =>
                optionStatus.map((opt) => ({
                    value: opt.value,
                    label: t(opt.label),
                })),
            [t]
        );

        const selectedStatus =
            statusOptions.find((option) => option.value === item.status) || null;

        return (
            <Row className="mb-2">
                <Col xs={3}>
                    <Form.Control
                        type="text"
                        value={item.label}
                        onChange={onChange}
                        onBlur={onBlur}
                        name={`menus.${index}.label`}
                        placeholder={t("Enter your menu label")}
                    />
                </Col>
                <Col>
                    <Form.Group className="input-group">
                        <span
                            className="input-group-text"
                            style={{
                                backgroundColor: "#f8f9fa",
                                borderColor: "#ced4da",
                                color: "#6c757d",
                                fontSize: "14px",
                                minWidth: "120px",
                            }}
                        >
                            https://
                        </span>
                        <Form.Control
                            type="text"
                            value={item.value}
                            onChange={onChange}
                            onBlur={onBlur}
                            name={`menus.${index}.value`}
                            placeholder={t("Enter your menu url")}
                        />
                    </Form.Group>
                </Col>
                <Col xs={2}>
                    <Select
                        options={statusOptions}
                        placeholder={t("Select status")}
                        name={`menus.${index}.status`}
                        value={selectedStatus}
                        onChange={(selected) =>
                            setFieldValue(`menus.${index}.status`, selected?.value || "")
                        }
                        onBlur={() => setFieldTouched(`menus.${index}.status`, true)}
                        isSearchable={false}
                        menuPortalTarget={document.body}
                    />
                </Col>
                <Col xs="auto">
                    <Button
                        variant="danger"
                        onClick={() => remove(index)}
                        disabled={menusLength === 1}
                    >
                        <i className="ri-indeterminate-circle-line"></i>
                    </Button>
                </Col>
            </Row>
        );
    }
);

const MenuConfig = () => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            menus: [
                {
                    label: "",
                    value: "",
                    status: "active",
                },
            ],
        },
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const handleAddMenu = useCallback(
        (arrayHelpers: any) => {
            arrayHelpers.push({
                label: "",
                value: "",
                status: "active",
            });
        },
        []
    );

    return (
        <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <h5 className="mb-2">
                        {t("Menu")}<span className="text-danger">*</span>
                    </h5>
                </div>
                <Row>
                    <Col>
                        <FieldArray
                            name="menus"
                            render={(arrayHelpers) => (
                                <div className="mb-3">
                                    {formik.values.menus.map((menu, index) => (
                                        <MenuItem
                                            key={index}
                                            index={index}
                                            item={menu}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            setFieldValue={formik.setFieldValue}
                                            setFieldTouched={formik.setFieldTouched}
                                            remove={arrayHelpers.remove}
                                            t={t}
                                            menusLength={formik.values.menus.length}
                                        />
                                    ))}
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleAddMenu(arrayHelpers)}
                                    >
                                        <i className="ri-add-circle-line"></i> {t("Add Menu")}
                                    </Button>
                                </div>
                            )}
                        />
                    </Col>
                </Row>
                <div className="text-start">
                    <Button type="submit" variant="success">
                        {t("Update")}
                    </Button>
                </div>
            </Form>
        </FormikProvider>
    );
};

export default React.memo(MenuConfig);
