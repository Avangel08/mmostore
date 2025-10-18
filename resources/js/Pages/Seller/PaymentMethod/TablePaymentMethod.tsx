import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { usePage } from "@inertiajs/react";

const TablePaymentMethod = ({
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
  const { listType, listStatus } = usePage().props as any;
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
        header: t("Type"),
        cell: (cell: any) => {
          const type = listType?.[cell.getValue()] || "Unknown";
          return (
            <span className="fw-semibold">
              {type}
            </span>
          );
        },
        accessorKey: "type",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Bank Code"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "key",
        enableColumnFilter: false,
        enableSorting: true,
      },
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
        header: t("Status"),
        cell: (cell: any) => {
          const statusLabel = listStatus?.[cell.getValue()] || "Unknown";
          const className = {
            ACTIVE: "bg-success",
            INACTIVE: "bg-danger",
          } as any;

          return (
            <span className={`badge ${className?.[statusLabel] || "bg-dark"} fs-6 fw-medium`}>
              {t(statusLabel)}
            </span>
          );
        },
        accessorKey: "status",
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
                  onClick={() => onDelete && onDelete(rowData?.id, rowData?.name)}
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
    <div>
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
    </div>
  );
};
export default TablePaymentMethod;
