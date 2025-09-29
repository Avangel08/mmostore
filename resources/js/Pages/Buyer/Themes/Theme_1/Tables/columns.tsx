import React from "react";
import { ColumnDef } from "@tanstack/react-table";

type columns = {
  key: string;
  name: string;
}


export function columnsApi(columnsApi: columns[], actions: { onBuy: (row: any) => void }): ColumnDef<columns>[] {
  return columnsApi.map((col) => {
    switch (col.key) {
      case "ID":
        return {
          accessorKey: col.key,
          header: col.name,
          enableColumnFilter: false,
          cell: (cell: any) => {
            return (
              <span className="fw-semibold">{cell.getValue()}</span>
            );
          },
        };
      case "quantity":
        return {
          accessorKey: col.key,
          header: col.name,
          enableColumnFilter: false,
          enableSorting: false,
          cell: (info) => {
            const value = info.getValue<number>() ?? 0;
            return (
              <span
                className={
                  value === 0 ? "text-red-500 font-bold" : "text-gray-800"
                }
              >
                {value}
              </span>
            );
          },
        };
      case "action":
        return {
          accessorKey: null,
          header: col.name,
          enableColumnFilter: false,
          enableSorting: false,
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
