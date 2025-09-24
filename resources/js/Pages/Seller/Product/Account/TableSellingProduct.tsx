import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TableWithContextMenu from "../../../../Components/Common/TableWithContextMenu";

const TableSellingProduct = () => {
  const { t } = useTranslation();

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
        header: t("Sale date"),
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
  );
};
export default TableSellingProduct;
