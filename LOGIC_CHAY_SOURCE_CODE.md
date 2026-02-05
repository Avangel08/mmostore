# Logic Chạy Của Source Code - MMO Store

## 1. LOGIC CHẠY TỔNG THỂ CỦA ỨNG DỤNG

### 1.1. Luồng Khởi Động (Bootstrap Flow)

```
1. Request đến Server
   ↓
2. public/index.php
   - Kiểm tra maintenance mode
   - Load Composer autoload
   - Require bootstrap/app.php
   ↓
3. bootstrap/app.php
   - Tạo Application instance (IoC Container)
   - Bind Kernel interfaces
   - Return $app
   ↓
4. $kernel->handle($request)
   - Chạy qua HTTP Kernel
   ↓
5. Middleware Stack (app/Http/Kernel.php)
   Global Middleware:
   - TrustProxies
   - HandleCors
   - PreventRequestsDuringMaintenance
   - TrimStrings
   - ConvertEmptyStringsToNull
   
   Web Middleware Group:
   - EncryptCookies
   - StartSession
   - SetLocale
   - ShareErrorsFromSession
   - EnsureFrontendRequestsAreStateful (Sanctum)
   - VerifyCsrfToken
   - SubstituteBindings
   - ResolveTenantMongo ⭐ (Resolve MongoDB connection)
   - HandleInertiaRequests ⭐ (Setup Inertia.js)
   ↓
6. Route Resolution (RouteServiceProvider)
   - Load routes từ:
     * routes/api.php
     * routes/home.php
     * routes/admin.php
     * routes/buyer.php
     * routes/seller.php
   ↓
7. Route Middleware
   - validate.subdomain (Validate domain, find Store)
   - tenant.mongo (Apply MongoDB connection)
   - checkauth:seller/buyer/admin (Check authentication)
   ↓
8. Controller
   - Xử lý business logic
   - Return Inertia response hoặc JSON
   ↓
9. Response
   - Inertia: Render React component
   - JSON: Return API response
```

### 1.2. Frontend Bootstrap Flow

**Entry Points:**
- `resources/js/app-admin.tsx` - Admin panel
- `resources/js/app-seller.tsx` - Seller panel
- `resources/js/app-buyer.tsx` - Buyer frontend
- `resources/js/app-home.tsx` - Home page
- `resources/js/app.tsx` - Demo/Default

**Luồng Frontend:**

```
1. Browser load page
   ↓
2. Vite build assets
   ↓
3. Entry file (app-*.tsx) được load
   ↓
4. bootstrap.tsx
   - Setup axios với CSRF token
   - Configure base URL
   ↓
5. i18n.ts
   - Setup internationalization
   ↓
6. createInertiaApp()
   - Setup Inertia.js
   - Configure Redux store
   - Setup ContextMenu provider
   ↓
7. resolvePageComponent()
   - Tự động resolve component từ route name
   - Lazy load component
   ↓
8. Render React Component
   - Component nhận props từ Inertia
   - Component render UI
```

---

## 2. LOGIC CHẠY CỦA CategoryFilter COMPONENT

### 2.1. Component Lifecycle

```typescript
// 1. Component được mount
CategoryFilter component mount
   ↓
// 2. Khởi tạo state từ URL params
useQueryParams() → Parse URL query string
   ↓
getInitialFilters() → Lấy filters từ URL
   - name: paramsUrl?.name ?? ""
   - createdDateStart: paramsUrl?.createdDateStart ?? ""
   - createdDateEnd: paramsUrl?.createdDateEnd ?? ""
   - status: paramsUrl?.status ?? ""
   ↓
useState(filters) → Set initial state
   ↓
// 3. Tính toán statusOptions
useMemo(() => {
  - Tạo options từ statusConst (từ backend)
  - Format: [{value: "", label: "All"}, ...]
}, [statusConst, t])
   ↓
// 4. Sync status với URL
useEffect(() => {
  - Đồng bộ statusValue với URL param
  - Chỉ update khi URL thay đổi
}, [paramsUrl?.status])
```

### 2.2. User Interaction Flow

#### A. User Click "Show Filters"
```
onClick={toggleFilterVisibility}
   ↓
setIsFilterVisible(!isFilterVisible)
   ↓
Render filter form (nếu isFilterVisible = true)
```

#### B. User Nhập Filter
```
User nhập name
   ↓
onChange={(e) => handleInputChange("name", e.target.value)}
   ↓
setFilters((prev) => ({ ...prev, name: value }))
   ↓
State được update (nhưng chưa apply filter)
```

#### C. User Chọn Date Range
```
User chọn date trong Flatpickr
   ↓
onChange={handleDateChange}
   ↓
handleDateChange(selectedDates)
   ↓
setFilters((prev) => ({
  ...prev,
  createdDateStart: start ? moment(start).format("YYYY-MM-DD") : "",
  createdDateEnd: end ? moment(end).format("YYYY-MM-DD") : "",
}))
```

#### D. User Chọn Status
```
User chọn status trong Select
   ↓
onChange={handleStatusChange}
   ↓
setStatusValue(selected.value)
handleInputChange("status", selected.value)
   ↓
State được update
```

#### E. User Click "Filter"
```
onClick={handleFilter}
   ↓
handleFilter()
   ↓
onFilter(1, Number(perPage), filters)
   ↓
Callback được gọi → Parent component (Category/index.tsx)
   ↓
handleFilter() trong parent
   ↓
fetchData(currentPage, perPage, filters)
   ↓
router.reload({
  only: ["categories"],
  replace: true,
  data: {
    page: currentPage,
    perPage: perPage,
    ...filters,  // ← Filters được gửi lên server
  },
})
   ↓
Inertia request đến Laravel
   ↓
CategoryController::index()
   ↓
Filter categories theo params
   ↓
Return Inertia response với categories đã filter
   ↓
Frontend nhận data mới
   ↓
TableCategory re-render với data mới
```

#### F. User Click "Reset"
```
onClick={handleReset}
   ↓
setFilters({
  name: "",
  createdDateStart: "",
  createdDateEnd: "",
  status: "",
})
setStatusValue("")
flatpickrRef.current.flatpickr.clear()
   ↓
onFilter(1, Number(perPage), resetFilters)
   ↓
Tương tự như Filter, nhưng với filters rỗng
   ↓
URL được clear filters
   ↓
Data được reload về mặc định
```

### 2.3. URL Sync Logic

**useQueryParams Hook:**
```typescript
// Hook này đọc query params từ URL
const paramsUrl = useQueryParams();

// Logic:
1. usePage() từ Inertia → Lấy page props
2. Extract URL từ page props
3. Parse query string: url.split("?")[1]
4. URLSearchParams để parse
5. Return object với key-value pairs
```

**Sync Flow:**
```
1. Component mount
   ↓
2. useQueryParams() đọc URL
   ↓
3. getInitialFilters() dùng paramsUrl để init state
   ↓
4. User thay đổi filter → State update
   ↓
5. User click Filter → router.reload() với data mới
   ↓
6. URL được update với query params mới
   ↓
7. useQueryParams() detect URL change
   ↓
8. useEffect sync statusValue với URL
```

### 2.4. Status Options Logic

**Tại sao cần statusValue riêng?**

```typescript
// Vấn đề: Khi đổi ngôn ngữ, statusOptions thay đổi
// Nhưng value (key) vẫn giữ nguyên
// → Cần preserve value riêng để không bị mất khi re-render

const [statusValue, setStatusValue] = useState<string>(paramsUrl?.status || "");

// selectedStatus được tính từ statusValue
const selectedStatus = useMemo(() => {
  if (statusValue && statusValue !== "") {
    const found = statusOptions.find(
      (option) => option.value.toString() === statusValue
    );
    if (found) return found;
  }
  return statusOptions[0]; // Default: "All"
}, [statusOptions, statusValue, t]);
```

**Flow:**
```
1. statusConst từ backend: { "ACTIVE": "Active", "INACTIVE": "Inactive" }
   ↓
2. statusOptions được tạo:
   [
     { value: "", label: "All" },
     { value: "ACTIVE", label: "Active" },
     { value: "INACTIVE", label: "Inactive" }
   ]
   ↓
3. statusValue = "ACTIVE" (từ URL)
   ↓
4. selectedStatus = { value: "ACTIVE", label: "Active" }
   ↓
5. Select component hiển thị "Active"
```

---

## 3. LUỒNG REQUEST-RESPONSE HOÀN CHỈNH

### 3.1. Web Request Flow (Inertia)

```
Browser Request
   ↓
Laravel Middleware Stack
   ↓
Route Resolution
   ↓
Controller::index()
   ↓
Service Layer (nếu có)
   ↓
Query Database (MongoDB/MySQL)
   ↓
Return Inertia::render('Category/index', [
  'categories' => $categories,
  'statusConst' => $statusConst
])
   ↓
HandleInertiaRequests Middleware
   - Share props
   - Share user data
   - Share flash messages
   ↓
Response với Inertia props
   ↓
Frontend nhận props
   ↓
Inertia resolve component
   ↓
React component render với props
```

### 3.2. Filter Request Flow

```
User click Filter button
   ↓
handleFilter() trong CategoryFilter
   ↓
onFilter(1, 10, filters) callback
   ↓
handleFilter() trong Category/index.tsx
   ↓
fetchData(1, 10, filters)
   ↓
router.reload({
  only: ["categories"],
  data: { page: 1, perPage: 10, ...filters }
})
   ↓
Inertia GET request với query params
   ↓
Laravel nhận request
   ↓
CategoryController::index() với Request $request
   ↓
Extract filters từ $request:
   - name
   - createdDateStart
   - createdDateEnd
   - status
   ↓
CategoryService::getForTable($request, ...)
   ↓
Query MongoDB với filters
   ↓
Return paginated results
   ↓
Inertia response với categories mới
   ↓
Frontend chỉ update "categories" prop (only: ["categories"])
   ↓
TableCategory re-render với data mới
   ↓
URL được update với query params
```

---

## 4. CÁC ĐIỂM QUAN TRỌNG

### 4.1. State Management

**Local State (CategoryFilter):**
- `filters`: Filter values hiện tại
- `statusValue`: Status value riêng (preserve khi đổi ngôn ngữ)
- `isFilterVisible`: Show/hide filter form

**URL State:**
- Query params là source of truth
- Component sync với URL
- Reset = Clear URL params

**Inertia Props:**
- `categories`: Data từ server
- `statusConst`: Constants từ server

### 4.2. Performance Optimizations

1. **useMemo cho statusOptions:**
   - Chỉ tính lại khi statusConst hoặc t() thay đổi
   - Tránh re-create options mỗi render

2. **useMemo cho selectedStatus:**
   - Chỉ tính lại khi dependencies thay đổi

3. **router.reload() với only: ["categories"]:**
   - Chỉ reload prop cần thiết
   - Không reload toàn bộ page

4. **replace: true:**
   - Không tạo history entry mới
   - URL được replace thay vì push

### 4.3. Error Handling

- URL params có thể không tồn tại → Dùng `?? ""` để default
- statusOptions có thể rỗng → Check length trước khi find
- Flatpickr ref có thể null → Check trước khi clear

### 4.4. Internationalization (i18n)

- Tất cả text dùng `t()` function
- Flatpickr locale thay đổi theo `i18n.language`
- Status labels được translate từ backend constants

---

## 5. DIAGRAM TỔNG QUAN

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER REQUEST                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Laravel HTTP Kernel                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Global Middleware                                │   │
│  │ - TrustProxies, CORS, Maintenance, etc.          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Web Middleware Group                              │   │
│  │ - Session, CSRF, Inertia, Tenant Resolution     │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Route Resolution                           │
│  - validate.subdomain → Find Store                      │
│  - tenant.mongo → Apply MongoDB Connection              │
│  - checkauth → Check Authentication                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Controller                                 │
│  - CategoryController::index()                          │
│  - Extract filters from Request                         │
│  - Call Service Layer                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Service Layer                              │
│  - CategoryService::getForTable()                      │
│  - Query MongoDB with filters                           │
│  - Return paginated results                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Inertia Response                           │
│  - Return props: { categories, statusConst }           │
│  - HandleInertiaRequests share props                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend (React)                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Category/index.tsx                                │  │
│  │  - Receive props from Inertia                     │  │
│  │  - Render CategoryFilter component                │  │
│  │  - Render TableCategory component                 │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ CategoryFilter Component                         │  │
│  │  - Read URL params                                │  │
│  │  - Manage filter state                            │  │
│  │  - User interaction → Call onFilter callback      │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              User Clicks Filter                         │
│  → router.reload() với filters                         │
│  → Loop lại từ đầu                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 6. TÓM TẮT LOGIC CHẠY

### Backend (Laravel):
1. **Request** → Middleware → Route → Controller
2. **Controller** → Service → Database Query
3. **Response** → Inertia props → Frontend

### Frontend (React + Inertia):
1. **Component Mount** → Read URL params → Init state
2. **User Interaction** → Update state → Call callback
3. **Callback** → router.reload() → Request mới → Update props → Re-render

### Key Points:
- ✅ URL là source of truth cho filters
- ✅ Inertia.js handle SPA navigation
- ✅ Component state sync với URL
- ✅ Optimized với useMemo và only props
- ✅ Multi-tenant với middleware resolution

