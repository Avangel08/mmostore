import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import { usePage } from "@inertiajs/react";
import { formatDateTime } from "../../../utils/helpers";

const TableCategory = ({
  data,
  onReloadTable,
  onEdit,
  onDelete,
  onSelectionChange
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onSelectionChange?: (selectedItems: (string | number)[]) => void;
}) => {
  const { t } = useTranslation();
  const { statusConst } = usePage().props as any;
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
      .addCustomOption("permissions", t("Edit"), "ri-edit-2-fill", "", () => {
        onEdit && onEdit(rowData?.id);
      })
      .addDivider()
      .addDeleteOption(t("Delete"), "ri-delete-bin-fill", () => {
        onDelete && onDelete(rowData?.id);
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
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
      setSelectAll(false);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        header: t("Customer"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "customer.name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Gate Way"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "gate_way",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Payment Method"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "payment_method.name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Amount"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "amount_vnd",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Transaction"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "transaction",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Date at"),
        accessorKey: "date_at",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (
            <span>{formatDateTime(cell.getValue())}</span>
          );
        },
      },
    ],
    [t, selectedItems, selectAll, handleSelectAll, handleItemSelect, statusConst]
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
export default TableCategory;
