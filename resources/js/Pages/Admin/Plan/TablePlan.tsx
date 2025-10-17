import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Form, Button, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import DOMPurify from 'dompurify';

const TablePlan = ({
  data,
  onReloadTable,
  onEdit,
  onDuplicatePlan
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
  onEdit?: (id: number | string) => void;
  onDuplicatePlan?: (id: number | string, name: string, type: string) => void;
}) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        header: t("Plan name"),
        cell: (cell: any) => {
          return <span className="fw-semibold text-break text-wrap">{cell.getValue() ?? ""}</span>;
        },
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Type"),
        cell: (cell: any) => {
          const type = cell.getValue() ?? "";
          const typeLabel = {
            0: "Default",
            1: "Normal",
          } as any;
          return <span>{typeLabel?.[type] ?? ""}</span>;
        },
        accessorKey: "type",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Price"),
        accessorKey: "price",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (
            <NumericFormat
              value={cell.getValue() ?? 0}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={false}
            />
          );
        },
      },
      {
        header: t("Time"),
        cell: (cell: any) => {
          return <span>{cell.getValue() ?? ""} {t("days")}</span>;
        },
        accessorKey: "interval",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Best choice"),
        cell: (cell: any) => {
          const value = cell.getValue() ?? 0;
          const className = {
            1: "ri-checkbox-circle-fill text-success",
            0: "ri-close-circle-fill text-danger"
          } as any;
          return <i className={className?.[value]} style={{ fontSize: '1.5em' }}></i>;
        },
        accessorKey: "best_choice",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Public"),
        cell: (cell: any) => {
          const value = cell.getValue() ?? 0;
          const className = {
            1: "ri-checkbox-circle-fill text-success",
            0: "ri-close-circle-fill text-danger"
          } as any;
          return <i className={className?.[value]} style={{ fontSize: '1.5em' }}></i>;
        },
        accessorKey: "show_public",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Description"),
        cell: (cell: any) => {
          const html = cell.getValue() ?? "";
          const safe = DOMPurify.sanitize(html);
          return <span dangerouslySetInnerHTML={{ __html: safe }} />;
        },
        accessorKey: "description",
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
          const status = cell.getValue() ?? "Unknown";
          const className = {
            1: "bg-success",
            0: "bg-danger",
          } as any;
          const statusLabel = status ? "Active" : "Inactive";

          return (
            <span className={`badge ${className?.[status] ?? "bg-dark"} fs-6 fw-medium`}>
              {t(statusLabel)}
            </span>
          );
        },
      },
      {
        header: t("Action"),
        cell: (cell: any) => {
          const id = cell?.row?.original?.id;
          const name = cell?.row?.original?.name ?? "";
          const type = cell?.row?.original?.type;
          if (!id) return null;
          return (
            <Dropdown >
              <Dropdown.Toggle
                href="#"
                className="btn btn-soft-secondary btn-sm dropdown arrow-none"
                as="button"
              >
                <i className="ri-more-fill align-middle"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end">
                <Dropdown.Item as="button" onClick={() => onEdit?.(id)}>
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> <span>{t("Edit")}</span>
                </Dropdown.Item>

                <Dropdown.Item as="button" onClick={() => onDuplicatePlan?.(id, name, type)}>
                  <i className="ri-stack-fill align-bottom me-2 text-muted"></i> <span>{t("Duplicate")}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [t, onEdit]
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
        divStyle={{ height: "50vh" }}
      />
    </div>
  );
};
export default TablePlan;
