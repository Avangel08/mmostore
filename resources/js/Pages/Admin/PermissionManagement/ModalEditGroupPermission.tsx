import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import { max } from "moment";
import React, { ChangeEvent } from "react";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Slide, toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
export const ModalEditGroupPermission = ({
  show,
  onHide,
  data
}: {
  show: boolean;
  onHide: () => void;
  data: any;
}) => {
  const maxLengthName = 50;
  const maxLengthDescription = 1000;
  const { t } = useTranslation();
  const groupPermissionValueRef = React.useRef<HTMLDivElement>(null);
  
  // Extract permission names without the key prefix for the checkbox list
  const getPermissionNameFromFull = (fullName: string, key: string) => {
    return fullName.replace(`${key}_`, '');
  };
  
  const [currentPermissionList, setCurrentPermissionList] = React.useState<
    string[]
  >([]);
  const valueInputPermissionRef = React.useRef<HTMLInputElement>(null);

  // Update permission list when data changes
  React.useEffect(() => {
    if (data?.permissions && data?.key) {
      const permissionNames = data.permissions.map((item: any) => 
        getPermissionNameFromFull(item?.name, data?.key)
      );
      setCurrentPermissionList(permissionNames);
    }
  }, [data]);

  const showToast = (message: string, type: "success" | "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const formik = useFormik({
    initialValues: {
      groupPermissionName: data?.name || "",
      groupPermissionDescription: data?.description || "",
      groupPermissionKey: data?.key || "",
      groupPermissionValue: data?.permissions && data?.key ? 
        data.permissions.map((item: any) => getPermissionNameFromFull(item?.name, data?.key)) : [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      groupPermissionName: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter this field")),
      groupPermissionDescription: Yup.string().max(
        maxLengthDescription,
        `Must be ${maxLengthDescription} characters or less`
      ),
      groupPermissionValue: Yup.array()
        .min(1, "Please select at least one permission")
        .of(
          Yup.string().max(
            maxLengthName,
            `Must be ${maxLengthName} characters or less`
          )
        ),
    }),
    onSubmit: (values) => {
      const submitData = {
        id: data?.id,
        groupPermissionName: values.groupPermissionName,
        groupPermissionDescription: values.groupPermissionDescription,
        groupPermissionKey: data?.key,
        groupPermissionValue: values.groupPermissionValue,
      };
      
      router.put(route("admin.permissions.update", data?.id), submitData, {
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

  const handleChangeKey = (e: React.ChangeEvent<any>) => {
    const cleanValue = e.target.value.replace(/[^A-Za-z-.0-9]/g, "");
    if (cleanValue.trim() === "") {
      groupPermissionValueRef.current?.classList.add("d-none");
    } else {
      groupPermissionValueRef.current?.classList.remove("d-none");
    }
    formik.setFieldValue("groupPermissionKey", cleanValue);
  };

  React.useEffect(() => {
    if (data?.key && groupPermissionValueRef.current) {
      groupPermissionValueRef.current.classList.remove("d-none");
    }
  }, [data]);

  const onClickSelectAllPermission = () => {
    const checkallCheckbox: any = document.getElementById("checkAll");
    if (checkallCheckbox.checked) {
      formik.setFieldValue(
        "groupPermissionValue",
        currentPermissionList.concat("all")
      );
    } else {
      formik.setFieldValue("groupPermissionValue", []);
    }
  };

  const onClickSelectOnePermission = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const checked = e.target.checked;
    let newValues: string[] = [...formik.values.groupPermissionValue];
    if (checked) {
      newValues.push(value);
    } else {
      newValues = newValues.filter((v) => v !== value);
    }
    formik.setFieldValue("groupPermissionValue", newValues);
  };

  const addNewPermission = () => {
    if (valueInputPermissionRef?.current?.value) {
      const newPermission = valueInputPermissionRef.current.value;
      setCurrentPermissionList((prev) => {
        if (prev.includes(newPermission)) {
          return prev;
        }
        return [...prev, newPermission];
      });
      
      // Automatically add the new permission to selected values
      const currentValues = [...formik.values.groupPermissionValue];
      if (!currentValues.includes(newPermission)) {
        currentValues.push(newPermission);
        formik.setFieldValue("groupPermissionValue", currentValues);
      }
      
      valueInputPermissionRef.current.value = "";
    }
  };

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
          <h5>{t("Edit group permission")}</h5>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="groupPermissionName">
            <Form.Label>
              {t("Group permission name")}{" "}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t("Enter group permission name")}
              maxLength={maxLengthName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.groupPermissionName}
              isInvalid={
                !!(
                  formik.touched.groupPermissionName &&
                  formik.errors.groupPermissionName
                )
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.groupPermissionName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* description */}
          <Form.Group className="mb-3" controlId="groupPermissionDescription">
            <Form.Label>{t("Description")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              maxLength={maxLengthDescription}
              placeholder={t("Enter description")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.groupPermissionDescription}
              isInvalid={
                !!(
                  formik.touched.groupPermissionDescription &&
                  formik.errors.groupPermissionDescription
                )
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.groupPermissionDescription}
            </Form.Control.Feedback>
          </Form.Group>

          {/* key */}
          <Form.Group className="mb-3" controlId="groupPermissionKey">
            <Form.Label>
              Key <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t("Enter key")}
              maxLength={maxLengthName}
              onBlur={formik.handleBlur}
              value={formik.values.groupPermissionKey}
              disabled={true}
              isInvalid={
                !!(
                  formik.touched.groupPermissionKey &&
                  formik.errors.groupPermissionKey
                )
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.groupPermissionKey}
            </Form.Control.Feedback>
          </Form.Group>

          {/* permission check box */}
          <Form.Group
            ref={groupPermissionValueRef}
            id="permissionCheckbox"
            className="mb-3"
            controlId="groupPermissionValue"
          >
            <Form.Label htmlFor="">
              {t("Permissions")} <span className="text-danger">*</span>
            </Form.Label>
            <Container>
              <Row>
                {currentPermissionList.length > 0 && (
                  <Col xs={12} className="mb-2">
                    <Form.Check
                      id="checkAll"
                      type="checkbox"
                      value="all"
                      label={t("Select all")}
                      onChange={(e) => {
                        onClickSelectAllPermission();
                      }}
                      onBlur={formik.handleBlur}
                      checked={formik.values.groupPermissionValue?.includes(
                        "all"
                      )}
                    />
                  </Col>
                )}
                {currentPermissionList.map((permission: string) => {
                  return (
                    <Col xs={12} lg={6} className="mb-2">
                      <Form.Check
                        key={permission}
                        type="checkbox"
                        id={`form-check-${permission}`}
                        value={permission}
                        label={`${data?.key}_${permission}`}
                        onChange={(e) => {
                          onClickSelectOnePermission(e);
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.groupPermissionValue?.includes(
                          permission
                        )}
                      />
                    </Col>
                  );
                })}
              </Row>
              <Row>
                {formik.touched.groupPermissionValue &&
                  formik.errors.groupPermissionValue && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "0.875em" }}
                    >
                      {formik.errors.groupPermissionValue}
                    </div>
                  )}
              </Row>

              <Form.Group className="d-flex flex-row gap-2 mt-3">
                <Form.Control
                  placeholder={t("Input permission name")}
                  maxLength={maxLengthName}
                  ref={valueInputPermissionRef}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(
                      /[^A-Za-z-.0-9]/g,
                      ""
                    );
                    e.target.value = cleanValue;
                  }}
                ></Form.Control>
                <Button size="sm" variant="primary" onClick={addNewPermission}>
                  {t("Add")}
                </Button>
              </Form.Group>
            </Container>
          </Form.Group>
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
            {t("Update")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
