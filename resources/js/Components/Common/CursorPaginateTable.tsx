import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";

import {
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  PaginationState,
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { useQueryParams } from "../../hooks/useQueryParam";

// Column Filter
const Filter = ({
  column
}: {
  column: Column<any, unknown>;
  table: ReactTable<any>;
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, value]);

  return (
    <input {...props} value={value} id="search-bar-0" className="form-control border-0 search" onChange={e => setValue(e.target.value)} />
  );
};

interface CursorPaginateTableProps {
  columns?: any;
  data?: {
    data: any[];
    path: string;
    per_page: number;
    next_cursor: string | null;
    next_page_url: string | null;
    prev_cursor: string | null;
    prev_page_url: string | null;
  };
  isGlobalFilter?: any;
  handleTaskClick?: any;
  customPageSize?: any;
  borderClass?: any;
  tableClass?: any;
  theadClass?: any;
  trClass?: any;
  thClass?: any;
  divClass?: any;
  SearchPlaceholder?: any;
  handleLeadClick?: any;
  handleCompanyClick?: any;
  handleContactClick?: any;
  handleTicketClick?: any;
  onSubmit?: any;
  onReloadTable?: (cursor: string | null, perPage: number, direction?: 'next' | 'prev') => void;
  perPageEntries?: number[];
  onRowContextMenu?: (event: React.MouseEvent, rowData: any) => void;
  divStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
  maxHeight?: string | number;
  keyPageParam?: string;
  keyPerPageParam?: string;
}

const CursorPaginateTable = ({
  columns,
  data,
  isGlobalFilter,
  customPageSize,
  borderClass,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); },
  onReloadTable,
  perPageEntries = [10, 50, 100, 200],
  onRowContextMenu,
  divStyle,
  tableStyle,
  maxHeight = '500px',
  keyPageParam = 'page',
  keyPerPageParam = 'perPage',
}: CursorPaginateTableProps) => {
  const {t} = useTranslation();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const param = useQueryParams();
  const cursor = param?.[keyPageParam] ?? null;
  const perPage = param?.[keyPerPageParam] ?? "10";

  const [selectedEntries, setSelectedEntries] = useState({ value: perPage, label: perPage });

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0, // Not used in cursor pagination, but required by react-table
    pageSize: Number(perPage),
  });

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank
    });
    return itemRank.passed;
  };

  const handleRowContextMenu = (event: React.MouseEvent, rowData: any) => {
    if (onRowContextMenu) {
      onRowContextMenu(event, rowData);
    }
  };

  const table = useReactTable({
    columns,
    data: data?.data ?? [],
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      pagination
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    rowCount: -1, // Unknown total for cursor pagination
    onPaginationChange: setPagination,
  });

  const {
    getHeaderGroups,
    getRowModel,
    setPageSize,
    getState
  } = table;

  useEffect(() => {
    Number(customPageSize) && setPageSize(Number(customPageSize));
  }, [customPageSize, setPageSize]);

  const handlePreviousPage = () => {
    if (onReloadTable && data?.prev_cursor !== null) {
      onReloadTable(data.prev_cursor, pagination.pageSize, 'prev');
    }
  };

  const handleNextPage = () => {
    if (onReloadTable && data?.next_cursor) {
      onReloadTable(data.next_cursor, pagination.pageSize, 'next');
    }
  };

  const handleFirstPage = () => {
    if (onReloadTable) {
      onReloadTable(null, pagination.pageSize);
    }
  };

  const handlePerPageChange = (selected: any) => {
    if (onReloadTable) {
      onReloadTable(null, selected.value); // Reset to first page with new per_page
    }
    setPagination((old) => ({
      ...old,
      pageSize: selected.value,
    }));
    setSelectedEntries(selected);
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setPagination(prev => {
        const newPageSize = Number(perPage);

        if (prev.pageSize !== newPageSize) {
          return {
            ...prev,
            pageSize: newPageSize,
          };
        }
        return prev;
      });
      
      setSelectedEntries({ value: perPage, label: perPage });
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [perPage, cursor]);

  // Effect to sync with data changes (for Inertia.js page updates)
  useEffect(() => {
    setPagination(prev => {
      const newPageSize = Number(perPage);

      if (prev.pageSize !== newPageSize) {
        return {
          ...prev,
          pageSize: newPageSize,
        };
      }
      return prev;
    });
    
    setSelectedEntries({ value: perPage, label: perPage });
  }, [data, perPage, cursor]);

  const hasData = data?.data && data.data.length > 0;
  const hasPreviousPage = data?.prev_cursor !== null;
  const hasNextPage = data?.next_cursor !== null;
  const isFirstPage = !cursor || cursor === null;

  return (
    <Fragment>
      {isGlobalFilter && <Row className="mb-3">
        <Card.Body className="border border-dashed border-end-0 border-start-0">
          <form onSubmit={onSubmit}>
            <Row>
              <Col sm={5}>
                <div className="search-box me-2 mb-2 d-inline-block col-12">
                  <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    placeholder={SearchPlaceholder}
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </Col>
            </Row>
          </form>
        </Card.Body>
      </Row>}

      <div className={divClass} style={{ ...divStyle, position: 'relative', maxHeight: maxHeight, overflowY: 'auto' }}>
        <Table hover className={tableClass} bordered={borderClass} style={tableStyle}>
          <thead className={`${theadClass} sticky-top`} style={{ zIndex: 10 }}>
            {getHeaderGroups().map((headerGroup: any) => (
              <tr className={trClass} key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th 
                    key={header.id} 
                    className={`${thClass} ${header.column.getCanSort() ? 'sortable-header' : ''}`}
                    style={{ 
                      position: 'sticky', 
                      top: 0, 
                      zIndex: 10,
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none'
                    }}
                    {...{
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <React.Fragment>
                        <div className="d-flex align-items-center">
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                          {header.column.getCanSort() && (
                            <div className="ms-1">
                              {header.column.getIsSorted() === 'asc' ? (
                                <i className="ri-arrow-up-s-line"></i>
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <i className="ri-arrow-down-s-line"></i>
                              ) : (
                                <i className="ri-expand-up-down-line text-muted"></i>
                              )}
                            </div>
                          )}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
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

      <Row className="align-items-center mt-2 g-3 text-center text-sm-start"> 
        <div className="col-sm">
          <div className="text-muted">
            {t("Showing")} <span className="fw-semibold">{getRowModel().rows.length}</span> {t("results")}
            {data?.per_page && (
              <span> ({data.per_page} {t("per page")})</span>
            )}
          </div>
        </div>
        <div className="col-sm-auto">
          <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
            <li className={isFirstPage ? "page-item disabled" : "page-item"}>
              <Button 
                className="page-link" 
                onClick={handleFirstPage} 
                variant="link"
                disabled={isFirstPage}
                title={t("Go to first page")}
              >
                &lt;&lt;
              </Button>
            </li>
            
            <li className={!hasPreviousPage ? "page-item disabled" : "page-item"}>
              <Button 
                className="page-link" 
                onClick={handlePreviousPage} 
                variant="link"
                disabled={!hasPreviousPage}
                title={t("Previous page")}
              >
                &lt;
              </Button>
            </li>
            
            <li className={!hasNextPage ? "page-item disabled" : "page-item"}>
              <Button 
                variant="link" 
                className="page-link" 
                onClick={handleNextPage}
                disabled={!hasNextPage}
                title={t("Next page")}
              >
                &gt;
              </Button>
            </li>
          </ul>
        </div>
        <div className="col-lg-auto">
          <Select
              value={selectedEntries}
              onChange={handlePerPageChange}
              options={perPageEntries.map((entry) => ({ value: entry, label: entry }))}
              id="choices-single-default"
              className="js-example-basic-single mb-0"
              name="state"
              menuPlacement={"auto"}
          />
        </div>
      </Row>
      
      {!hasData && (
        <Row className="mt-3">
          <Col className="text-center">
            <div className="text-muted">{t("No data available")}</div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default CursorPaginateTable;