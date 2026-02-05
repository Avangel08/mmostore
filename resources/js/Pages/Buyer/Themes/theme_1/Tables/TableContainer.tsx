import React, { Fragment, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
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
        setPageSize,
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
                                    <th key={header.id} className={`${thClass ?? ""} ${header.column.columnDef.meta?.headerClass ?? ""}`.trim()}  {...{
                                        onClick: header.column.getToggleSortingHandler(),
                                        style: {
                                            width: header.column.getSize(),
                                            // minWidth: header.column.columnDef.minSize,
                                            // maxWidth: header.column.columnDef.maxSize,
                                        }
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
                                            <td key={cell.id}
                                                className={cell.column.columnDef.meta?.cellClass ?? ""}
                                                style={{
                                                    width: cell.column.getSize()
                                                }}
                                            >
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
        </Fragment>
    );
};

export default TableContainer;