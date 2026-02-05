import React from 'react';
import { ContextMenuBuilder, createContextMenuConfig } from './ContextMenuBuilder';
import { ContextMenuConfig } from './types';

// Example 1: Basic CRUD operations
export const createBasicCrudMenu = (
  editFn: (rowData: any) => void,
  deleteFn: (rowData: any) => void,
  viewFn?: (rowData: any) => void
) => {
  return new ContextMenuBuilder()
    .addViewOption('View Details', 'ri-eye-fill', viewFn || (() => {}))
    .addDivider()
    .addEditOption('Edit', 'ri-pencil-fill', editFn)
    .addDeleteOption('Delete', 'ri-delete-bin-fill', deleteFn)
    .build();
};

// Example 2: Admin role management
export const createAdminRoleMenu = (
  editFn: (rowData: any) => void,
  deleteFn: (rowData: any) => void,
  permissionsFn?: (rowData: any) => void
) => {
  return new ContextMenuBuilder()
    .addViewOption('View Details', 'ri-eye-fill', () => {})
    .addDivider()
    .addEditOption('Edit Role', 'ri-pencil-fill', editFn)
    .addCustomOption('permissions', 'Manage Permissions', 'ri-shield-fill', 'text-warning', permissionsFn || (() => {}))
    .addCustomOption('users', 'View Users', 'ri-user-fill', 'text-info', () => {})
    .addDivider()
    .addDuplicateOption('Duplicate Role', 'ri-file-copy-fill', () => {})
    .addExportOption('Export Role', 'ri-download-fill', () => {})
    .addDeleteOption('Delete Role', 'ri-delete-bin-fill', deleteFn)
    .build();
};

// Example 3: User management
export const createUserMenu = (
  editFn: (rowData: any) => void,
  deleteFn: (rowData: any) => void,
  activateFn?: (rowData: any) => void
) => {
  return new ContextMenuBuilder()
    .addViewOption('View Profile', 'ri-user-fill', () => {})
    .addDivider()
    .addEditOption('Edit User', 'ri-pencil-fill', editFn)
    .addCustomOption('activate', 'Activate/Deactivate', 'ri-checkbox-circle-fill', 'text-success', activateFn || (() => {}))
    .addCustomOption('reset', 'Reset Password', 'ri-lock-fill', 'text-warning', () => {})
    .addDivider()
    .addDeleteOption('Delete User', 'ri-delete-bin-fill', deleteFn)
    .build();
};

// Example 4: Product management
export const createProductMenu = (
  editFn: (rowData: any) => void,
  deleteFn: (rowData: any) => void,
  duplicateFn?: (rowData: any) => void
) => {
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
};

// Example 5: Custom configuration
export const createCustomMenu = () => {
  return new ContextMenuBuilder()
    .setTheme('dark')
    .setAnimation('scale')
    .setPosition('center')
    .setDimensions(200, 300, 400)
    .setZIndex(10000)
    .setBehavior(true, true, false, 500)
    .addCustomOption('custom1', 'Custom Action 1', 'ri-star-fill', 'text-primary', () => {})
    .addCustomOption('custom2', 'Custom Action 2', 'ri-heart-fill', 'text-danger', () => {})
    .build();
};

// Example 6: Using predefined configurations
export const createPredefinedMenus = () => {
  return {
    crud: createContextMenuConfig.crud(
      (rowData) => console.log('Edit:', rowData),
      (rowData) => console.log('Delete:', rowData),
      (rowData) => console.log('View:', rowData)
    ),
    admin: createContextMenuConfig.admin(
      (rowData) => console.log('Edit:', rowData),
      (rowData) => console.log('Delete:', rowData),
      (rowData) => console.log('Permissions:', rowData)
    ),
    user: createContextMenuConfig.user(
      (rowData) => console.log('Edit:', rowData),
      (rowData) => console.log('Delete:', rowData),
      (rowData) => console.log('Activate:', rowData)
    ),
    product: createContextMenuConfig.product(
      (rowData) => console.log('Edit:', rowData),
      (rowData) => console.log('Delete:', rowData),
      (rowData) => console.log('Duplicate:', rowData)
    ),
  };
};

// Example 7: Dynamic menu based on data
export const createDynamicMenu = (rowData: any) => {
  const builder = new ContextMenuBuilder();
  
  // Always add view option
  builder.addViewOption('View Details', 'ri-eye-fill', () => {});
  
  // Add edit if user has permission
  if (rowData.canEdit) {
    builder.addEditOption('Edit', 'ri-pencil-fill', () => {});
  }
  
  // Add delete only if not system item
  if (!rowData.isSystem) {
    builder.addDeleteOption('Delete', 'ri-delete-bin-fill', () => {});
  }
  
  // Add custom options based on data
  if (rowData.type === 'admin') {
    builder.addCustomOption('permissions', 'Manage Permissions', 'ri-shield-fill', 'text-warning', () => {});
  }
  
  if (rowData.hasInventory) {
    builder.addCustomOption('inventory', 'Manage Inventory', 'ri-stock-fill', 'text-info', () => {});
  }
  
  return builder.build();
};

// Example 8: Configuration presets
export const contextMenuConfigs: Record<string, ContextMenuConfig> = {
  default: {
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
  },
  admin: {
    enableContextMenu: true,
    position: 'mouse',
    theme: 'dark',
    animation: 'scale',
    maxHeight: 400,
    minWidth: 200,
    maxWidth: 300,
    zIndex: 10000,
    closeOnClickOutside: true,
    closeOnEscape: true,
    showOnHover: false,
    hoverDelay: 300,
  },
  mobile: {
    enableContextMenu: true,
    position: 'center',
    theme: 'light',
    animation: 'slide',
    maxHeight: 250,
    minWidth: 120,
    maxWidth: 200,
    zIndex: 9999,
    closeOnClickOutside: true,
    closeOnEscape: true,
    showOnHover: false,
    hoverDelay: 300,
  },
};
