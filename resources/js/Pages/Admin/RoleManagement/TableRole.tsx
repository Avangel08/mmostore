import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TableContainer from "../../../Components/Common/TableContainerReactTable";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const TableRole = () => {
  const { t } = useTranslation();
  const handleTaskClicks = (task: any) => {};
  const defaultTable = [
    {
      id: "10",
      name: "Tyrone",
      email: "tyrone@example.com",
      designation: "Senior Response Liaison",
      company: "Raynor, Rolfson and Daugherty",
      location: "Qatar",
    },
    {
      id: "09",
      name: "Cathy",
      email: "cathy@example.com",
      designation: "Customer Data Director",
      company: "Ebert, Schamberger and Johnston",
      location: "Mexico",
    },
    {
      id: "08",
      name: "Patsy",
      email: "patsy@example.com",
      designation: "Dynamic Assurance Director",
      company: "Streich Group",
      location: "Niue",
    },
    {
      id: "07",
      name: "Kerry",
      email: "kerry@example.com",
      designation: "Lead Applications Associate",
      company: "Feeney, Langworth and Tremblay",
      location: "Niger",
    },
    {
      id: "06",
      name: "Traci",
      email: "traci@example.com",
      designation: "Corporate Identity Director",
      company: "Koelpin - Goldner",
      location: "Vanuatu",
    },
    {
      id: "05",
      name: "Noel",
      email: "noel@example.com",
      designation: "Customer Data Director",
      company: "Howell - Rippin",
      location: "Germany",
    },
    {
      id: "04",
      name: "Robert",
      email: "robert@example.com",
      designation: "Product Accounts Technician",
      company: "Hoeger",
      location: "San Marino",
    },
    {
      id: "03",
      name: "Shannon",
      email: "shannon@example.com",
      designation: "Legacy Functionality Associate",
      company: "Zemlak Group",
      location: "South Georgia",
    },
    {
      id: "02",
      name: "Harold",
      email: "harold@example.com",
      designation: "Forward Creative Coordinator",
      company: "Metz Inc",
      location: "Iran",
    },
    {
      id: "01",
      name: "Jonathan",
      email: "jonathan@example.com",
      designation: "Senior Implementation Architect",
      company: "Hauck Inc",
      location: "Holy See",
    },
  ];
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
        accessorKey: "email",
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
        data={defaultTable || []}
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
