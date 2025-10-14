import { useMemo } from "react";
import TableContainer from "./TableContainer";
import { columnsApi } from "./columns";
import { usePage } from "@inertiajs/react";

function CategoryTable({ category, setShow, setSelectedProduct, setOpenLogin }: {
    category: any,
    setShow: (show: boolean) => void,
    setSelectedProduct: (product: any) => void;
    setOpenLogin: (open: boolean) => void;
}) {
    const storageUrl = usePage().props.storageUrl as string;
    const { user } = usePage().props.auth as any;

    const columns = useMemo(() => columnsApi(
        category.columns,
        {
            onBuy: (row: any) => {
                if (!user) {
                    setOpenLogin(true);
                } else {
                    setSelectedProduct(row)
                    setShow(true)
                }
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