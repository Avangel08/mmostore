import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import moment from "moment";
import { usePage } from "@inertiajs/react";
import { Form } from "react-bootstrap";

const TableProduct = ({
  data,
  onReloadTable,
  onEdit,
  onManageStock,
  onDelete,
  onSelectionChange,
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
  onEdit?: (id: number | string) => void;
  onManageStock?: (id: number | string) => void;
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
      .addCustomOption(
        "permissions",
        t("Manage Stock"),
        "ri-archive-2-fill",
        "",
        () => {
          onManageStock && onManageStock(rowData?.id);
        }
      )
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

  const handleItemSelect = useCallback(
    (id: string | number, checked: boolean) => {
      if (checked) {
        setSelectedItems((prev) => [...prev, id]);
      } else {
        setSelectedItems((prev) => prev.filter((item) => item !== id));
        setSelectAll(false);
      }
    },
    []
  );

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
              className="categoryCheckbox form-check-input"
              checked={isChecked}
              onChange={(e) => handleItemSelect(rowData.id, e.target.checked)}
            />
          );
        },
        id: "#",
      },
      {
        header: t("Product name"),
        cell: (cell: any) => {
          return <span className="fw-semibold">{cell.getValue()}</span>;
        },
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Category"),
        accessorKey: "categories",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return <span>{cell.getValue()?.name || "-"}</span>;
        }
      },
      {
        header: t("Stock"),
        accessorKey: "stock",
        enableColumnFilter: false,
        enableSorting: true,
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
      {
        header: t("Status"),
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const statusLabel = statusConst?.[cell.getValue()] || "Unknown";
          const className = {
            Active: "bg-success",
            Inactive: "bg-danger",
            Unknown: "bg-dark",
          } as any;

          return (
            <span
              className={`badge ${
                className?.[statusLabel] || "bg-dark"
              } fs-6 fw-medium`}
            >
              {t(statusLabel)}
            </span>
          );
        },
      },
    ],
    [
      t,
      selectedItems,
      selectAll,
      handleSelectAll,
      handleItemSelect,
      statusConst,
    ]
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
      />
    </div>
  );
};
export default TableProduct;
