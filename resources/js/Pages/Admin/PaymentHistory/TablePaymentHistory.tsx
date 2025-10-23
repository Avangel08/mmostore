import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import { usePage } from "@inertiajs/react";

const TablePaymentHistory = ({
  data,
  onReloadTable,
  onEdit,
  onDelete,
  onSelectionChange
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string, name: string) => void;
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
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
      setSelectAll(false);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        header: t("Plan name"),
        accessorKey: "",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const checkoutData = cell?.row?.original?.checkout || {};
          return <span className="text-break text-wrap">{checkoutData?.name ?? ""}</span>
        }
      },
      {
        header: t("User"),
        cell: (cell: any) => {
          const userData = cell?.row?.original?.user || {};
          return <>
            <span className="text-break text-wrap">{userData?.name ?? ""}</span>
            <br />
            <span className="text-muted text-break text-wrap">{userData?.email ?? ""}</span>
          </>;
        },
        accessorKey: "",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Payment method"),
        cell: (cell: any) => {
          const paymentMethodData = cell?.row?.original?.payment_method || {};
          return <span className="text-break text-wrap">{paymentMethodData?.name ?? ""}</span>;
        },
        accessorKey: "",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Plan type"),
        cell: (cell: any) => {
          const checkoutData = cell?.row?.original?.checkout || {};
          const label = {
            0: "Default",
            1: "Normal",
          } as any;
          return <span className="text-break text-wrap">{label[checkoutData?.type] ?? ""}</span>;
        },
        accessorKey: "",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Transaction ID"),
        accessorKey: "transaction_id",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Plan price"),
        cell: (cell: any) => {
          const checkoutData = cell?.row?.original?.checkout || {};
          return <span className="text-break text-wrap">{checkoutData?.amount_vnd ?? 0}</span>;
        },
        accessorKey: "",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Amount paid"),
        accessorKey: "amount_vnd",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const amountPaid = parseFloat(cell.getValue() || 0);
          const planPrice = parseFloat(cell?.row?.original?.checkout?.amount_vnd || 0);
          return <span className={`fw-bold text-break text-wrap ${amountPaid < planPrice ? "text-warning" : ""}`}>{amountPaid}</span>;
        }
      },
      {
        header: t("Expiration date"),
        cell: (cell: any) => {
          const chargeData = cell?.row?.original?.charge || {};
          return <span className="text-break text-wrap">{!!chargeData?.expires_on && moment(chargeData?.expires_on).format("DD/MM/YYYY HH:mm")}</span>;
        },
        accessorKey: "expires_on",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Note"),
        accessorKey: "note",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (<span className="text-break text-wrap">{cell.getValue()}</span>);
        }
      },
      {
        header: t("System note"),
        accessorKey: "system_note",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (<span className="text-break text-wrap">{cell.getValue()}</span>);
        }
      },
      {
        header: t("Status"),
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const status = cell.getValue();
          const statusLabel = {
            0: "Pending",
            1: "Completed",
            2: "Rejected",
          } as any;
          const className = {
            0: "bg-info",
            1: "bg-success",
            2: "bg-danger",
          } as any;

          return (
            <span className={`badge ${className?.[status] || "bg-dark"} fs-6 fw-medium`}>
              {t(statusLabel?.[status] || "Unknown")}
            </span>
          );
        },
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
    ],
    [t, selectedItems, selectAll, handleSelectAll, handleItemSelect, onEdit, onDelete]
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
        divStyle={{ height: "60vh" }}
      />
    </div>
  );
};
export default TablePaymentHistory;
