# 🚀 Architecture Migration Guide

## 📋 Migration Status

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Created new folder structure
- [x] Created shared constants (roles, routes, status)
- [x] Created shared utilities (format, validation)
- [x] Created shared hooks (useDebounce, useLocalStorage, usePagination, usePermissions)

### 🔄 Phase 2: Move Shared Components (IN PROGRESS)
- [ ] Move UI components to `shared/components/ui/`
- [ ] Move layout components to `shared/components/layout/`
- [ ] Create feedback components in `shared/components/feedback/`
- [ ] Create form components in `shared/components/forms/`
- [ ] Create common components in `shared/components/common/`

### ⏳ Phase 3: Feature Migration (PENDING)
- [ ] Migrate Auth feature
- [ ] Migrate Dashboard feature
- [ ] Migrate Teams feature
- [ ] Migrate Users feature
- [ ] Migrate Invitations feature
- [ ] Migrate Billing feature
- [ ] Migrate Organization feature
- [ ] Migrate Analytics feature
- [ ] Migrate Reports feature

### ⏳ Phase 4: App Configuration (PENDING)
- [ ] Create providers in `app/providers/`
- [ ] Create route config in `app/routes/`
- [ ] Move store to `app/store/`

### ⏳ Phase 5: Cleanup (PENDING)
- [ ] Update all imports to use new paths
- [ ] Remove old folder structure
- [ ] Update documentation
- [ ] Test all features

---

## 📁 What We've Created

### Shared Constants

1. **`shared/constants/roles.ts`**
   - `ROLES` - Role definitions
   - `ROLE_HIERARCHY` - Permission levels
   - `hasRole()` - Permission checker
   - `getRolesBelow()` - Helper function

2. **`shared/constants/routes.ts`**
   - `ROUTES` - All application routes
   - `ROUTE_CONFIG` - Route metadata with icons and roles
   - `buildRoute()` - Dynamic route builder

3. **`shared/constants/status.ts`**
   - `APPROVAL_STATUS` - Approval states
   - `INVITATION_STATUS` - Invitation states
   - `ORG_STATUS` - Organization states
   - `PLANS` - Subscription plans
   - `PLAN_LIMITS` - Plan limits mapping
   - `getStatusBadgeClass()` - Status UI helper

### Shared Utilities

1. **`shared/utils/format.ts`**
   - `formatDate()` - Date formatting
   - `formatRelativeTime()` - "2 hours ago" format
   - `formatCurrency()` - Money formatting
   - `formatNumber()` - Number with separators
   - `formatPercentage()` - Percentage calculation
   - `truncate()` - Text truncation
   - `capitalize()` - String capitalization
   - `generateSlug()` - URL slug generator
   - `getInitials()` - Name to initials
   - `formatFileSize()` - File size formatting

2. **`shared/utils/validation.ts`**
   - `emailSchema` - Zod email schema
   - `passwordSchema` - Zod password schema
   - `nameSchema` - Zod name schema
   - `slugSchema` - Zod slug schema
   - `isValidEmail()` - Email validator
   - `isValidPassword()` - Password validator
   - `getPasswordStrength()` - Password strength meter
   - `isValidUrl()` - URL validator
   - `isValidPhone()` - Phone validator
   - `sanitizeHtml()` - XSS prevention
   - `isValidFileType()` - File type check
   - `isValidFileSize()` - File size check

### Shared Hooks

1. **`shared/hooks/useDebounce.ts`**
   - Debounce any value (great for search inputs)
   - Default 500ms delay

2. **`shared/hooks/useLocalStorage.ts`**
   - Sync React state with localStorage
   - Auto-parse JSON
   - Remove functionality

3. **`shared/hooks/usePagination.ts`**
   - Complete pagination state management
   - Next/prev/first/last page navigation
   - Total pages calculation

4. **`shared/hooks/usePermissions.ts`**
   - Role-based permission checking
   - `isAdmin`, `isManager`, etc. flags
   - `hasRole()` function
   - `canAccessRoute()` for route protection

---

## 🎯 Benefits Already Achieved

### 1. **Centralized Constants**
Before:
```typescript
// Scattered throughout codebase
if (user.role === 'Admin' || user.role === 'SuperAdmin') { ... }
```

After:
```typescript
import { ROLES, hasRole } from '@/shared/constants/roles';
if (hasRole(user.role, ROLES.MANAGER)) { ... }
```

### 2. **Reusable Utilities**
Before:
```typescript
// Duplicated in multiple files
const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
```

After:
```typescript
import { generateSlug } from '@/shared/utils/format';
const slug = generateSlug(orgName);
```

### 3. **Type-Safe Routes**
Before:
```typescript
navigate('/teams/' + teamId + '/edit');
```

After:
```typescript
import { ROUTES, buildRoute } from '@/shared/constants/routes';
navigate(buildRoute(ROUTES.TEAMS_EDIT, { id: teamId }));
```

### 4. **Consistent Validation**
Before:
```typescript
// Different validation logic in each form
const isValid = password.length >= 8 && /[A-Z]/.test(password);
```

After:
```typescript
import { isValidPassword, getPasswordStrength } from '@/shared/utils/validation';
const isValid = isValidPassword(password);
const strength = getPasswordStrength(password);
```

---

## 📝 Next Steps

### Immediate (Next 30 mins)

1. **Move Shared Components**
   ```bash
   # Move UI components
   mv src/components/ui/* src/shared/components/ui/
   
   # Move DashboardLayout
   mv src/components/DashboardLayout.tsx src/shared/components/layout/
   
   # Move feedback components
   mv src/components/Loader.tsx src/shared/components/feedback/
   mv src/components/Toast.tsx src/shared/components/feedback/
   
   # Move common components
   mv src/components/ConfirmDialog.tsx src/shared/components/common/
   ```

2. **Create Feature Folders**
   - Start with Auth feature (easiest)
   - Move Login, Register, ForgotPassword pages
   - Move authApi.ts and authSlice.ts
   - Create index.ts for public exports

3. **Update Import Paths**
   - Use find & replace to update imports
   - Test each feature after migration

### Short Term (Next 2 hours)

4. **Migrate All Features**
   - Follow pattern established with Auth
   - One feature at a time
   - Test after each migration

5. **Create App Configuration**
   - Move Redux store to `app/store/`
   - Create route configuration
   - Create provider wrappers

### Long Term (Next day)

6. **Optimization**
   - Code splitting per feature
   - Lazy loading for routes
   - Bundle analysis

7. **Documentation**
   - Update README with new structure
   - Add feature documentation
   - Create developer guide

---

## 🔧 How to Use New Structure

### Example: Creating a New Feature

```typescript
// 1. Create feature folder
src/features/notifications/

// 2. Create subfol ders
src/features/notifications/
  ├── api/
  │   └── notificationApi.ts
  ├── components/
  │   ├── NotificationCard.tsx
  │   └── NotificationList.tsx
  ├── hooks/
  │   └── useNotifications.ts
  ├── pages/
  │   └── NotificationsPage.tsx
  ├── types/
  │   └── notification.types.ts
  └── index.ts

// 3. Create public exports (index.ts)
export { NotificationsPage } from './pages/NotificationsPage';
export { useNotifications } from './hooks/useNotifications';
export type { Notification } from './types/notification.types';

// 4. Use in app
import { NotificationsPage } from '@/features/notifications';
```

### Example: Using Shared Resources

```typescript
// Constants
import { ROUTES, ROLES, APPROVAL_STATUS } from '@/shared/constants';

// Utilities
import { formatDate, generateSlug, isValidEmail } from '@/shared/utils';

// Hooks
import { useDebounce, usePagination, usePermissions } from '@/shared/hooks';

// Components
import { Button, Dialog } from '@/shared/components/ui';
import { DashboardLayout } from '@/shared/components/layout';
import { Loader } from '@/shared/components/feedback';
```

---

## 📊 Current Progress

```
Total Migration: 20% complete

✅ Shared constants (100%)
✅ Shared utilities (100%)
✅ Shared hooks (100%)
⏳ Shared components (0%)
⏳ Feature migration (0%)
⏳ App configuration (0%)
⏳ Cleanup (0%)
```

---

## 🎓 Best Practices Established

1. ✅ **Feature-based organization** - Easy to find related code
2. ✅ **Centralized constants** - Single source of truth
3. ✅ **Reusable utilities** - DRY principle
4. ✅ **Custom hooks** - Extract business logic
5. ✅ **Type safety** - TypeScript everywhere
6. ✅ **Public API pattern** - Controlled exports via index.ts
7. ✅ **Clear naming** - Descriptive file and function names
8. ✅ **Documentation** - Comments and examples in code

---

## 🚦 Ready to Continue?

Run these commands to start Phase 2:

```bash
# Check current structure
tree src/ -L 3

# Move shared components
npm run migrate:components

# Or do it manually
# (See "Immediate Next Steps" section above)
```

---

**Migration started on:** October 17, 2025
**Estimated completion:** 4-6 hours total
**Current phase:** Phase 1 Complete ✅
**Next phase:** Move Shared Components 🔄
