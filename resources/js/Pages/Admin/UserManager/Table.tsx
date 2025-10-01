import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { router, usePage } from "@inertiajs/react";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import moment from "moment";
import { useQueryParams } from "../../../hooks/useQueryParam";
// Using global route() helper injected by Ziggy/Inertia

const Table = ({ data, onReloadTable, onEdit, onSelectionChange }: {
    data: any;
    onReloadTable?: (page: number, perPage: number) => void;
    onEdit?: (id: number | string) => void;
    onSelectionChange?: (selectedItems: (string | number)[]) => void;
}) => {
    const { t } = useTranslation();
    const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        onSelectionChange && onSelectionChange(selectedItems);
    }, [selectedItems, onSelectionChange]);

    useEffect(() => {
        setSelectedItems([]);
        setSelectAll(false);
    }, [data]);

    const contextMenuOptions = (rowData: any) => {
        return new ContextMenuBuilder()
            .addCustomOption("edit", t("Edit"), "ri-edit-2-fill", "", () => {
                onEdit && onEdit(rowData?.id);
            })
            .addCustomOption("delete", t("Delete"), "ri-delete-bin-5-line", "", () => {
                onEdit && onEdit(rowData?.id);
            })
            .build();
    };

    const handleSelectAll = useCallback(() => {
        if (!selectAll) {
            const allIds = data?.data?.map((item: any) => item.id) || [];
            setSelectedItems(allIds);
        } else {
            setSelectedItems([]);
        }
        setSelectAll(!selectAll);
    }, [selectAll, data]);

    const handleItemSelect = useCallback((id: string | number, checked: boolean) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, id]);
        } else {
            setSelectedItems((prev) => prev.filter((item) => item !== id));
            setSelectAll(false);
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
                        checked={selectAll}
                        onChange={handleSelectAll}
                    />
                ),
                cell: (cellProps: any) => {
                    const rowData = cellProps.row.original;
                    const isChecked = selectedItems.includes(rowData.id);
                    return (
                        <Form.Check.Input
                            type="checkbox"
                            className="roleCheckbox form-check-input"
                            checked={isChecked}
                            onChange={(e) => handleItemSelect(rowData.id, e.target.checked)}
                        />
                    );
                },
                id: "#",
            },
            {
                header: t("Name"),
                accessorKey: "name",
                enableColumnFilter: false,
            },
            {
                header: t("Email"),
                accessorKey: "email",
                enableColumnFilter: false,
            },
            {
                header: t("Type"),
                accessorKey: "type",
                enableColumnFilter: false,
            },
            {
                header: t("Status"),
                accessorKey: "status",
                enableColumnFilter: false,
                cell: (cell: any) => {
                    const classColor: Record<string, string> = {
                        0: "border-warning text-warning",
                        1: "border-success text-success",
                        2: "border-danger text-danger",
                    };

                    const text: Record<string, string> = {
                        1: "ACTIVE",
                        0: "INACTIVE",
                        2: "BLOCK",
                    };

                    return (<span style={{ width: "100px" }} className={`badge border ${classColor[cell.getValue()] || "border-dark text-body"} fs-6 me-2`}>{text[cell.getValue()] || "Block"}</span>)
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
            {
                header: t("Action"),
                enableColumnFilter: false,
                cell: (cell: any) => {
                    const row = cell.row.original;
                    return (
                        <Button
                            variant="link"
                            onClick={() => {
                                const url = route("admin.user.login-as", { id: row.id });
                                window.open(url, "_blank");
                            }}
                        >
                            {t("Login as")} <i className="ri-login-box-line"></i>
                        </Button>
                    );
                },
            },
        ],
        [t, selectAll, selectedItems, handleSelectAll, handleItemSelect]
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
export default Table;
