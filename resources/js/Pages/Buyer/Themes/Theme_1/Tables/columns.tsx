import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";

type columns = {
  key: string;
  name: string;
}

export function columnsApi(columns: columns[], actions: { onBuy: (row: any) => void }, storageUrl: string): ColumnDef<columns>[] {
  return columns.map((col) => {
    switch (col.key) {
      case "id":
        return {
          accessorKey: col.key,
          header: col.name,
          enableColumnFilter: false,
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
          enableColumnFilter: false,
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
                    <h5 className="fs-14 mb-1">
                      <Link
                        target="_blank"
                        href={`/products/detail/${cell.row.original.slug ?? ''}`}
                        className="text-body"
                      >
                        {" "}
                        {cell.getValue()}
                      </Link>
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
