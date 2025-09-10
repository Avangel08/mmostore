export interface ContextMenuOption {
  id: string;
  label: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
  onClick: (rowData: any) => void;
  divider?: boolean;
  children?: ContextMenuOption[];
}

export interface ContextMenuConfig {
  enableContextMenu?: boolean;
  options?: ContextMenuOption[] | ((rowData: any) => ContextMenuOption[]);
  position?: 'mouse' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme?: 'light' | 'dark' | 'auto';
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  zIndex?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showOnHover?: boolean;
  hoverDelay?: number;
}

export interface ContextMenuProps {
  options: ContextMenuOption[];
  data: any;
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  config?: ContextMenuConfig;
  className?: string;
}

export interface ContextMenuContextType {
  showContextMenu: (
    options: ContextMenuOption[],
    data: any,
    position: { x: number; y: number },
    config?: ContextMenuConfig
  ) => void;
  hideContextMenu: () => void;
}

export interface ContextMenuProviderProps {
  children: React.ReactNode;
  defaultConfig?: ContextMenuConfig;
}
