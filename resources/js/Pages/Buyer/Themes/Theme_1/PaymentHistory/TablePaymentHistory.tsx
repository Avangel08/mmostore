import { useTranslation } from "react-i18next";
import TableWithContextMenu from "../../../../../Components/Common/TableWithContextMenu";
import { useMemo } from "react";
import moment from "moment";

const TablePaymentHistory = ({
    data,
    onReloadTable
}: {
    data: any;
    onReloadTable: any;
}) => {
    const { t } = useTranslation();

    const columns = useMemo(
        () => [
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
                    const type = cell.row.original.type;
                    const amount = cell.getValue();
                    if ([1].includes(type)) { // deposit and other positive types
                        return (
                            <span className="fw-semibold text-success">
                                +{amount}
                            </span>
                        );
                    } else if ([2,3].includes(type)) { // purchase and deduct_money
                        return (
                            <span className="fw-semibold text-danger">
                                -{amount}
                            </span>
                        );
                    }
                },
                accessorKey: "amount_vnd", 
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: t("Transactions"),
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
                        <span>{moment(cell.getValue()).format("DD/MM/YYYY HH:mm")}</span>
                    );
                },
            },
        ],
        [t]
    );
    return (
        <TableWithContextMenu
            columns={columns}
            data={data || []}
            divClass="table-responsive table-card mb-3"
            tableClass="table align-middle table-nowrap mb-0"
            theadClass="table-light"
            SearchPlaceholder={t("Search...")}
            enableContextMenu={true}
            isPaginateTable={true}
            onReloadTable={onReloadTable}
        />
    )
}

export default TablePaymentHistory; 