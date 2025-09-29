import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import moment from "moment";
import { usePage } from "@inertiajs/react";
import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

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
      {
        header: t("Actions"),
        cell: (cellProps: any) => {
          const rowData = cellProps.row.original;
          return (
            <div className="d-flex gap-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Edit")}</Tooltip>}
              >
                <Button
                  size="sm"
                  variant="outline-info"
                  onClick={() => onEdit && onEdit(rowData?.id)}
                >
                  <i className="ri-edit-2-fill"></i>
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Manage Stock")}</Tooltip>}
              >
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => onManageStock && onManageStock(rowData?.id)}
                >
                  <i className="ri-archive-2-fill"></i>
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("Delete")}</Tooltip>}
              >
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete && onDelete(rowData?.id)}
                >
                  <i className="ri-delete-bin-fill"></i>
                </Button>
              </OverlayTrigger>
            </div>
          );
        },
        id: "actions",
        enableSorting: false,
      },
    ],
    [
      t,
      selectedItems,
      selectAll,
      handleSelectAll,
      handleItemSelect,
      statusConst,
      onEdit,
      onManageStock,
      onDelete,
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
        enableContextMenu={false}
        isPaginateTable={true}
        onReloadTable={onReloadTable}
      />
    </div>
  );
};
export default TableProduct;
