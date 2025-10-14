import { ColumnDef } from "@tanstack/react-table";

type columns = {
    key: string;
    name: string;
}

type dataType = {
    id: number;
    name: string;
    short_description: string;
    price: number;
    quantity: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    sub_products: any[];
}


export function columnsApi(columns: columns[], actions: {
    onBuy: (row: any) => void
}, storageUrl: string): ColumnDef<dataType>[] {
    return columns.map((col) => {
        switch (col.key) {
            case "id":
                return {
                    accessorKey: col.key,
                    header: col.name,
                    enableColumnFilter: false,
                    enableSorting: false,
                    size: 30,
                    meta: {
                        headerClass: "text-center",
                        cellClass: "text-center",
                    },
                    enableResizing: false,
                    cell: ({ row }: any) => {
                        return (
                            <span className="fw-semibold">{row.index + 1}</span>
                        );
                    },
                };
            case "title":
                return {
                    accessorKey: col.key,
                    header: col.name,
                    size: 700,
                    enableResizing: false,
                    enableColumnFilter: false,
                    enableSorting: false,
                    meta: {
                        headerClass: "text-center",
                    },
                    cell: (cell: any) => {
                        return (
                            <>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar-sm bg-light rounded p-1">
                                            <img
                                                src={`${storageUrl}/${cell.row.original.image}`}
                                                alt=""
                                                className="img-fluid d-block"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fs-14 mb-1 text-body">
                                            {cell.getValue()}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            <span className="fw-medium">
                                                {" "}
                                                {cell.row.original.short_description}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        );
                    },
                }
            case "quantity":
                return {
                    accessorKey: col.key,
                    header: () => (
                        <>
                            <i className="ri-shopping-cart-line me-1"></i>
                            {col.name}
                        </>
                    ),
                    enableColumnFilter: false,
                    enableSorting: false,
                    meta: {
                        headerClass: "text-center",
                        cellClass: "text-center",
                    },
                    cell: (info) => {
                        const total = info.row.original?.sub_products?.
                            reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;
                        return (
                            <div className="d-flex justify-content-center">
                                <span
                                    className="badge badge-warning text-white fs-14 badge-w badge-h d-flex align-items-center justify-content-center"
                                >
                                    {total}
                                </span>
                            </div>
                        );
                    },
                };
            case "action":
                return {
                    accessorKey: null,
                    header: col.name,
                    enableColumnFilter: false,
                    enableSorting: false,
                    meta: {
                        headerClass: "text-center",
                        cellClass: "text-center",
                    },
                    cell: (info) => {
                        return (
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() => actions.onBuy(info.row.original)}
                            >Mua</button>
                        )
                    }
                }
            case "price":
                return {
                    accessorKey: col.key,
                    header: () => (
                        <>
                            <i className="ri-price-tag-3-line me-1"></i>
                            {col.name}
                        </>
                    ),
                    enableColumnFilter: false,
                    enableSorting: false,
                    meta: {
                        headerClass: "text-center",
                        cellClass: "text-center",
                    },
                    cell: (info) => {
                        const value = info.getValue<number>() ?? 0;
                        return (
                            <span className="text-success">
                                {value}
                            </span>
                        );
                    },
                };
            default:
                return {
                    accessorKey: col.key,
                    header: col.name,
                    enableColumnFilter: false,
                    enableSorting: false,
                    cell: (info) => String(info.getValue() ?? ""),
                };
        }
    });
}
