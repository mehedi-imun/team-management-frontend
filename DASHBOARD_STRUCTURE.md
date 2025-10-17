# 📁 Dashboard Folder Structure - Scalable & Enterprise-Ready

## 🏗️ Complete Structure

```
src/
├── pages/
│   └── dashboard/
│       ├── DashboardPage.tsx              # Main dashboard/home
│       ├── organizations/                  # Organizations module
│       │   ├── index.tsx                  # Main organizations page
│       │   ├── columns.tsx                # Table column definitions
│       │   ├── CreateDialog.tsx           # Create organization dialog (TODO)
│       │   ├── EditDialog.tsx             # Edit organization dialog (TODO)
│       │   └── ViewDialog.tsx             # View details dialog (TODO)
│       ├── users/                         # Users management module
│       │   ├── index.tsx                  # Main users page (TODO)
│       │   ├── columns.tsx                # Table column definitions (TODO)
│       │   ├── CreateDialog.tsx           # Create user dialog (TODO)
│       │   └── RoleDialog.tsx             # Change role dialog (TODO)
│       ├── teams/                         # Teams module (existing feature)
│       │   ├── index.tsx                  # Main teams page (TODO: migrate)
│       │   ├── columns.tsx                # Table columns (TODO)
│       │   └── CreateDialog.tsx           # Create team form (TODO)
│       ├── analytics/                     # Platform analytics
│       │   ├── index.tsx                  # Analytics dashboard (TODO)
│       │   ├── RevenueChart.tsx           # Revenue trends chart (TODO)
│       │   ├── UserGrowthChart.tsx        # User growth chart (TODO)
│       │   └── OrganizationStats.tsx      # Org distribution (TODO)
│       ├── billing/                       # Billing & subscriptions
│       │   ├── index.tsx                  # Billing overview (TODO)
│       │   ├── SubscriptionCard.tsx       # Plan details card (TODO)
│       │   └── InvoicesList.tsx           # Invoices history (TODO)
│       └── settings/                      # System settings (SuperAdmin)
│           ├── index.tsx                  # Settings page (TODO)
│           ├── PlatformSettings.tsx       # Platform config (TODO)
│           ├── EmailTemplates.tsx         # Email template editor (TODO)
│           └── StripeSettings.tsx         # Stripe integration (TODO)
│
├── components/
│   ├── data-table/                        # Reusable data table components
│   │   ├── DataTable.tsx                  # Generic data table ✅
│   │   ├── DataTablePagination.tsx        # Pagination component ✅
│   │   └── index.ts                       # Exports ✅
│   ├── dashboard/                         # Dashboard-specific components
│   │   ├── StatsCard.tsx                  # Statistics card (TODO)
│   │   ├── PageHeader.tsx                 # Reusable page header (TODO)
│   │   └── FilterBar.tsx                  # Reusable filter bar (TODO)
│   ├── forms/                             # Form components (TODO)
│   │   ├── OrganizationForm.tsx           # Organization form with React Hook Form + Zod
│   │   ├── UserForm.tsx                   # User form
│   │   └── TeamForm.tsx                   # Team form
│   └── layout/
│       ├── DashboardLayout.tsx            # Main dashboard layout ✅
│       └── Sidebar.tsx                    # Sidebar navigation ✅
│
└── redux/
    └── features/
        └── platform/
            └── platformApi.ts             # RTK Query API endpoints ✅
```

## 🎯 Design Principles

### 1. **Feature-Based Organization**

Each feature (organizations, users, teams, etc.) has its own folder with all related files:

- `index.tsx` - Main page component
- `columns.tsx` - Data table column definitions
- `*Dialog.tsx` - Modal/dialog components
- `types.ts` - Feature-specific types (optional)

### 2. **Reusable Components**

Shared components are extracted to:

- `components/data-table/` - Table components used across all list pages
- `components/dashboard/` - Dashboard-specific reusable UI
- `components/forms/` - Form components with validation

### 3. **Separation of Concerns**

- **Pages** - Route components, state management, API calls
- **Components** - Presentational components, reusable UI
- **Redux** - API endpoints, data fetching, caching

## 📋 Usage Patterns

### Creating a New Feature Module

**Example: Users Page**

1. **Create folder structure:**

```bash
mkdir src/pages/dashboard/users
touch src/pages/dashboard/users/index.tsx
touch src/pages/dashboard/users/columns.tsx
```

2. **Define columns** (`columns.tsx`):

```tsx
import { type ColumnDef } from "@tanstack/react-table";
import type { User } from "@/redux/features/platform/platformApi";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  // ... more columns
];
```

3. **Create main page** (`index.tsx`):

```tsx
import { useState } from "react";
import { useGetAllUsersQuery } from "@/redux/features/platform/platformApi";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllUsersQuery({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <h1>Users</h1>
      <DataTable
        columns={columns}
        data={data?.data || []}
        meta={data?.meta}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersPage;
```

4. **Add route** (`App.tsx`):

```tsx
import UsersPage from "@/pages/dashboard/users";

<Route
  path="users"
  element={
    <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
      <UsersPage />
    </ProtectedRoute>
  }
/>;
```

### Using the DataTable Component

The generic `DataTable` component accepts:

```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Column definitions
  data: TData[]; // Array of data
  meta?: {
    // Pagination metadata
    page: number;
    limit: number;
    total: number;
  };
  onPageChange?: (page: number) => void; // Page change handler
  isLoading?: boolean; // Loading state
}
```

**Benefits:**

- ✅ Reusable across all list pages
- ✅ Built-in loading state
- ✅ Automatic pagination
- ✅ Type-safe with generics

## 🔄 Migration Strategy

### Existing Features to Migrate:

1. **Teams Page** (already exists in old structure)

   - Move to `pages/dashboard/teams/`
   - Extract columns to `columns.tsx`
   - Use reusable `DataTable` component

2. **Forms** (scattered across pages)
   - Extract to `components/forms/`
   - Add React Hook Form + Zod validation
   - Make them reusable dialogs

### Migration Steps:

```bash
# 1. Create new folder
mkdir src/pages/dashboard/teams

# 2. Move existing files
mv src/pages/Teams.tsx src/pages/dashboard/teams/index.tsx

# 3. Refactor to use DataTable
# - Extract columns
# - Replace custom table with <DataTable />

# 4. Update routes in App.tsx
```

## 🚀 Benefits of This Structure

### ✅ Scalability

- Easy to add new features without cluttering
- Each feature is self-contained
- Clear separation of concerns

### ✅ Maintainability

- Easy to find files (feature-based organization)
- Reusable components reduce duplication
- Consistent patterns across features

### ✅ Team Collaboration

- Multiple developers can work on different features
- Clear ownership of feature folders
- No merge conflicts in large files

### ✅ Performance

- Code splitting by feature (lazy loading)
- Reusable components optimize bundle size
- Efficient re-renders with proper component structure

## 📝 File Naming Conventions

- **Pages**: `index.tsx` (default export)
- **Components**: PascalCase (e.g., `CreateDialog.tsx`)
- **Utilities**: camelCase (e.g., `columns.tsx`, `types.ts`)
- **Reusable Components**: PascalCase with clear names (e.g., `DataTable.tsx`)

## 🎨 Component Composition

### Example: Organizations Page

```
OrganizationsPage (index.tsx)
├── PageHeader (TODO: extract to components/dashboard/)
│   ├── Title
│   ├── Description
│   └── CreateButton
├── FilterBar (TODO: extract to components/dashboard/)
│   ├── SearchInput
│   ├── StatusSelect
│   ├── PlanSelect
│   └── ClearButton
└── DataTable (reusable)
    ├── TableHeader
    │   └── Columns (from columns.tsx)
    ├── TableBody
    │   └── Rows
    └── DataTablePagination (reusable)
        ├── PageInfo
        ├── PreviousButton
        ├── PageNumbers
        └── NextButton
```

## 🔐 Access Control

Each feature folder can have route-level protection:

```tsx
// SuperAdmin only
<Route path="settings" element={<ProtectedRoute allowedRoles={["SuperAdmin"]}><SettingsPage /></ProtectedRoute>} />

// SuperAdmin & Admin
<Route path="organizations" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><OrganizationsPage /></ProtectedRoute>} />

// All authenticated users
<Route path="teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
```

## 📦 Next Steps

1. ✅ **Organizations Module** - COMPLETE

   - Page with filters
   - Data table with columns
   - Pagination

2. 🔄 **Users Module** - IN PROGRESS

   - Create users page similar to organizations
   - Add role management dialogs
   - User status controls

3. ⏳ **Forms with React Hook Form + Zod** - TODO

   - Extract form components
   - Add validation schemas
   - Create reusable dialogs

4. ⏳ **Analytics Dashboard** - TODO

   - Platform statistics
   - Charts and graphs
   - Real-time data

5. ⏳ **System Settings** - TODO
   - Platform configuration
   - Email templates
   - Integration settings

---

**This structure is production-ready and follows enterprise best practices!** 🚀
