import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TableWithContextMenu from "../../../../Components/Common/TableWithContextMenu";
import { router, usePage } from "@inertiajs/react";
import { Badge } from "react-bootstrap";

const TableRecentUpload = () => {
  const { t } = useTranslation();
  const { importHistory } = usePage().props as any;

  const fetchData = useCallback(
    (importPage: number = 1, importPerPage: number = 10, filters?: any) => {
      router.reload({
        only: ["importHistory"],
        data: {
          importPage,
          importPerPage,
          ...filters,
        },
      });
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        header: t("File name"),
        accessorKey: "file_path",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return <span>{cell.getValue().split("/").pop()}</span>;
        },
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
        cell: (cell: any) => {
          const result = cell.getValue() || {};
          return (
            <div>
              <Badge bg="secondary">
                {t("Total")}: {result?.total_count || 0}
              </Badge>{" "}
              <Badge bg="success">
                {t("Success")}: {result?.success_count || 0}
              </Badge>{" "}
              <Badge bg="danger">
                {t("Error")}: {result?.error_count || 0}
              </Badge>
            </div>
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
            FINISH: "bg-success",
            RUNNING: "bg-primary",
            ERROR: "bg-danger",
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
        data={importHistory || []}
        divClass="table-responsive table-card mb-3"
        tableClass="table align-middle table-nowrap mb-0"
        theadClass="table-light"
        enableContextMenu={false}
        isPaginateTable={true}
        onReloadTable={fetchData}
        keyPageParam="importPage"
        keyPerPageParam="importPerPage"
      />
    </div>
  );
};
export default TableRecentUpload;
