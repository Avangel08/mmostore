import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TableWithContextMenu from "../../../../Components/Common/TableWithContextMenu";

const TableRecentUpload = ({
  data,
  onReloadTable,
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
}) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        header: t("Name"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("File name"),
        accessorKey: "file_name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Upload date"),
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
        header: t("Result"),
        accessorKey: "result",
        enableColumnFilter: false,
        enableSorting: true,
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
    ],
    [t]
  );

  return (
    <div>
      <TableWithContextMenu
        columns={columns}
        data={data || []}
        divClass="table-responsive table-card mb-3"
        tableClass="table align-middle table-nowrap mb-0"
        theadClass="table-light"
        enableContextMenu={false}
        isPaginateTable={true}
        onReloadTable={onReloadTable}
      />
    </div>
  );
};
export default TableRecentUpload;
