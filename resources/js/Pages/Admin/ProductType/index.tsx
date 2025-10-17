import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Layout from "../../../CustomAdminLayouts";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import TableProductType from "./TableProductType";
import { ModelProductType } from "./ModalProductType";
import ProductTypeFilter from "./ProductTypeFilter";
import { confirmDelete } from "../../../utils/sweetAlert";
import { showToast } from "../../../utils/showToast";

const ProductType = () => {
  const { t } = useTranslation();
  const { productTypes } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const fetchData = (
    currentPage: number = 1,
    perPage: number = 10,
    filters?: any
  ) => {
    router.reload({
      only: ["productTypes"],
      replace: true,
      data: {
        page: currentPage,
        perPage: perPage,
        ...filters,
      },
    });
  };

  const handleFilter = (
    currentPage: number = 1,
    perPage: number = 10,
    filters: any
  ) => {
    fetchData(currentPage, perPage, filters);
  };

  const openModalEdit = (id: number | string) => {
    router.reload({
      only: ["detailProductType"],
      data: { id },
      replace: true,
      onSuccess: (page) => {
        setDataEdit(page.props.detailProductType);
        setShowModal(true);
      },
    });
  };

  const onDelete = async (id: number | string, name: string) => {
    if (!id) {
      showToast(t("Invalid ID"), "error");
      return;
    }

    const confirmed = await confirmDelete({
      title: t("Delete product type '{{name}}'?", { name }),
      text: t("Once deleted, you will not be able to recover it."),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("admin.product-types.destroy", { id }), {
        replace: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page: any) => {
          if (page.props?.message?.error) {
            showToast(t(page.props.message.error), "error");
            return;
          }
          if (page.props?.message?.success) {
            showToast(t(page.props.message.success), "success");
          }
        },
      });
    }
  };

  const onDeleteMultiple = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirmDelete({
      title: t("Delete selected items?"),
      text: t(
        `You are about to delete {{count}} product types. Once deleted, you will not be able to recover them.`, { count: selectedIds.length }
      ),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("admin.product-types.delete-multiple"), {
        data: { ids: selectedIds },
        onSuccess: (page: any) => {
          if (page.props?.message?.error) {
            showToast(t(page.props.message.error), "error");
            return;
          }

          if (page.props?.message?.success) {
            showToast(t(page.props.message.success), "success");
          }
          setSelectedIds([]);
        },
      });
    }
  };

  const handleSelectionChange = (selectedItems: (string | number)[]) => {
    setSelectedIds(selectedItems);
  };

  return (
    <React.Fragment>
      <Head title={t("Product type")} />
      <div className="page-content">
        <ToastContainer />
        <ModelProductType
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setDataEdit(null);
          }}
          dataEdit={dataEdit}
        />
        <Container fluid>
          <BreadCrumb
            title={t("Product type")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <div className="mb-4">
                    <ProductTypeFilter 
                      onFilter={handleFilter}
                      additionalButtons={
                        <>
                          <Button
                            variant="success"
                            onClick={() => {
                              setDataEdit(null);
                              setShowModal(true);
                            }}
                          >
                            <i className="ri-add-line align-bottom me-1"></i>{" "}
                            {t("Add product type")}
                          </Button>
                          {selectedIds.length > 0 && (
                            <Button variant="danger" onClick={onDeleteMultiple}>
                              <i className="ri-delete-bin-line align-bottom me-1"></i>{" "}
                              {t("Delete selected")} ({selectedIds.length})
                            </Button>
                          )}
                        </>
                      }
                    />
                  </div>
                  <Row>
                    <Col>
                      <TableProductType
                        data={productTypes || []}
                        onReloadTable={fetchData}
                        onEdit={openModalEdit}
                        onDelete={onDelete}
                        onSelectionChange={handleSelectionChange}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

ProductType.layout = (page: any) => <Layout children={page} />;
export default ProductType;
