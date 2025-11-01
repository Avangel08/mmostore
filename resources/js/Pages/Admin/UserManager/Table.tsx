import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { router, usePage } from "@inertiajs/react";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import moment from "moment";
import { useQueryParams } from "../../../hooks/useQueryParam";
// Using global route() helper injected by Ziggy/Inertia

const Table = ({ data, onReloadTable, onEdit, onSelectionChange, onAddPlan }: {
    data: any;
    onReloadTable?: (page: number, perPage: number) => void;
    onEdit?: (id: number | string) => void;
    onSelectionChange?: (selectedItems: (string | number)[]) => void;
    onAddPlan?: (userData: any) => void;
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

    const adminAddPlanSeller = (rowData: any) => {
        onAddPlan && onAddPlan(rowData);
    }

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
                header: t("Plan"),
                accessorKey: "",
                enableColumnFilter: false,
                cell: (cell: any) => {
                    const currentPlan = cell.row.original?.current_plan;
                    
                    if (!currentPlan) {
                        return <span className="text-muted"></span>;
                    }

                    const expiresOn = moment(currentPlan.expires_on);
                    const isExpired = expiresOn.isBefore(moment());
                    const expirationColor = isExpired ? "text-danger" : "text-success";

                    return (
                        <div className="d-flex flex-column gap-0">
                            <div className="fw-semibold">{currentPlan.name}</div>
                            <div className={`small ${expirationColor}`}>
                                {t("Expires")}: {expiresOn.format("DD/MM/YYYY HH:mm")}
                            </div>
                        </div>
                    );
                }
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
                        1: t("ACTIVE"),
                        0: t("INACTIVE"),
                        2: t("BLOCK"),
                    };

                    return (<span style={{ width: "120px" }} className={`badge border ${classColor[cell.getValue()] || "border-dark text-body"} fs-6 me-2`}>{text[cell.getValue()] || "BLOCK"}</span>)
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
                header: t("Actions"),
                enableColumnFilter: false,
                cell: (cell: any) => {
                    const row = cell.row.original;
                    const id = row?.id;

                    return <div className="d-flex gap-2">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{t("Login")}</Tooltip>}
                        >
                            <Button
                                size="sm"
                                variant="outline-info"
                                onClick={() => {
                                    const url = route("admin.user.login-as", { id });
                                    window.open(url, "_blank");
                                }}><i className="ri-login-box-line"></i>
                            </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{t("Add plan")}</Tooltip>}
                        >
                            <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => adminAddPlanSeller(id)}>
                                <i className="ri-wallet-line"></i>
                            </Button>
                        </OverlayTrigger>
                    </div>
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
