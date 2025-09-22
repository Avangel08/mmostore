import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import Layout from "../../../CustomSellerLayouts";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import TableProduct from "./TableProduct";
import { ModalStockManagement } from "./ModalStockManagement";
import ProductFilter from "./ProductFilter";
import { useQueryParams } from "../../../hooks/useQueryParam";
import { confirmDelete } from "../../../utils/sweetAlert";
import { showToast } from "../../../utils/showToast";

const Product = () => {
  const { t } = useTranslation();
  const { products } = usePage().props;
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<
    number | string | null
  >(null);
  const params = useQueryParams();
  const refetchData = () => {
    router.reload({
      only: ["products"],
      data: {
        ...params,
      },
    });
  };

  const fetchData = (
    currentPage: number = 1,
    perPage: number = 10,
    filters?: any
  ) => {
    router.reload({
      only: ["products"],
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

  const openEditPage = (id: number | string) => {
    router.get(route("seller.product.edit", { id }));
  };

  const openAddPage = () => {
    router.get(route("seller.product.add"));
  }

  const openModalStock = (id: number | string) => {
    setSelectedProductId(id);
    setShowStockModal(true);
  };

  const onDelete = async (id: number | string) => {
    const confirmed = await confirmDelete({
      title: t("Delete this item?"),
      text: t("Once deleted, you will not be able to recover it."),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("seller.product.delete", { id }), {
        onSuccess: (page: any) => {
          if (page.props?.message?.error) {
            showToast(t(page.props.message.error), "error");
            return;
          }
          if (page.props?.message?.success) {
            showToast(t(page.props.message.success), "success");
          }
          refetchData();
        },
      });
    }
  };

  const onDeleteMultiple = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirmDelete({
      title: t("Delete selected items?"),
      text: t(
        `You are about to delete {{count}} products. Once deleted, you will not be able to recover them.`,
        { count: selectedIds.length }
      ),
      confirmButtonText: t("Delete now"),
      cancelButtonText: t("Cancel"),
    });

    if (confirmed) {
      router.delete(route("seller.product.delete-multiple"), {
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
          refetchData();
        },
      });
    }
  };

  const handleSelectionChange = (selectedItems: (string | number)[]) => {
    setSelectedIds(selectedItems);
  };

  return (
    <React.Fragment>
      <Head title={t("Product Management")} />
      <div className="page-content">
        <ToastContainer />
        <ModalStockManagement
          show={showStockModal}
          onHide={() => {
            setShowStockModal(false);
            setSelectedProductId(null);
          }}
          productId={selectedProductId}
          refetchData={refetchData}
        />
        <Container fluid>
          <BreadCrumb
            title={t("Product Management")}
            pageTitle={t("Homepage")}
          />
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">{t("Products")}</h5>
                </Card.Header>
                <Card.Body>
                  <ProductFilter onFilter={handleFilter} />
                  <Row style={{ marginBottom: "32px" }}>
                    <Col>
                      <div className="d-flex gap-2">
                        <Button variant="success" onClick={openAddPage}>
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          {t("Add product")}
                        </Button>
                        {selectedIds.length > 0 && (
                          <Button variant="danger" onClick={onDeleteMultiple}>
                            <i className="ri-delete-bin-line align-bottom me-1"></i>{" "}
                            {t("Delete selected")} ({selectedIds.length})
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TableProduct
                        data={products || []}
                        onReloadTable={fetchData}
                        onEdit={openEditPage}
                        onManageStock={openModalStock}
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

Product.layout = (page: any) => <Layout children={page} />;
export default Product;
