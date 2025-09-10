import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";

const TableRole = ({ data }: any) => {
  const { t } = useTranslation();
  const handleTaskClicks = (task: any) => {};

  const contextMenuOptions = (rowData: any) => {
    const isSystemRole = rowData.name === 'admin' || rowData.name === 'super-admin';
    const canDelete = !isSystemRole; // Don't allow deletion of system roles

    return new ContextMenuBuilder()
        .addViewOption(t('View Details'), 'ri-eye-fill', () => {
          router.visit(`/admin/roles/${rowData.id}`);
        })
        .addDivider()
        .addEditOption(t('Edit Role'), 'ri-pencil-fill', () => {
          router.visit(`/admin/roles/${rowData.id}/edit`);
        })
        .addCustomOption('permissions', t('Manage Permissions'), 'ri-shield-user-fill', 'text-warning', () => {
          router.visit(`/admin/roles/${rowData.id}/permissions`);
        })
        .addCustomOption('users', t('View Users'), 'ri-user-fill', 'text-info', () => {
          router.visit(`/admin/roles/${rowData.id}/users`);
        })
        .addDivider()
        .addDuplicateOption(t('Duplicate Role'), 'ri-file-copy-fill', () => {
          router.visit(`/admin/roles/create?duplicate=${rowData.id}`);
        })
        .addExportOption(t('Export Role'), 'ri-download-fill', () => {
          const dataStr = JSON.stringify(rowData, null, 2);
          const dataBlob = new Blob([dataStr], {type: 'application/json'});
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `role-${rowData.name}-${Date.now()}.json`;
          link.click();
          URL.revokeObjectURL(url);
        })
        .addDivider()
        .addDeleteOption(t('Delete Role'), 'ri-delete-bin-fill', () => {
          if (canDelete) {
            if (window.confirm(t('Are you sure you want to delete this role? This action cannot be undone.'))) {
              router.delete(`/admin/roles/${rowData.id}`);
            }
          }
        }, !canDelete)
        .build();
  };

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
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
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
      <TableWithContextMenu
        columns={columns}
        data={data || []}
        customPageSize={8}
        divClass="table-responsive table-card mb-3"
        tableClass="table align-middle table-nowrap mb-0"
        theadClass="table-light"
        isGlobalFilter={true}
        SearchPlaceholder={t("Search...")}
        enableContextMenu={true}
        contextMenuOptions={contextMenuOptions}
      />
    </div>
  );
};
export default TableRole;
