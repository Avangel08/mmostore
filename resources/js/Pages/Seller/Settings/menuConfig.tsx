import React, { useCallback, useMemo } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Select from "react-select";
import { router, usePage } from "@inertiajs/react";
import { showToast } from "../../../utils/showToast";

interface MenuType {
    label: string;
    value: string;
    status: string;
}

const optionStatus = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

// Component con — chỉ render lại khi props thay đổi
const MenuItem = React.memo(
    ({ index, item, onChange, onBlur, setFieldValue, setFieldTouched, remove, t, menusLength, errors, touched }: any) => {
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

        const getError = (field: string) =>
            touched?.[index]?.[field] && errors?.[index]?.[field]
                ? errors[index][field]
                : "";

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
                        isInvalid={!!getError("label")}
                    />
                    <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                        {" "}
                        {getError("label")}
                    </Form.Control.Feedback>
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
                            isInvalid={!!getError("value")}
                        />
                        <Form.Control.Feedback type="invalid" className="invalid-feedback d-block">
                            {" "}
                            {getError("value")}
                        </Form.Control.Feedback>
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
                    {getError("status") && (
                        <div className="text-danger mt-1 small">{getError("status")}</div>
                    )}
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

const MenuConfig = ({ activeTab }: any) => {
    const { t } = useTranslation();
    const { settings } = usePage().props as any

    const formik = useFormik<{ menus: MenuType[] }>({
        initialValues: {
            menus: settings?.menus || [{
                label: "",
                value: "",
                status: "active",
            }],
        },
        validationSchema: Yup.object({
            menus: Yup.array()
                .of(
                    Yup.object().shape({
                        label: Yup.string()
                            .trim()
                            .required(t("Label is required")),
                        value: Yup.string()
                            .trim()
                            .required(t("URL is required"))
                            .matches(
                                /^(?!https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/,
                                t("Enter a valid URL without") + " http(s)://"
                            ),
                        status: Yup.string()
                            .oneOf(["active", "inactive"], t("Invalid status"))
                            .required(t("Status is required")),
                    })
                )
                .test("unique-labels", t("Duplicate labels found"), function (menus) {
                    if (!menus) return true;
                    const seen = new Map<string, number>();
                    for (let i = 0; i < menus.length; i++) {
                        const key = menus[i]?.label?.trim().toLowerCase();
                        if (!key) continue;
                        if (seen.has(key)) {
                            // gắn lỗi vào chính field label của phần tử trùng
                            return this.createError({
                                path: `${this.path}[${i}].label`,
                                message: t("Duplicate label at position {{pos}}", { pos: i + 1 }),
                            });
                        }
                        seen.set(key, i);
                    }
                    return true;
                })
                .test("unique-values", t("Duplicate URLs found"), function (menus) {
                    if (!menus) return true;
                    const seen = new Map<string, number>();
                    for (let i = 0; i < menus.length; i++) {
                        const key = menus[i]?.value?.trim().toLowerCase();
                        if (!key) continue;
                        if (seen.has(key)) {
                            return this.createError({
                                path: `${this.path}[${i}].value`,
                                message: t("Duplicate URL at position {{pos}}", { pos: i + 1 }),
                            });
                        }
                        seen.set(key, i);
                    }
                    return true;
                }),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("menus", JSON.stringify(values.menus));
            formData.append("tab", activeTab);
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
                    if (errors && Object.keys(errors).length > 0) {
                        const formErrors: any = {};
                        Object.keys(errors).forEach((key) => {
                            setDeep(formErrors, key, errors[key])
                        })
                        console.log({ formErrors, errors })
                        formik.setErrors(formErrors);

                        // Hiển thị tất cả thông báo lỗi từ server validate
                        Object.values(errors).forEach((msg: any) => showToast(t(msg), "error"));
                    } else {
                        showToast(t("An unexpected server error occurred"), "error")
                    }
                },
            });
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
    console.log(formik.errors)
    function setDeep(obj: any, path: string, value: any) {
        const keys = path
            .replace(/\[(\w+)\]/g, '.$1') // đổi [0] → .0
            .replace(/^\./, '') // bỏ dấu chấm đầu
            .split('.');

        let current = obj;
        keys.forEach((key, index) => {
            // Nếu chưa tới key cuối → tạo object hoặc mảng nếu chưa có
            if (index < keys.length - 1) {
                if (!(key in current)) {
                    // nếu key kế tiếp là số → tạo mảng
                    const nextKey = keys[index + 1];
                    current[key] = /^\d+$/.test(nextKey) ? [] : {};
                }
                current = current[key];
            } else {
                // key cuối → gán giá trị
                current[key] = value;
            }
        });
    }

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
                                            errors={formik.errors.menus}
                                            touched={formik.touched.menus}
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
