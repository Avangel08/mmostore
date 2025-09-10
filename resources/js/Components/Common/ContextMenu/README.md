# Context Menu Core System

A powerful, configurable context menu system for React applications built with TypeScript.

## Features

- 🎯 **Easy to use** - Simple API with builder pattern
- 🎨 **Highly configurable** - Themes, animations, positioning, and more
- 🔧 **Reusable** - Works with any table or component
- 📱 **Responsive** - Auto-adjusts position and size
- 🌙 **Dark mode support** - Built-in theme switching
- ⚡ **Performance optimized** - Minimal re-renders
- 🎭 **Animation support** - Fade, slide, scale animations
- 🎛️ **Customizable** - Full control over appearance and behavior

## Quick Start

### 1. Setup Provider

Wrap your app with the `ContextMenuProvider`:

```tsx
import { ContextMenuProvider } from './Components/Common/ContextMenu';

function App() {
  return (
    <ContextMenuProvider>
      {/* Your app content */}
    </ContextMenuProvider>
  );
}
```

### 2. Use with Table

```tsx
import { TableWithContextMenu } from './Components/Common/TableWithContextMenu';
import { ContextMenuBuilder } from './Components/Common/ContextMenu';

const MyTable = () => {
  const createContextMenuOptions = (rowData: any) => {
    return new ContextMenuBuilder()
      .addViewOption('View', 'ri-eye-fill', () => console.log('View:', rowData))
      .addEditOption('Edit', 'ri-pencil-fill', () => console.log('Edit:', rowData))
      .addDeleteOption('Delete', 'ri-delete-bin-fill', () => console.log('Delete:', rowData))
      .build();
  };

  return (
    <TableWithContextMenu
      data={data}
      columns={columns}
      enableContextMenu={true}
      contextMenuOptions={createContextMenuOptions}
    />
  );
};
```

## API Reference

### ContextMenuBuilder

The main class for building context menu options.

#### Methods

##### Adding Options
- `addOption(option: ContextMenuOption)` - Add a custom option
- `addOptions(options: ContextMenuOption[])` - Add multiple options
- `addDivider()` - Add a visual divider
- `addViewOption(label, icon, onClick)` - Add view option
- `addEditOption(label, icon, onClick)` - Add edit option
- `addDeleteOption(label, icon, onClick, disabled?)` - Add delete option
- `addDuplicateOption(label, icon, onClick)` - Add duplicate option
- `addExportOption(label, icon, onClick)` - Add export option
- `addCustomOption(id, label, icon?, className?, onClick, disabled?)` - Add custom option

##### Configuration
- `setConfig(config: Partial<ContextMenuConfig>)` - Set configuration
- `setTheme(theme: 'light' | 'dark' | 'auto')` - Set theme
- `setAnimation(animation: 'fade' | 'slide' | 'scale' | 'none')` - Set animation
- `setPosition(position: 'mouse' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right')` - Set position
- `setDimensions(minWidth?, maxWidth?, maxHeight?)` - Set dimensions
- `setZIndex(zIndex: number)` - Set z-index
- `setBehavior(closeOnClickOutside?, closeOnEscape?, showOnHover?, hoverDelay?)` - Set behavior

##### Building
- `build()` - Build the options array
- `buildConfig()` - Build the configuration object
- `reset()` - Reset the builder

#### Example

```tsx
const options = new ContextMenuBuilder()
  .setTheme('dark')
  .setAnimation('scale')
  .setPosition('center')
  .setDimensions(200, 300, 400)
  .addViewOption('View Details', 'ri-eye-fill', () => {})
  .addDivider()
  .addEditOption('Edit', 'ri-pencil-fill', () => {})
  .addDeleteOption('Delete', 'ri-delete-bin-fill', () => {}, false)
  .build();
```

### Predefined Configurations

Use `createContextMenuConfig` for common patterns:

```tsx
import { createContextMenuConfig } from './Components/Common/ContextMenu';

// CRUD operations
const crudOptions = createContextMenuConfig.crud(
  (rowData) => console.log('Edit:', rowData),
  (rowData) => console.log('Delete:', rowData),
  (rowData) => console.log('View:', rowData)
);

// Admin operations
const adminOptions = createContextMenuConfig.admin(
  (rowData) => console.log('Edit:', rowData),
  (rowData) => console.log('Delete:', rowData),
  (rowData) => console.log('Permissions:', rowData)
);

// User operations
const userOptions = createContextMenuConfig.user(
  (rowData) => console.log('Edit:', rowData),
  (rowData) => console.log('Delete:', rowData),
  (rowData) => console.log('Activate:', rowData)
);

// Product operations
const productOptions = createContextMenuConfig.product(
  (rowData) => console.log('Edit:', rowData),
  (rowData) => console.log('Delete:', rowData),
  (rowData) => console.log('Duplicate:', rowData)
);
```

### Configuration Options

```tsx
interface ContextMenuConfig {
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
```

### ContextMenuOption

```tsx
interface ContextMenuOption {
  id: string;
  label: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
  onClick: (rowData: any) => void;
  divider?: boolean;
  children?: ContextMenuOption[];
}
```

## Advanced Usage

### Custom Configuration

```tsx
const customConfig: ContextMenuConfig = {
  enableContextMenu: true,
  position: 'center',
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
};

<TableWithContextMenu
  data={data}
  columns={columns}
  enableContextMenu={true}
  contextMenuOptions={createContextMenuOptions}
  contextMenuConfig={customConfig}
/>
```

### Dynamic Options

```tsx
const createDynamicOptions = (rowData: any) => {
  const builder = new ContextMenuBuilder();
  
  // Always add view
  builder.addViewOption('View', 'ri-eye-fill', () => {});
  
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
  
  return builder.build();
};
```

### Custom Styling

The context menu supports custom CSS classes and themes:

```scss
// Custom theme
.context-menu-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  .context-menu-item {
    color: white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
```

## Examples

See `examples.tsx` for more detailed examples including:
- Basic CRUD operations
- Admin role management
- User management
- Product management
- Custom configurations
- Dynamic menus
- Configuration presets

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT