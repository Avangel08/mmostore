import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { formatDate, formatDateTime } from "../../../utils/helpers";
import CONSTANTS from "../../../utils/constants";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const TableCurrencyRate = ({
  data,
  onReloadTable,
  onEdit,
  onDelete
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string, name?: string) => void;
  onSelectionChange?: (selectedItems: (string | number)[]) => void;
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { statusList } = usePage().props as any;

  const contextMenuOptions = (rowData: any) => {
    return new ContextMenuBuilder()
      .addCustomOption("permissions", t("Edit"), "ri-edit-2-fill", "", () => {
        onEdit && onEdit(rowData?.id);
      })
      .addDivider()
      .addDeleteOption(t("Delete"), "ri-delete-bin-fill", () => {
        onDelete && onDelete(rowData?.id, rowData?.name);
      })
      .build();
  };

  const columns = useMemo(
    () => [
      {
        header: t("VND Rate"),
        accessorKey: "to_vnd",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
      },
      {
        header: t("Effective from date"),
        accessorKey: "date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return <span className="fw-semibold">{formatDate(cell.getValue())}</span>;
        },
      },
      {
        header: t("Status"),
        accessorKey: "status",
        cell: (cell: any) => {
          const statusValue = cell.getValue();
          const statusLabel = CONSTANTS?.STATUS?.[statusValue as keyof typeof CONSTANTS.STATUS] || "Unknown";
          const className = {
            Active: "bg-success",
            Inactive: "bg-danger",
            Unknown: "bg-dark",
          } as any;

          return (
            <span className={`badge ${className?.[statusLabel] || "bg-dark"} fs-6 fw-medium`}>
              {t(statusLabel)}
            </span>
          );
        },
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Actions"),
        cell: (cellProps: any) => {
          const rowData: any = cellProps.row.original;
          return (
            <div className="d-flex gap-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Edit")}</Tooltip>}
              >
                <Button
                  size="sm"
                  variant="outline-info"
                  onClick={() => onEdit && onEdit(rowData?.id)}
                >
                  <i className="ri-edit-2-fill"></i>
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Delete")}</Tooltip>}
              >
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete && onDelete(rowData?.id)}
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
    [t, statusList, onEdit, onDelete]
  );

  return (
    <TableWithContextMenu
      columns={columns}
      data={data || []}
      divClass="table-responsive table-card mb-3"
      tableClass="table align-middle table-nowrap mb-0"
      theadClass="table-light"
      SearchPlaceholder={t("Search...")}
      enableContextMenu={true}
      contextMenuOptions={contextMenuOptions}
      isPaginateTable={true}
      onReloadTable={onReloadTable}
    />
  );
};

export default TableCurrencyRate;


