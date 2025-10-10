import React, { Fragment, useEffect } from "react";
import { Button, Table } from "react-bootstrap";

import {
    Column,
    Table as ReactTable,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender
} from '@tanstack/react-table';
import { useTranslation } from "react-i18next";


interface TableContainerProps {
    columns?: any;
    data?: any;
    handleTaskClick?: any;
    customPageSize?: any;
    borderClass?: any;
    tableClass?: any;
    theadClass?: any;
    trClass?: any;
    thClass?: any;
    divClass?: any;
    handleLeadClick?: any;
    handleCompanyClick?: any;
    handleContactClick?: any;
    handleTicketClick?: any;
    onRowContextMenu?: (event: React.MouseEvent, rowData: any) => void;
}

const TableContainer = ({
    columns,
    data,
    customPageSize,
    borderClass,
    tableClass,
    theadClass,
    trClass,
    thClass,
    divClass,
    onRowContextMenu
}: TableContainerProps) => {
    const { t } = useTranslation();


    const table = useReactTable({
        columns,
        data: data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const {
        getHeaderGroups,
        getRowModel,
        getCanPreviousPage,
        getCanNextPage,
        getPageOptions,
        setPageIndex,
        nextPage,
        previousPage,
        setPageSize,
        getState
    } = table;

    useEffect(() => {
        Number(customPageSize) && setPageSize(Number(customPageSize));
    }, [customPageSize, setPageSize]);

    const handleRowContextMenu = (event: React.MouseEvent, rowData: any) => {
        if (onRowContextMenu) {
            onRowContextMenu(event, rowData);
        }
    };

    return (
        <Fragment>


            <div className={divClass}>
                <Table hover className={tableClass} bordered={borderClass}>
                    <thead className={theadClass}>
                        {getHeaderGroups().map((headerGroup: any) => (
                            <tr className={trClass} key={headerGroup.id}>
                                {headerGroup.headers.map((header: any) => (
                                    <th key={header.id} className={thClass}  {...{
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}>
                                        {header.isPlaceholder ? null : (
                                            <React.Fragment>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' ',
                                                    desc: ' ',
                                                }
                                                [header.column.getIsSorted() as string] ?? null}
                                            </React.Fragment>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {getRowModel().rows.map((row: any) => {
                            return (
                                <tr
                                    key={row.id}
                                    onContextMenu={(e) => handleRowContextMenu(e, row.original)}
                                    style={{ cursor: onRowContextMenu ? 'context-menu' : 'default' }}
                                >
                                    {row.getVisibleCells().map((cell: any) => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            {/* <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
                <div className="col-sm">
                    <div className="text-muted">{t("Showing")}<span className="fw-semibold ms-1">{getRowModel().rows.length}</span> {t("on")} <span className="fw-semibold">{data.length}</span> {t("results")}
                    </div>
                </div>
                <div className="col-sm-auto">
                    <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                        <li className={!getCanPreviousPage() ? "page-item disabled" : "page-item"}>
                            <Button className="page-link" onClick={previousPage} variant="link">&lt;</Button>
                        </li>
                        {getPageOptions().map((item: any, key: number) => (
                            <React.Fragment key={key}>
                                <li className="page-item">
                                    <Button variant="link" className={getState().pagination.pageIndex === item ? "page-link active" : "page-link"} onClick={() => setPageIndex(item)}>{item + 1}</Button>
                                </li>
                            </React.Fragment>
                        ))}
                        <li className={!getCanNextPage() ? "page-item disabled" : "page-item"}>
                            <Button variant="link" className="page-link" onClick={nextPage}>&gt;</Button>
                        </li>
                    </ul>
                </div>
            </Row> */}
        </Fragment>
    );
};

export default TableContainer;