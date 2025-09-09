import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TableContainer from "../../../Components/Common/TableContainerReactTable";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const TableRole = ({ data }: any) => {
  const { t } = useTranslation();
  const handleTaskClicks = (task: any) => {};

  const columns = useMemo(
    () => [
      {
        header: "#",
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
      {
        header: t("Actions"),
        accessorKey: "company",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div className="hstack gap-2">
              {/* <button
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => null}
              >
                <i className="ri-delete-bin-5-fill align-bottom" />
              </button> */}
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>{t("Edit")}</Tooltip>}
              >
                <Button
                  className="btn btn-sm btn-soft-info edit-list"
                  onClick={() => null}
                >
                  <i className="ri-pencil-fill align-bottom" />
                </Button>
              </OverlayTrigger>
            </div>
          );
        },
      },
    ],
    [t]
  );

  return (
    <div>
      <TableContainer
        columns={columns}
        data={data || []}
        customPageSize={8}
        divClass="table-responsive table-card mb-3"
        tableClass="table align-middle table-nowrap mb-0"
        theadClass="table-light"
        isGlobalFilter={true}
        SearchPlaceholder={t("Search...")}
      />
    </div>
  );
};
export default TableRole;
