import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { formatDate, formatDateTime } from "../../../utils/helpers";
import CONSTANTS from "../../../utils/constants";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";

const TableCurrencyRate = ({
  data,
  onReloadTable,
  onEdit,
  onDelete
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string, rate?: number | string) => void;
  onSelectionChange?: (selectedItems: (string | number)[]) => void;
}) => {
  const { t } = useTranslation();

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
          return (
            <NumericFormat
              value={Number(cell.getValue() ?? 0) || 0}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              renderText={(value) => <span style={{ fontWeight: 'bold' }}>{value}</span>}
            />
          );
        },
      },
      {
        header: t("Effective from date"),
        accessorKey: "date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return <span>{formatDate(cell.getValue())}</span>;
        },
      },
      {
        header: t("Status"),
        accessorKey: "status",
        cell: (cell: any) => {
          const statusValue = cell.getValue();
          const statusLabel = {
            ACTIVE: t("Active"),
            INACTIVE: t("Inactive"),
          } as any
          const className = {
            ACTIVE: "bg-success",
            INACTIVE: "bg-danger",
          } as any;

          return (
            <span className={`badge ${className?.[statusValue] || "bg-dark"} fs-6 fw-medium`}>
              {t(statusLabel?.[statusValue] || "Unknown")}
            </span>
          );
        },
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
                  onClick={() => onDelete && onDelete(rowData?.id, rowData?.to_vnd)}
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
    [t, onEdit, onDelete]
  );

  return (
    <TableWithContextMenu
      columns={columns}
      data={data || []}
      divClass="table-responsive table-card mb-3"
      tableClass="table align-middle table-nowrap mb-0"
      theadClass="table-light"
      SearchPlaceholder={t("Search...")}
      enableContextMenu={false}
      contextMenuOptions={contextMenuOptions}
      isPaginateTable={true}
      onReloadTable={onReloadTable}
    />
  );
};

export default TableCurrencyRate;


