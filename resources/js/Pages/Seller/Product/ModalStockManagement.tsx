import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { showToast } from "../../../utils/showToast";
import { confirmDelete } from "../../../utils/sweetAlert";
import { usePage, router } from "@inertiajs/react";
import { useQueryParams } from "../../../hooks/useQueryParam";

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
  const params = useQueryParams();

  const fetchSubProducts = (
    subProductPage: number = 1,
    subProductPerPage: number = 10
  ) => {
    if (productId) {
      router.reload({
        only: ["subProduct"],
        replace: true,
        data: { product_id: productId, subProductPage, subProductPerPage },
        onSuccess: (page: any) => {
          const subProduct = page?.props?.subProduct;
          if (subProduct) {
            setSubProduct({ ...subProduct });
          }

          if (subProduct?.data?.[0]?.product) {
            setProduct(subProduct?.data?.[0]?.product);
          }
        },
      });
    }
  };

  useEffect(() => {
    if (productId && show) {
      fetchSubProducts();
    }
  }, [productId, show]);

  const maxLengthName = 50;
  const maxPrice = 999999;

  const formik = useFormik({
    initialValues: {
      subProductName: "",
      price: "",
    },
    validationSchema: Yup.object({
      subProductName: Yup.string()
        .max(maxLengthName, `Must be ${maxLengthName} characters or less`)
        .required(t("Please enter sub-product name")),
      price: Yup.number()
        .positive(t("Price must be positive"))
        .max(maxPrice, `Price must be less than ${maxPrice}`)
        .required(t("Please enter price")),
    }),
    onSubmit: (values) => {
      if (!productId) {
        showToast(t("Product ID is required"), "error");
        return;
      }
      router.post(
        route("seller.sub-product.store"),
        {
          ...values,
          productId,
        },
        {
          replace: true,
          onSuccess: (page: any) => {
            if (page?.props?.message?.error) {
              showToast(t(page.props.message.error), "error");
              fetchSubProducts();
              return;
            }

            if (page.props?.message?.success) {
              showToast(t(page.props.message.success), "success");
              formik.resetForm();
              fetchSubProducts();
            }
          },
          onError: (errors: any) => {
            Object.keys(errors).forEach((key) => {
              showToast(t(errors[key]), "error");
            });
          },
        }
      );
    },
  });

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
            fetchSubProducts();
            return;
          }
          if (page.props?.message?.success) {
            showToast(t(page.props.message.success), "success");
            fetchSubProducts();
          }
        },
        onError: (errors: any) => {
          const errorMessage =
            errors?.message || t("Failed to delete sub-product");
          showToast(t(errorMessage), "error");
        },
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("Sub-product name"),
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
          return <span>${cell.getValue()?.toFixed(2)}</span>;
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
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(rowData.id)}
              >
                <i className="ri-delete-bin-fill"></i>
              </Button>
            </div>
          );
        },
        id: "actions",
        enableSorting: false,
      },
    ],
    [t]
  );

  return (
    <Modal
      show={show}
      onHide={() => {
        formik.resetForm();
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
              <Col md={4}>
                <Form.Group className="mb-3" controlId="subProductName">
                  <Form.Label>
                    {t("Sub-product name")}{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("Enter sub-product name")}
                    maxLength={maxLengthName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.subProductName}
                    isInvalid={
                      !!(
                        (formik.touched.subProductName &&
                          formik.errors.subProductName) ||
                        errors?.subProductName
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.subProductName || errors?.subProductName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>
                    {t("Price")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder={t("Enter price")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                    isInvalid={
                      !!(
                        (formik.touched.price && formik.errors.price) ||
                        errors?.price
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price || errors?.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex">
                <Button variant="primary" type="submit" className="mb-3">
                  <i className="ri-add-line align-bottom me-1"></i>
                  {t("Add")}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

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
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="light"
          onClick={() => {
            formik.resetForm();
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
