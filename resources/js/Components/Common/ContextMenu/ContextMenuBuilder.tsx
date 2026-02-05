import React from 'react';
import { ContextMenuOption, ContextMenuConfig } from './types';

export class ContextMenuBuilder {
  private options: ContextMenuOption[] = [];
  private config: ContextMenuConfig = {};

  constructor(defaultConfig?: ContextMenuConfig) {
    this.config = {
      enableContextMenu: true,
      position: 'mouse',
      theme: 'auto',
      animation: 'fade',
      maxHeight: 300,
      minWidth: 150,
      maxWidth: 250,
      zIndex: 9999,
      closeOnClickOutside: true,
      closeOnEscape: true,
      showOnHover: false,
      hoverDelay: 300,
      ...defaultConfig,
    };
  }

  // Add a single option
  addOption(option: ContextMenuOption): ContextMenuBuilder {
    this.options.push(option);
    return this;
  }

  // Add multiple options
  addOptions(options: ContextMenuOption[]): ContextMenuBuilder {
    this.options.push(...options);
    return this;
  }

  // Add a divider
  addDivider(): ContextMenuBuilder {
    this.options.push({
      id: `divider-${Date.now()}`,
      label: '',
      onClick: () => {},
      divider: true,
    });
    return this;
  }

  // Add edit option
  addEditOption(
    label: string = 'Edit',
    icon: string = 'ri-pencil-fill',
    onClick: (rowData: any) => void
  ): ContextMenuBuilder {
    this.addOption({
      id: 'edit',
      label,
      icon,
      className: 'text-primary',
      onClick,
    });
    return this;
  }

  // Add delete option
  addDeleteOption(
    label: string = 'Delete',
    icon: string = 'ri-delete-bin-fill',
    onClick: (rowData: any) => void,
    disabled: boolean = false
  ): ContextMenuBuilder {
    this.addOption({
      id: 'delete',
      label,
      icon,
      className: 'text-danger',
      disabled,
      onClick,
    });
    return this;
  }

  // Add view option
  addViewOption(
    label: string = 'View',
    icon: string = 'ri-eye-fill',
    onClick: (rowData: any) => void
  ): ContextMenuBuilder {
    this.addOption({
      id: 'view',
      label,
      icon,
      className: 'text-info',
      onClick,
    });
    return this;
  }

  // Add duplicate option
  addDuplicateOption(
    label: string = 'Duplicate',
    icon: string = 'ri-file-copy-fill',
    onClick: (rowData: any) => void
  ): ContextMenuBuilder {
    this.addOption({
      id: 'duplicate',
      label,
      icon,
      className: 'text-warning',
      onClick,
    });
    return this;
  }

  // Add export option
  addExportOption(
    label: string = 'Export',
    icon: string = 'ri-download-fill',
    onClick: (rowData: any) => void
  ): ContextMenuBuilder {
    this.addOption({
      id: 'export',
      label,
      icon,
      className: 'text-success',
      onClick,
    });
    return this;
  }

  // Add custom option
  addCustomOption(
    id: string,
    label: string,
    icon?: string,
    className?: string,
    onClick?: (rowData: any) => void,
    disabled: boolean = false
  ): ContextMenuBuilder {
    this.addOption({
      id,
      label,
      icon,
      className,
      disabled,
      onClick: onClick || (() => {}),
    });
    return this;
  }

  // Set configuration
  setConfig(config: Partial<ContextMenuConfig>): ContextMenuBuilder {
    this.config = { ...this.config, ...config };
    return this;
  }

  // Set theme
  setTheme(theme: 'light' | 'dark' | 'auto'): ContextMenuBuilder {
    this.config.theme = theme;
    return this;
  }

  // Set animation
  setAnimation(animation: 'fade' | 'slide' | 'scale' | 'none'): ContextMenuBuilder {
    this.config.animation = animation;
    return this;
  }

  // Set position
  setPosition(position: 'mouse' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): ContextMenuBuilder {
    this.config.position = position;
    return this;
  }

  // Set dimensions
  setDimensions(minWidth?: number, maxWidth?: number, maxHeight?: number): ContextMenuBuilder {
    if (minWidth !== undefined) this.config.minWidth = minWidth;
    if (maxWidth !== undefined) this.config.maxWidth = maxWidth;
    if (maxHeight !== undefined) this.config.maxHeight = maxHeight;
    return this;
  }

  // Set z-index
  setZIndex(zIndex: number): ContextMenuBuilder {
    this.config.zIndex = zIndex;
    return this;
  }

  // Set behavior
  setBehavior(closeOnClickOutside?: boolean, closeOnEscape?: boolean, showOnHover?: boolean, hoverDelay?: number): ContextMenuBuilder {
    if (closeOnClickOutside !== undefined) this.config.closeOnClickOutside = closeOnClickOutside;
    if (closeOnEscape !== undefined) this.config.closeOnEscape = closeOnEscape;
    if (showOnHover !== undefined) this.config.showOnHover = showOnHover;
    if (hoverDelay !== undefined) this.config.hoverDelay = hoverDelay;
    return this;
  }

  // Build the options array
  build(): ContextMenuOption[] {
    return [...this.options];
  }

  // Build the configuration
  buildConfig(): ContextMenuConfig {
    return { ...this.config };
  }

  // Reset builder
  reset(): ContextMenuBuilder {
    this.options = [];
    this.config = {
      enableContextMenu: true,
      position: 'mouse',
      theme: 'auto',
      animation: 'fade',
      maxHeight: 300,
      minWidth: 150,
      maxWidth: 250,
      zIndex: 9999,
      closeOnClickOutside: true,
      closeOnEscape: true,
      showOnHover: false,
      hoverDelay: 300,
    };
    return this;
  }

  // Create a new builder instance
  static create(defaultConfig?: ContextMenuConfig): ContextMenuBuilder {
    return new ContextMenuBuilder(defaultConfig);
  }
}

// Helper function to create common context menu configurations
export const createContextMenuConfig = {
  // Basic CRUD operations
  crud: (editFn: (rowData: any) => void, deleteFn: (rowData: any) => void, viewFn?: (rowData: any) => void) => {
    return new ContextMenuBuilder()
      .addViewOption('View', 'ri-eye-fill', viewFn || (() => {}))
      .addDivider()
      .addEditOption('Edit', 'ri-pencil-fill', editFn)
      .addDeleteOption('Delete', 'ri-delete-bin-fill', deleteFn)
      .build();
  },

  // Admin operations
  admin: (editFn: (rowData: any) => void, deleteFn: (rowData: any) => void, permissionsFn?: (rowData: any) => void) => {
    return new ContextMenuBuilder()
      .addViewOption('View Details', 'ri-eye-fill', () => {})
      .addDivider()
      .addEditOption('Edit', 'ri-pencil-fill', editFn)
      .addCustomOption('permissions', 'Manage Permissions', 'ri-shield-fill', 'text-warning', permissionsFn || (() => {}))
      .addCustomOption('users', 'View Users', 'ri-user-fill', 'text-info', () => {})
      .addDivider()
      .addDuplicateOption('Duplicate', 'ri-file-copy-fill', () => {})
      .addExportOption('Export', 'ri-download-fill', () => {})
      .addDeleteOption('Delete', 'ri-delete-bin-fill', deleteFn)
      .build();
  },

  // User operations
  user: (editFn: (rowData: any) => void, deleteFn: (rowData: any) => void, activateFn?: (rowData: any) => void) => {
    return new ContextMenuBuilder()
      .addViewOption('View Profile', 'ri-user-fill', () => {})
      .addDivider()
      .addEditOption('Edit User', 'ri-pencil-fill', editFn)
      .addCustomOption('activate', 'Activate/Deactivate', 'ri-checkbox-circle-fill', 'text-success', activateFn || (() => {}))
      .addCustomOption('reset', 'Reset Password', 'ri-lock-fill', 'text-warning', () => {})
      .addDivider()
      .addDeleteOption('Delete User', 'ri-delete-bin-fill', deleteFn)
      .build();
  },

  // Product operations
  product: (editFn: (rowData: any) => void, deleteFn: (rowData: any) => void, duplicateFn?: (rowData: any) => void) => {
    return new ContextMenuBuilder()
      .addViewOption('View Product', 'ri-eye-fill', () => {})
      .addDivider()
      .addEditOption('Edit Product', 'ri-pencil-fill', editFn)
      .addDuplicateOption('Duplicate Product', 'ri-file-copy-fill', duplicateFn || (() => {}))
      .addCustomOption('inventory', 'Manage Inventory', 'ri-stock-fill', 'text-info', () => {})
      .addCustomOption('images', 'Manage Images', 'ri-image-fill', 'text-primary', () => {})
      .addDivider()
      .addExportOption('Export Product', 'ri-download-fill', () => {})
      .addDeleteOption('Delete Product', 'ri-delete-bin-fill', deleteFn)
      .build();
  },
};
