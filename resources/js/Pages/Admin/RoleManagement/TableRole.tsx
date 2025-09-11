import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { router, usePage } from "@inertiajs/react";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";

const TableRole = ({
  data,
  onReloadTable,
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number) => void;
}) => {
  const { t } = useTranslation();
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") ?? "1";
  const perPage = params.get("perPage") ?? "10";

  const contextMenuOptions = (rowData: any) => {
    const isSystemRole =
      rowData.name === "admin" || rowData.name === "super-admin";
    const canDelete = !isSystemRole; // Don't allow deletion of system roles

    return new ContextMenuBuilder()
      .addCustomOption(
        "permissions",
        t("Edit"),
        "ri-edit-2-fill",
        "",
        () => {
          
        }
      )
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
      },
      {
        header: t("Permissions"),
        accessorKey: "",
        enableColumnFilter: false,
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
        isGlobalFilter={true}
        SearchPlaceholder={t("Search...")}
        enableContextMenu={true}
        contextMenuOptions={contextMenuOptions}
        isPaginateTable={true}
        onReloadTable={onReloadTable}
        defaultCurrentPage={Number(page)}
        defaultPageSize={Number(perPage)}
        divStyle={{ height: "50vh" }}
        tableStyle={{
          tableLayout: "fixed",
        }}
      />
    </div>
  );
};
export default TableRole;
