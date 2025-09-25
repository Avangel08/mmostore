import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TableWithContextMenu from "../../../../Components/Common/TableWithContextMenu";
import { Button, Col } from "react-bootstrap";
import { confirmDelete } from "../../../../utils/sweetAlert";
import { usePage, router } from "@inertiajs/react";
import { showToast } from "../../../../utils/showToast";

const SellingProduct = () => {
  const { t } = useTranslation();
  const { subProduct } = usePage().props as any;

  const columns = useMemo(
    () => [
      {
        header: t("Product"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Created date"),
        accessorKey: "created_at",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (
            <span>{moment(cell.getValue()).format("DD/MM/YYYY HH:mm")}</span>
          );
        },
      },
      {
        header: t("Status"),
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const statusLabel = cell.getValue() || "Unknown";
          const className = {
            SUCCESS: "bg-success",
            FAIL: "bg-danger",
            Unknown: "bg-dark",
          } as any;

          return (
            <span
              className={`badge ${
                className?.[statusLabel] || "bg-dark"
              } fs-6 fw-medium`}
            >
              {t(statusLabel)}
            </span>
          );
        },
      },
      {
        header: t("Result"),
        accessorKey: "result",
        enableColumnFilter: false,
        enableSorting: true,
      },
    ],
    [t]
  );

  return (
    <>
      <Col lg={12} className="d-flex justify-content-between mb-4">
        <h5>{t("Products for sale")}</h5>
        <div className="d-flex gap-2">
          <Button
            variant="danger"
            onClick={async () => {
              const confirmed = await confirmDelete({
                title: t("Delete all unsold products?"),
                text: "",
                confirmButtonText: t("Delete now"),
                cancelButtonText: t("Cancel"),
              });
              if (!confirmed) {
                return;
              }

              router.delete(
                route("seller.account.destroy", { id: subProduct?.id ?? 0 }),
                {
                  onSuccess: (page: any) => {
                    if (page.props?.message?.error) {
                      showToast(t(page.props.message.error), "error");
                      return;
                    }

                    if (page.props?.message?.success) {
                      showToast(t(page.props.message.success), "success");
                    }
                  },
                  onError: (errors: any) => {
                    Object.keys(errors).forEach((key) => {
                      showToast(t(errors?.[key]), "error");
                    });
                  },
                }
              );
            }}
          >
            {t("Delete all")}
          </Button>
          <Button
            as="a"
            href={route("seller.account.download-unsold-account", {
              subProductId: subProduct?.id || 0,
            })}
            variant="success"
          >
            {t("Download unsold products")}
          </Button>
        </div>
      </Col>
      <Col lg={12} className="px-4">
        <div>
          <TableWithContextMenu
            columns={columns}
            data={[]}
            divClass="table-responsive table-card mb-3"
            tableClass="table align-middle table-nowrap mb-0"
            theadClass="table-light"
            enableContextMenu={false}
            isPaginateTable={true}
          />
        </div>
      </Col>
    </>
  );
};
export default SellingProduct;
