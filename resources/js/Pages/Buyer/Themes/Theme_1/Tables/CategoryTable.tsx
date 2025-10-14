import { useMemo } from "react";
import TableContainer from "./TableContainer";
import { columnsApi } from "./columns";
import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

function CategoryTable({ category, setShow, setSelectedProduct, setOpenLogin }: {
    category: any,
    setShow: (show: boolean) => void,
    setSelectedProduct: (product: any) => void;
    setOpenLogin: (open: boolean) => void;
}) {
    const storageUrl = usePage().props.storageUrl as string;
    const { user } = usePage().props.auth as any;
    const { t } = useTranslation();
    const translate = t as (key: string) => string;

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
        storageUrl,
        translate // pass translate function for translations
    ), [category.columns, storageUrl, translate]
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