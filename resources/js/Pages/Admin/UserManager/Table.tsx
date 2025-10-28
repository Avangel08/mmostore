import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { router, usePage } from "@inertiajs/react";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../../utils/showToast";
import { ModalVerifyStore } from "./VerifyStore/ModalVerifyStore";

const Table = ({ data, onReloadTable, onEdit, onSelectionChange }: {
    data: any;
    onReloadTable?: (page: number, perPage: number) => void;
    onEdit?: (id: number | string) => void;
    onSelectionChange?: (selectedItems: (string | number)[]) => void;
}) => {
    const { t } = useTranslation();
    const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyStoreData, setVerifyStoreData] = useState<any>(null);
    const [storeCategoryOptions, setStoreCategoryOptions] = useState<{ value: string; label: string }[]>([]);

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

    const adminVerifyStore = async (id: string | number) => {
        router.reload({
            only: ["verifyStoreData", "storeCategoryOptions"],
            data: { id },
            replace: true,
            onSuccess: (page: any) => {
                if (!page?.props?.verifyStoreData) {
                    showToast(t("Failed to load user store data"), "error");
                    return;
                }
                setVerifyStoreData(page.props.verifyStoreData);
                setStoreCategoryOptions(page?.props?.storeCategoryOptions || []);
                setShowVerifyModal(true);
            },
            onError: () => {
                showToast(t("Failed to load user store data"), "error");
            }
        });
    }

    const onReloadOptions = () => {
        router.reload({
            only: ["storeCategoryOptions"],
            replace: true,
            onSuccess: (page: any) => {
                setStoreCategoryOptions(page?.props?.storeCategoryOptions || []);
            },
        });
    };

    const handleCloseVerifyModal = () => {
        setShowVerifyModal(false);
        setVerifyStoreData(null);
    };

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
                            overlay={<Tooltip>{t("Verify store")}</Tooltip>}
                        >
                            <Button
                            size="sm"
                                variant="outline-primary"
                                onClick={() => adminVerifyStore(id)}>
                                <i className="ri-check-double-line"></i>
                            </Button>
                        </OverlayTrigger>

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
                    </div>
                },
            },
        ],
        [t, selectAll, selectedItems, handleSelectAll, handleItemSelect, adminVerifyStore]
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
            <ModalVerifyStore
                show={showVerifyModal}
                onHide={handleCloseVerifyModal}
                dataVerifyStore={verifyStoreData}
                storeCategoryOptions={storeCategoryOptions}
                onReloadOptions={onReloadOptions}
            />
        </div>
    );
};
export default Table;
