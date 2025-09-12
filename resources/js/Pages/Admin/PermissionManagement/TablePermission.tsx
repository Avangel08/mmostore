import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import moment from "moment";

const TablePermission = ({
  data,
  onReloadTable,
  onEdit
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number) => void;
  onEdit: (id: number) => void;
}) => {
  const { t } = useTranslation();
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") ?? "1";
  const perPage = params.get("perPage") ?? "10";

  const contextMenuOptions = (rowData: any) => {
    return new ContextMenuBuilder()
      .addCustomOption("permissions", t("Edit"), "ri-edit-2-fill", "", () => {
        onEdit(rowData?.id);
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
        header: t("Group permission name"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: t("Role"),
        accessorKey: "roles",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return cell.getValue().map((role: any, index: number) => (
            <span key={role?.id ?? index} className="badge bg-dark-subtle text-body fs-6 me-2">
              {role?.name ?? ""}
            </span>
          ));
        },
      },
      {
        header: "Key",
        accessorKey: "key",
        enableColumnFilter: false,
      },
      {
        header: t("List permission"),
        accessorKey: "permissions",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const classColor: Record<string, string> = {
            view: "border-info text-info",
            create: "border-success text-success",
            update: "border-warning text-warning",
            delete: "border-danger text-danger",
          };
          return cell.getValue().map((permission: any, index: number) => {
            const permissionName: string = permission?.name?.split("_").slice(1).join("_") ?? "";
            return (
              <span key={permission?.id ?? index} className={`badge border ${classColor[permissionName] || "border-dark text-body"} fs-6 me-2`}>
                {permissionName}
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
        enableContextMenu={true}
        contextMenuOptions={contextMenuOptions}
        isPaginateTable={true}
        onReloadTable={onReloadTable}
        defaultCurrentPage={Number(page)}
        defaultPageSize={Number(perPage)}
        divStyle={{ height: "50vh" }}
      />
    </div>
  );
};
export default TablePermission;
