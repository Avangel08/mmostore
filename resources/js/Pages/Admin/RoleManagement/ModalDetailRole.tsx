import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Slide, toast } from "react-toastify";
import * as Yup from "yup" ;
import { showToast } from "../../../utils/showToast";
export const ModalDetailRole = ({
  show,
  onHide,
  dataEdit,
}: {
  show: boolean;
  onHide: () => void;
  dataEdit?: any;
}) => {
  const maxLengthName = 50;
  const { t } = useTranslation();
  const {guards, allGroupPermissions} = usePage().props;
  const isEditMode = !!dataEdit;

  const formik = useFormik({
    initialValues: {
      roleName: dataEdit?.name || "",
      guard: dataEdit?.guard_name || "",
      permissionIds: dataEdit?.group_permissions?.flatMap(group => 
        group.permissions.map(permission => permission.id)
      ) || [] as number[],
    },
    validationSchema: Yup.object({
      roleName: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter this field")),
      guard: Yup.string()
        .required(t("Please select guard")),
      permissionIds: Yup.array()
        .of(Yup.number()),
    }),
    onSubmit: (values) => {
      const url = isEditMode 
        ? route("admin.roles.update", { id: dataEdit.id })
        : route("admin.roles.add");
      
      const method = isEditMode ? "put" : "post";
      
      const filteredPermissionIds = values.permissionIds.filter(permissionId => {
        for (const group of allGroupPermissions || []) {
          const permission = group.permissions.find(p => p.id === permissionId);
          if (permission && permission.guard_name === values.guard) {
            return true;
          }
        }
        return false;
      });
      
      const submissionData = {
        ...values,
        permissionIds: filteredPermissionIds
      };
      
      router[method](url, submissionData, {
        onSuccess: (success) => {
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
        onError: (error) => {
          const message = Object.values(error).join(", ");
          showToast(message, "error");
        },
      });
    },
  });

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    let newPermissionIds = [...formik.values.permissionIds];
    if (checked) {
      newPermissionIds.push(permissionId);
    } else {
      newPermissionIds = newPermissionIds.filter(p => p !== permissionId);
    }
    formik.setFieldValue("permissionIds", newPermissionIds);
  };

  const handleGroupPermissionChange = (groupPermissionIds: number[], checked: boolean) => {
    let newPermissionIds = [...formik.values.permissionIds];
    if (checked) {
      groupPermissionIds.forEach(permissionId => {
        if (!newPermissionIds.includes(permissionId)) {
          newPermissionIds.push(permissionId);
        }
      });
    } else {
      newPermissionIds = newPermissionIds.filter(p => !groupPermissionIds.includes(p));
    }
    formik.setFieldValue("permissionIds", newPermissionIds);
  };

  const isGroupFullySelected = (groupPermissionIds: number[]) => {
    return groupPermissionIds.every(permissionId => formik.values.permissionIds.includes(permissionId));
  };

  const getFilteredGroupPermissions = () => {
    if (!allGroupPermissions) {
      return [];
    }
    
    if (!formik.values.guard) {
      return allGroupPermissions;
    }
    
    return allGroupPermissions.map(group => ({
      ...group,
      permissions: group.permissions.filter(permission => 
        permission.guard_name === formik.values.guard
      )
    })).filter(group => group.permissions.length > 0);
  };

  // Clear permissions when guard changes (but not in edit mode)
  useEffect(() => {
    if (!isEditMode) {
      formik.setFieldValue("permissionIds", []);
    }
  }, [formik.values.guard, isEditMode]);

  // Reset form when modal opens/closes or when dataEdit changes
  useEffect(() => {
    if (show) {
      formik.setValues({
        roleName: dataEdit?.name || "",
        guard: dataEdit?.guard_name || "",
        permissionIds: dataEdit?.group_permissions?.flatMap(group => 
          group.permissions.map(permission => permission.id)
        ) || [],
      });
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
          <h5>{isEditMode ? t("Edit role") : t("Add role")}</h5>
        </Modal.Header>
        <Modal.Body>
          {/* Role Label */}
          <Form.Group className="mb-3" controlId="roleName">
            <Form.Label>
              {t("Role name")}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t("Enter role name")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.roleName}
              isInvalid={
                !!(formik.touched.roleName && formik.errors.roleName)
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.roleName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Guard */}
          <Form.Group className="mb-3" controlId="guard">
            <Form.Label>
              {t("Guard")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.guard}
              isInvalid={!!(formik.touched.guard && formik.errors.guard)}
            >
              <option value="">{t("Select guard")}</option>
              {guards?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.guard}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Permissions - Only show when guard is selected */}
          {formik.values.guard && (
            <Form.Group className="mb-3" controlId="permissionIds">
              <Form.Label>
                {t("Group permission")}
              </Form.Label>
              <Container className="border rounded p-3 bg-light">
                {getFilteredGroupPermissions().map((group, groupIndex) => (
                  <div key={group.id} className="mb-3">
                    <div className="fw-bold mb-2 text-primary">{group.name}</div>
                    <Row>
                      <Col xs={12} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id={`group-${group.id}-all`}
                          label={`${t("Select all")} ${group.name}`}
                          checked={isGroupFullySelected(group.permissions.map(p => p.id))}
                          onChange={(e) => {
                            handleGroupPermissionChange(
                              group.permissions.map(p => p.id),
                              e.target.checked
                            );
                          }}
                          className="fw-semibold text-secondary"
                        />
                      </Col>
                      {group.permissions.map((permission) => (
                        <Col xs={12} md={6} className="mb-2" key={permission.id}>
                          <Form.Check
                            type="checkbox"
                            id={`permission-${permission.id}`}
                            label={permission.name}
                            checked={formik.values.permissionIds.includes(permission.id)}
                            onChange={(e) => {
                              handlePermissionChange(permission.id, e.target.checked);
                            }}
                            className="ms-3"
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
                {formik.touched.permissionIds && formik.errors.permissionIds && (
                  <div className="text-danger" style={{ fontSize: "0.875em" }}>
                    {formik.errors.permissionIds}
                  </div>
                )}
              </Container>
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
          <Button variant="primary" type="submit">
            {isEditMode ? t("Update role") : t("Save changes")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};