import React, { useMemo } from "react";
import TableContainer from "./TableContainer";
import { Container } from "react-bootstrap";

import vn from "../../../../../../images/flags/vn.svg"
import us from "../../../../../../images/flags/us.svg"
import { ColumnDef } from "@tanstack/react-table";

type product = {
    id: number;
    name: string;
    usePop3: boolean;
    live: string;
    country: string;
    price: string;
    quantity: string;
}

const Table = () => {
    const defaultTable = [
        { id: "10", name: "HotMail NEW", usePop3: true, live: "1-3 giờ", country: "vn", price: "50đ", quantity: 300 },
        { id: "09", name: "OutLook NEW", usePop3: true, live: "1-3 giờ", country: "vn", price: "50đ", quantity: 200 },
        { id: "08", name: "OutLook DOMAIN NEW", usePop3: true, live: "1-3 giờ", country: "vn", price: "50đ", quantity: 10 },
        { id: "07", name: "Hotmail TRUSTED [IMAP/POP3]", usePop3: true, live: "1-3 giờ", country: "vn", price: "50đ", quantity: 500 },
        { id: "06", name: "Outlook TRUSTED [IMAP/POP3]", usePop3: true, live: "1-3 giờ", country: "us", price: "50đ", quantity: 300 },
        { id: "05", name: "Hotmail TRUSTED 2 [GRAPH API]", usePop3: true, live: "6-12 Tháng", country: "vn", price: "650đ", quantity: 300 },
        { id: "04", name: "Outlook TRUSTED 2 [GRAPH API]", usePop3: true, live: "6-12 Tháng", country: "vn", price: "650đ", quantity: 300 },
        { id: "03", name: "Shannon", usePop3: true, live: "6-12 Tháng", country: "vn", price: "650đ", quantity: 300 },
        { id: "02", name: "Harold", usePop3: true, live: "12-36 Tháng", country: "vn", price: "650đ", quantity: 300 },
        { id: "01", name: "Jonathan", usePop3: true, live: "12-36 Tháng", country: "vn", price: "650đ", quantity: 300 }
    ];

    const columns: ColumnDef<product>[] = useMemo(
        () => [
            {
                header: "ID",
                cell: (cell: any) => {
                    return (
                        <span className="fw-semibold">{cell.getValue()}</span>
                    );
                },
                accessorKey: "id",
                enableColumnFilter: false,
            },

            {
                header: "Mail chuyên để very Facebook",
                accessorKey: "name",
                enableColumnFilter: false,
            },
            {
                header: "POP3",
                accessorKey: "usePop3",
                enableColumnFilter: false,
                enableSorting: false,
                cell: ({ row }) => {
                    const usePop3 = row.original.usePop3;
                    return (
                        <span>{usePop3 ? "Đã bật" : "Đã tắt"}</span>
                    )
                }
            },
            {
                header: "Live",
                accessorKey: "live",
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Quốc gia",
                accessorKey: "country",
                enableColumnFilter: false,
                enableSorting: false,
                cell: ({ row }) => {
                    const country = row.original.country;
                    return (
                        <div className="image-flag">
                            {
                                country === 'vn' ? <img src={vn} alt="" /> : <img src={us} alt="" />
                            }
                        </div>
                    )
                }
            },
            {
                header: "Giá",
                accessorKey: "price",
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Số lượng",
                accessorKey: "quantity",
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Action",
                accessorKey: null,
                enableColumnFilter: false,
                enableSorting: false,
                cell: () => {
                    return (
                        <button type="button" className="btn btn-sm btn-success">Mua</button>
                    )
                }
            }
        ],
        []
    );

    return (
        <React.Fragment>
            <Container fluid className="custom-container">
                <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-4 page-title">
                    <h4 className="mb-sm-0 text-white">Bảng giá dịch vụ</h4>
                </div>
                <TableContainer
                    columns={(columns || [])}
                    data={(defaultTable || [])}
                    // customPageSize={5}
                    SearchPlaceholder='Search...'
                    tableClass={"custom-table"}
                />
            </Container>
        </React.Fragment>
    );
}

export { Table };