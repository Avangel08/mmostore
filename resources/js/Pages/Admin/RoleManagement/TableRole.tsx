import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { router, usePage } from "@inertiajs/react";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import moment from "moment";
import { useQueryParams } from "../../../hooks/useQueryParam";

const TableRole = ({
  data,
  onReloadTable,
  onEdit,
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number) => void;
  onEdit?: (id: number | string) => void;
}) => {
  const { t } = useTranslation();

  const contextMenuOptions = (rowData: any) => {
    return new ContextMenuBuilder()
      .addCustomOption("permissions", t("Edit"), "ri-edit-2-fill", "", () => {
        onEdit && onEdit(rowData?.id);
      })
      .build();
  };

  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".roleCheckbox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        header: (
          <Form.Check.Input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        cell: (cellProps: any) => {
          return (
            <Form.Check.Input
              type="checkbox"
              className="roleCheckbox form-check-input"
              value={cellProps.getValue()}
              onChange={() => {}}
            />
          );
        },
        id: "#",
      },
      {
        header: "ID",
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "id",
        enableColumnFilter: false,
      },
      {
        header: t("Role name"),
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span className="text-break text-wrap">{cell.getValue()}</span>;
        }
      },
      {
        header: t("Group permission"),
        accessorKey: "group_permissions",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return cell.getValue().map((group: any, index: number) => {
            const groupName: string = group?.name;
            return (
              <span
                key={group?.id ?? index}
                className={`badge border border-dark text-body fs-6 me-2`}
              >
                {groupName}
              </span>
            );
          });
        },
      },
      {
        header: t("Created date"),
        accessorKey: "created_at",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <span>{moment(cell.getValue()).format("DD/MM/YYYY HH:mm")}</span>
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
        SearchPlaceholder={t("Search...")}
        enableContextMenu={true}
        contextMenuOptions={contextMenuOptions}
        isPaginateTable={true}
        onReloadTable={onReloadTable}
      />
    </div>
  );
};
export default TableRole;
