import React from "react";
import { useContextMenu, ContextMenuOption } from "./ContextMenu";
import { ContextMenuConfig } from "./ContextMenu/types";
import TableContainer from "./TableContainerReactTable";
import PaginateTableContainer from "./PaginateTableContainerReactTable";

interface TableWithContextMenuProps {
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
  contextMenuOptions?:
    | ContextMenuOption[]
    | ((rowData: any) => ContextMenuOption[]);
  enableContextMenu?: boolean;
  contextMenuConfig?: ContextMenuConfig;
  isPaginateTable?: boolean;
  onReloadTable?: (page: number, perPage: number) => void;
  divStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
}

const TableWithContextMenu: React.FC<TableWithContextMenuProps> = (props) => {
  const contextMenu = useContextMenu();

  const handleRowContextMenu = (event: React.MouseEvent, rowData: any) => {
    if (props.enableContextMenu && props.contextMenuOptions && contextMenu) {
      event.preventDefault();
      event.stopPropagation();

      // Get context menu options - either array or function
      const options =
        typeof props.contextMenuOptions === "function"
          ? props.contextMenuOptions(rowData)
          : props.contextMenuOptions;

      if (options && options.length > 0) {
        contextMenu.showContextMenu(
          options,
          rowData,
          {
            x: event.clientX,
            y: event.clientY,
          },
          props.contextMenuConfig
        );
      }
    }
  };

  return props?.isPaginateTable ? (
    <PaginateTableContainer {...props} onRowContextMenu={handleRowContextMenu} />
  ) : (
    <TableContainer {...props} onRowContextMenu={handleRowContextMenu} />
  );
};

export default TableWithContextMenu;
