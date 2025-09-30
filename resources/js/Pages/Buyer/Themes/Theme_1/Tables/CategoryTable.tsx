import { useMemo } from "react";
import TableContainer from "./TableContainer";
import { columnsApi } from "./columns";
import { usePage } from "@inertiajs/react";

function CategoryTable({ category, setShow, setSelectedProduct }: { category: any, setShow: (show: boolean) => void, setSelectedProduct: (product: any) => void; }) {
    const storageUrl = usePage().props.storageUrl as string;

    const columns = useMemo(() => columnsApi(
        category.columns,
        {
            onBuy: (row: any) => {
                setSelectedProduct(row)
                setShow(true)
            }
        },
        storageUrl
    ), [category.columns, storageUrl]
    );

    return (
        <TableContainer
            columns={(columns || [])}
            data={(category.products || [])}
            tableClass={"custom-table"}
        />
    )
}

export default CategoryTable;