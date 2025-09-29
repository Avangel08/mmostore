import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import TableContainer from "./TableContainer";
import { columnsApi } from "./columns";

function CategoryTable({ category, setShow, setSelectedProduct }: { category: any, setShow: (show: boolean) => void, setSelectedProduct: (product: any) => void; }) {
    // ✅ Generate columns từ API
    // const columns = useMemo<ColumnDef<any>[]>(
    //     () =>
    //         category.columns.map((col: any) => ({
    //             accessorKey: col.key,
    //             header: col.name,
    //             cell: (info: any) => String(info.getValue() ?? ""),
    //         })),
    //     [category]
    // );

    const columns = useMemo(
        () => columnsApi(category.columns, {
            onBuy: (row: any) => {
                setSelectedProduct(row)
                setShow(true)
            }
        }),
        [category.columns]
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