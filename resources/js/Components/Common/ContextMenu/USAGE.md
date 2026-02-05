# Hướng dẫn sử dụng Context Menu

## 🚀 Cách sử dụng nhanh

### 1. Import component
```tsx
import TableWithContextMenu from "../../../Components/Common/TableWithContextMenu";
import { ContextMenuOption } from "../../../Components/Common/ContextMenu";
```

### 2. Tạo context menu options
```tsx
const contextMenuOptions: ContextMenuOption[] = useMemo(() => [
  {
    id: 'edit',
    label: 'Edit',
    icon: 'ri-pencil-fill',
    onClick: (rowData: any) => {
      console.log('Edit:', rowData);
      // Logic edit ở đây
    },
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: 'ri-delete-bin-fill',
    className: 'text-danger',
    onClick: (rowData: any) => {
      if (window.confirm('Are you sure?')) {
        // Logic delete ở đây
      }
    },
  },
], []);
```

### 3. Sử dụng trong component
```tsx
return (
  <TableWithContextMenu
    columns={columns}
    data={data}
    enableContextMenu={true}
    contextMenuOptions={contextMenuOptions}
    // ... other props
  />
);
```

## 📋 Các loại options

### Basic Option
```tsx
{
  id: 'edit',
  label: 'Edit',
  icon: 'ri-pencil-fill',
  onClick: (rowData: any) => {
    // Logic ở đây
  },
}
```

### Disabled Option
```tsx
{
  id: 'disabled-action',
  label: 'Disabled Action',
  icon: 'ri-lock-fill',
  disabled: true,
  onClick: () => {},
}
```

### Divider
```tsx
{
  id: 'divider1',
  label: '',
  divider: true,
  onClick: () => {},
}
```

### Styled Option
```tsx
{
  id: 'delete',
  label: 'Delete',
  icon: 'ri-delete-bin-fill',
  className: 'text-danger',
  onClick: (rowData: any) => {
    // Logic delete
  },
}
```

## 🎨 Styling

Context menu tự động hỗ trợ:
- Dark theme
- Hover effects
- Icon support (RemixIcon)
- Custom CSS classes
- Responsive positioning

## 🔧 Troubleshooting

### Context menu không hiển thị
1. Đảm bảo `ContextMenuProvider` đã wrap toàn bộ app
2. Kiểm tra `enableContextMenu={true}`
3. Đảm bảo `contextMenuOptions` không rỗng

### Lỗi "useContextMenu must be used within a ContextMenuProvider"
- Đã được sửa bằng cách tách riêng `TableWithContextMenu` component
- Sử dụng `TableWithContextMenu` thay vì `TableContainer` trực tiếp

## 📁 File structure
```
resources/js/Components/Common/
├── ContextMenu/
│   ├── ContextMenu.tsx          # Component chính
│   ├── ContextMenuProvider.tsx  # Provider
│   ├── ContextMenuDemo.tsx      # Demo component
│   ├── README.md               # Documentation
│   └── USAGE.md               # Hướng dẫn sử dụng
├── TableWithContextMenu.tsx     # Wrapper component
└── TableContainerReactTable.tsx # Table component gốc
```

## ✅ Ví dụ hoàn chỉnh

Xem file `TableRole.tsx` để tham khảo cách implement đầy đủ.
