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

interface TableContainerProps {
  columns?: any;
  data?: any;
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
  onReloadTable?: (page: number, perPage: number) => void;
  perPageEntries?: number[];
  onRowContextMenu?: (event: React.MouseEvent, rowData: any) => void;
  divStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
  maxHeight?: string | number;
  keyPageParam?: string;
  keyPerPageParam?: string;
  showPaginationEllipsis?: boolean;
  maxVisiblePages?: number;
}

const PaginateTableContainer = ({
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
  showPaginationEllipsis = false,
  maxVisiblePages = 5,
}: TableContainerProps) => {
  const {t} = useTranslation();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const param = useQueryParams();
  const page = param?.[keyPageParam] ?? "1";
  const perPage = param?.[keyPerPageParam] ?? "10";

  const [selectedEntries, setSelectedEntries] = useState({ value: perPage, label: perPage });

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Number(page) - 1,
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
    // getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    rowCount: data?.total ?? 0,
    onPaginationChange: (updater) => {
      if (onReloadTable) {
        const currentState = table.getState().pagination;
        const newState = typeof updater === 'function' ? updater(currentState) : updater;
        onReloadTable(newState.pageIndex + 1, newState.pageSize);
      }
      setPagination(updater);
    },
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

  // Helper function to generate pagination with ellipsis
  const generatePaginationItems = () => {
    const totalPages = getPageOptions().length;
    const currentPage = getState().pagination.pageIndex;
    
    if (!showPaginationEllipsis || totalPages <= maxVisiblePages) {
      return getPageOptions();
    }

    const items = [];
    const sidePages = Math.floor((maxVisiblePages - 3) / 2); // -3 for first, last, and current
    
    // Always show first page
    items.push(0);
    
    let startPage = Math.max(1, currentPage - sidePages);
    let endPage = Math.min(totalPages - 2, currentPage + sidePages);
    
    // Adjust range if we're near the beginning or end
    if (currentPage <= sidePages + 1) {
      endPage = Math.min(totalPages - 2, maxVisiblePages - 2);
    }
    if (currentPage >= totalPages - sidePages - 2) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    // Add ellipsis before if needed
    if (startPage > 1) {
      items.push('ellipsis-start');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }
    
    // Add ellipsis after if needed
    if (endPage < totalPages - 2) {
      items.push('ellipsis-end');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      items.push(totalPages - 1);
    }
    
    return items;
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setPagination(prev => {
        const newPageIndex = Number(page) - 1;
        const newPageSize = Number(perPage);

        if (prev.pageIndex !== newPageIndex || prev.pageSize !== newPageSize) {
          return {
            pageIndex: newPageIndex,
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
  }, []);

  // Effect to sync with data changes (for Inertia.js page updates)
  useEffect(() => {
    setPagination(prev => {
      const newPageIndex = Number(page) - 1;
      const newPageSize = Number(perPage);

      if (prev.pageIndex !== newPageIndex || prev.pageSize !== newPageSize) {
        return {
          pageIndex: newPageIndex,
          pageSize: newPageSize,
        };
      }
      return prev;
    });
    
    setSelectedEntries({ value: perPage, label: perPage });
  }, [data]);

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
          <div className="text-muted">{t("Showing")}<span className="fw-semibold ms-1">{getRowModel().rows.length}</span> {t("on")} <span className="fw-semibold">{data?.total ?? 0}</span> {t("results")}
          </div>
        </div>
        <div className="col-sm-auto">
          <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
            <li className={!getCanPreviousPage() ? "page-item disabled" : "page-item"}>
              <Button className="page-link" onClick={previousPage} variant="link">&lt;</Button>
            </li>
            {generatePaginationItems().map((item: any, key: number) => (
              <React.Fragment key={key}>
                {typeof item === 'string' ? (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                ) : (
                  <li className="page-item">
                    <Button 
                      variant="link" 
                      className={getState().pagination.pageIndex === item ? "page-link active" : "page-link"} 
                      onClick={() => setPageIndex(item)}
                    >
                      {item + 1}
                    </Button>
                  </li>
                )}
              </React.Fragment>
            ))}
            <li className={!getCanNextPage() ? "page-item disabled" : "page-item"}>
              <Button variant="link" className="page-link" onClick={nextPage}>&gt;</Button>
            </li>
          </ul>
        </div>
        <div className="col-lg-auto">
          <Select
              value={selectedEntries}
              onChange={(selected: any) => {
                onReloadTable && onReloadTable(1, selected.value);
                setPagination((old) => ({
                  ...old,
                  pageSize: selected.value,
                }));
                setSelectedEntries(selected);
              }}
              options={perPageEntries.map((entry) => ({ value: entry, label: entry }))}
              id="choices-single-default"
              className="js-example-basic-single mb-0"
              name="state"
              menuPlacement={"auto"}
          />
        </div>
      </Row>
    </Fragment>
  );
};

export default PaginateTableContainer;