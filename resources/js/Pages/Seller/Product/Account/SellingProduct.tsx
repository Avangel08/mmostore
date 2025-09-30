import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TableWithContextMenu from "../../../../Components/Common/TableWithContextMenu";
import { Button, Col } from "react-bootstrap";
import { confirmDelete } from "../../../../utils/sweetAlert";
import { usePage, router } from "@inertiajs/react";
import { showToast } from "../../../../utils/showToast";
import SellerAccountFilter from "./SellerAccountFilter";

const SellingProduct = () => {
  const { t } = useTranslation();
  const { subProduct, accounts } = usePage().props as any;

  const fetchData = useCallback(
    (accountPage: number = 1, accountPerPage: number = 10, filters?: any) => {
      router.reload({
        only: ["accounts"],
        replace: true,
        data: {
          accountPage,
          accountPerPage,
          ...filters,
        },
      });
    },
    []
  );

  const handleFilter = (accountPage: number, accountPerPage: number, filters: any) => {
    fetchData(accountPage, accountPerPage, filters);
  };

  const columns = useMemo(
    () => [
      {
        header: t("Product"),
        cell: (cell: any) => {
          const data = cell.row.original;
          return <span>{`${data?.key}|${data?.data}`}</span>;
        },
        accessorKey: "",
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
            LIVE: "bg-success",
            BAN: "bg-danger",
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
        header: t("Order ID"),
        accessorKey: "order_id",
        enableColumnFilter: false,
        enableSorting: true,
      },
    ],
    [t]
  );

  const onDeleteAll = async () => {
    const confirmed = await confirmDelete({
      title: t("Delete all unsold products?"),
      text: t("Unsold products will be deleted after all uploaded files have been processed"),
      confirmButtonText: t("Delete"),
      cancelButtonText: t("Cancel"),
    });
    if (!confirmed) {
      return;
    }

    router.delete(
      route("seller.account.destroy", { id: subProduct?.id ?? 0 }),
      {
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
        onError: (errors: any) => {
          Object.keys(errors).forEach((key) => {
            showToast(t(errors?.[key]), "error");
          });
        },
      }
    );
  };

  return (
    <>
      <Col lg={12} className="px-4">
        <SellerAccountFilter onFilter={handleFilter} />
      </Col>
      <Col lg={12} className="d-flex justify-content-between mb-4">
        <h5>{t("Product list")} ({subProduct?.quantity ?? 0} {t("products")})</h5>
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={onDeleteAll}>
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
      <Col lg={12} className="">
        <div>
          <TableWithContextMenu
            columns={columns}
            data={accounts || []}
            divClass="table-responsive table-card mb-3"
            tableClass="table align-middle table-nowrap mb-0"
            theadClass="table-light"
            enableContextMenu={false}
            isPaginateTable={true}
            isCursorPaginateTable={true}
            keyPageParam="accountPage"
            keyPerPageParam="accountPerPage"
            onReloadTable={fetchData}
            showPaginationEllipsis={true}
            maxVisiblePages={7}
            perPageEntries={[100, 200, 500, 1000]}
          />
        </div>
      </Col>
    </>
  );
};
export default SellingProduct;
