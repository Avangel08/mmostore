import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ContextMenuBuilder } from "../../../Components/Common/ContextMenu";
import moment from "moment";
import { usePage } from "@inertiajs/react";
import CONSTANTS from "../../../utils/constants";

const Table = ({
  data,
  onReloadTable,
  onSelectionChange
}: {
  data: any;
  onReloadTable?: (page: number, perPage: number, filters?: any) => void;
  onSelectionChange?: (selectedItems: (string | number)[]) => void;
}) => {
  const { t } = useTranslation();
  const { statusConst } = usePage().props as any;
  const [ selectedItems, setSelectedItems ] = useState<(string | number)[]>([]);
  const [ selectAll, setSelectAll ] = useState(false);

  useEffect(() => {
    onSelectionChange && onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);

  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [data]);

  const contextMenuOptions = (rowData: any) => {
    return new ContextMenuBuilder()
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { class: "bg-warning", text: t("Pending") },
      PROCESSING: { class: "bg-info", text: t("Processing") },
      COMPLETED: { class: "bg-success", text: t("Completed") },
      CANCELLED: { class: "bg-danger", text: t("Cancelled") },
      FAILED: { class: "bg-danger", text: t("Failed") }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`badge ${config.class} text-white`}>
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { class: "bg-warning", text: t("Pending") },
      PAID: { class: "bg-success", text: t("Paid") },
      FAILED: { class: "bg-danger", text: t("Failed") },
      REFUNDED: { class: "bg-warning", text: t("Refunded") }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`badge ${config.class} text-white`}>
        {config.text}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        header: t("Order Number"),
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
        accessorKey: "order_number",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Customer"),
        cell: (cell: any) => {
          const customer = cell.row.original.customer;
          return (
            <div>
              <span>{customer?.name || 'N/A'}</span>
              <br />
              <small className="text-secondary">{customer?.email || 'N/A'}</small>
            </div>
          );
        },
        accessorKey: "customer_id",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Product Name"),
        cell: (cell: any) => {
          const product = cell.row.original.product;
          return (
            <div>
              <span>{product?.name || 'N/A'}</span>
              <br />
            </div>
          );
        },
        accessorKey: "product_id",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Sub Product"),
        cell: (cell: any) => {
          const subProduct = cell.row.original.sub_product;
          return (
            <div>
              <div className="fw-medium">{subProduct?.name || 'N/A'}</div>
              {subProduct?.description && (
                <small className="text-secondary d-block">{subProduct.description}</small>
              )}
            </div>
          );
        },
        accessorKey: "sub_product_id",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Category"),
        cell: (cell: any) => {
          const category = cell.row.original.category;
          return (
            <div>
              <span>{category?.name || 'N/A'}</span>
              <br />
            </div>
          );
        },
        accessorKey: "category_id",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Quantity"),
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
        accessorKey: "quantity",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Unit Price"),
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
        accessorKey: "unit_price",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Total Price"),
        cell: (cell: any) => {
          return <span>{cell.getValue()}</span>;
        },
        accessorKey: "total_price",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Status"),
        cell: (cell: any) => {
          return getStatusBadge(cell.getValue());
        },
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Payment Status"),
        cell: (cell: any) => {
          return getPaymentStatusBadge(cell.getValue());
        },
        accessorKey: "payment_status",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: t("Created at"),
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
export default Table;

