import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import { usePage } from "@inertiajs/react";
import { formatDateTime } from "../../../utils/helpers";

const TableCategory = ({
  data,
  onReloadTable,
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
}) => {
  const { t } = useTranslation();
  const { statusConst } = usePage().props as any;

  const columns = useMemo(
    () => [
      {
        header: t("Customer"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "customer.name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Gate Way"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "gate_way",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Payment Method"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "payment_method.name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Amount"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "amount_vnd",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Transaction"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "transaction",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Date at"),
        accessorKey: "date_at",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (
            <span>{formatDateTime(cell.getValue())}</span>
          );
        },
      },
    ],
    [t, statusConst]
  );

  return (
    <div>
      <TableWithContextMenu
        columns={columns}
        data={data || []}
        divClass="table-responsive table-card mb-3"
        tableClass="table align-middle table-nowrap mb-0"
        theadClass="table-light"
        SearchPlaceholder={t("Search...")}
        enableContextMenu={false}
        isPaginateTable={true}
        onReloadTable={onReloadTable}
      />
    </div>
  );
};
export default TableCategory;
