import React, { useState, useMemo, useCallback, useEffect, ComponentType } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  FormControlProps,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { showToast } from "../../../utils/showToast";
import { confirmDelete } from "../../../utils/sweetAlert";
import { usePage, router } from "@inertiajs/react";

interface ModalStockManagementProps {
  show: boolean;
  onHide: () => void;
  productId: number | string | null;
  refetchData: () => void;
}

export const ModalStockManagement = ({
  show,
  onHide,
  productId,
}: ModalStockManagementProps) => {
  const { t } = useTranslation();
  const [subProduct, setSubProduct] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const errors = usePage().props.errors;
  const [subProductPage, setSubProductPage] = useState(1);
  const [subProductPerPage, setSubProductPerPage] = useState(10);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSubProduct, setEditingSubProduct] = useState<any>(null);

  const fetchSubProducts = (
    subProductPage?: number,
    subProductPerPage?: number
  ) => {
    if (productId) {
      setTimeout(() => {
        setStateSubProduct(subProductPage, subProductPerPage);
        router.reload({
          only: ["subProduct"],
          data: { product_id: productId, subProductPage, subProductPerPage },
          onSuccess: (page: any) => {
            const subProduct = page?.props?.subProduct;
            if (subProduct) {
              setSubProduct(subProduct);
            }

            if (subProduct?.data?.[0]?.product) {
              setProduct(subProduct?.data?.[0]?.product);
            }
          },
        });
      }, 500);
    }
  };

  const setStateSubProduct = (page?: number, perPage?: number) => {
    setSubProductPage(page || 1);
    setSubProductPerPage(perPage || 10);
  };

  useEffect(() => {
    if (productId && show) {
      fetchSubProducts();
    }
  }, [productId, show]);

  const maxLengthName = 50;
  const maxPrice = 999999999;

  const statusOptions = [
    { value: "ACTIVE", label: t("Active") },
    { value: "INACTIVE", label: t("Inactive") },
  ];

  const formik = useFormik({
    initialValues: {
      subProductName: "",
      price: "",
      status: "ACTIVE",
    },
    validationSchema: Yup.object({
      subProductName: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter item name")),
      price: Yup.number()
        .positive(t("Price must be positive"))
        .max(maxPrice, `Price must be less than ${maxPrice}`)
        .required(t("Please enter price")),
      status: Yup.string().required(t("Please select status")),
    }),
    onSubmit: (values) => {
      if (!productId) {
        showToast(t("Product ID is required"), "error");
        return;
      }

      const url =
        isEditMode && editingSubProduct
          ? route("seller.sub-product.update", { id: editingSubProduct?.id })
          : route("seller.sub-product.store");
      const method = isEditMode && editingSubProduct ? "put" : "post";
      router[method](
        url,
        {
          ...values,
          productId,
        },
        {
          replace: true,
          onSuccess: (page: any) => {
            if (page?.props?.message?.error) {
              showToast(t(page.props.message.error), "error");
              fetchSubProducts(subProductPage, subProductPerPage);
              return;
            }

            if (page.props?.message?.success) {
              showToast(t(page.props.message.success), "success");
              if (isEditMode && editingSubProduct) {
                handleCancelEdit();
              } else {
                formik.resetForm();
              }
              fetchSubProducts(subProductPage, subProductPerPage);
            }
          },
        }
      );
    },
  });

  useEffect(() => {
    formik.setErrors(errors || {});
  }, [errors]);

  const handleEdit = (rowData: any) => {
    setIsEditMode(true);
    setEditingSubProduct(rowData);
    formik.setValues({
      subProductName: rowData.name || "",
      price: rowData.price || "",
      status: rowData.status || "ACTIVE",
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingSubProduct(null);
    formik.resetForm();
  };

  const handleDelete = async (id: number | string) => {
    const confirmed = await confirmDelete({
      title: t("Delete this sub-product?"),
      text: t("Once deleted, you will not be able to recover it."),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("seller.sub-product.destroy", { id }), {
        onSuccess: (page: any) => {
          if (page?.props?.message?.error) {
            showToast(t(page.props.message.error), "error");
            fetchSubProducts(subProductPage, subProductPerPage);
            return;
          }
          if (page.props?.message?.success) {
            showToast(t(page.props.message.success), "success");
            fetchSubProducts(subProductPage, subProductPerPage);
          }
        },
        onError: (errors: any) => {
          Object.keys(errors).forEach((key) => {
            showToast(t(errors[key]), "error");
          });
        },
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("Item name"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Price"),
        accessorKey: "price",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (
            <NumericFormat
              value={cell.getValue()}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
            />
          );
        },
      },
      {
        header: t("Status"),
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const status = cell.getValue();
          const className = {
            ACTIVE: "bg-success",
            INACTIVE: "bg-danger",
          } as any;

          const labelName = {
            ACTIVE: "Active",
            INACTIVE: "Inactive",
          } as any;

          return (
            <span
              className={`badge ${
                className?.[status] || "bg-dark"
              } fs-6 fw-medium`}
            >
              {t(labelName?.[status] || "Unknown")}
            </span>
          );
        },
      },
      {
        header: t("Stock"),
        accessorKey: "total_product",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Actions"),
        cell: (cellProps: any) => {
          const rowData = cellProps.row.original;
          return (
            <div className="d-flex gap-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Add account")}</Tooltip>}
              >
                <Button
                  size="sm"
                  variant="outline-success"
                  onClick={() => {
                    if (rowData?.id) {
                      router.get(
                        route("seller.account.edit", { id: rowData?.id })
                      );
                    }
                  }}
                >
                  <i className="ri-add-line"></i>
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Edit")}</Tooltip>}
              >
                <Button
                  size="sm"
                  variant="outline-info"
                  onClick={() => handleEdit(rowData)}
                >
                  <i className="ri-pencil-line"></i>
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Delete")}</Tooltip>}
              >
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(rowData?.id)}
                >
                  <i className="ri-delete-bin-fill"></i>
                </Button>
              </OverlayTrigger>
            </div>
          );
        },
        id: "actions",
        enableSorting: false,
      },
    ],
    [t, subProduct]
  );

  return (
    <Modal
      show={show}
      onHide={() => {
        handleCancelEdit();
        setSubProduct(null);
        setProduct(null);
        onHide();
      }}
      centered
      size="xl"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("Stock Management")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <Row>
            <Col>
              <div className="d-flex items-center gap-2">
                <span className="fw-bold">{t("Product name")}:</span>
                <span>{product?.name ?? ""}</span>
              </div>
            </Col>
          </Row>
        </div>

        <div className="mb-5">
          <Form onSubmit={formik.handleSubmit} noValidate>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="subProductName">
                  <Form.Label>
                    {t("Item name")}{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("Enter item name")}
                    maxLength={maxLengthName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.subProductName}
                    isInvalid={
                      !!(
                        formik.touched.subProductName &&
                        formik.errors.subProductName
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.subProductName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>
                    {t("Price")} <span className="text-danger">*</span>
                  </Form.Label>
                  <NumericFormat
                    customInput={Form.Control as React.ComponentType<FormControlProps>}
                    decimalSeparator=","
                    placeholder={t("Enter price")}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    allowNegative={false}
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      return floatValue === undefined || floatValue <= maxPrice;
                    }}
                    onValueChange={(values) => {
                      formik.setFieldValue("price", values.floatValue || "");
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                    isInvalid={!!(formik.touched.price && formik.errors.price)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            {isEditMode && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="status">
                    <Form.Label>
                      {t("Status")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      options={statusOptions}
                      value={statusOptions.find(
                        (option) => option.value === formik.values.status
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "status",
                          selectedOption?.value || "ACTIVE"
                        );
                      }}
                      placeholder={t("Select status")}
                      isClearable={false}
                      isSearchable={false}
                      className={
                        formik.touched.status && formik.errors.status
                          ? "is-invalid"
                          : ""
                      }
                    />
                    {formik.touched.status && formik.errors.status && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.status}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col md={6} className="d-flex align-items-center gap-2">
                {isEditMode ? (
                  <>
                    <Button variant="primary" type="submit">
                      <i className="ri-save-line align-bottom me-1"></i>
                      {t("Update")}
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      <i className="ri-close-line align-bottom me-1"></i>
                      {t("Cancel")}
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" type="submit">
                    <i className="ri-add-line align-bottom me-1"></i>
                    {t("Add")}
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </div>

        {!isEditMode && (
          <div className="mb-4 px-3">
            <TableWithContextMenu
              columns={columns}
              data={subProduct}
              divClass="table-responsive table-card mb-3"
              tableClass="table align-middle table-nowrap mb-0"
              theadClass="table-light"
              enableContextMenu={false}
              isPaginateTable={true}
              onReloadTable={fetchSubProducts}
              keyPageParam="subProductPage"
              keyPerPageParam="subProductPerPage"
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="light"
          onClick={() => {
            handleCancelEdit();
            setSubProduct(null);
            setProduct(null);
            onHide();
          }}
        >
          {t("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
