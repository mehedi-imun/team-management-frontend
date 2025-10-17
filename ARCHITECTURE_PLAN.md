# 🏗️ Professional Frontend Architecture

## 📁 New Folder Structure (Feature-Based Architecture)

```
src/
├── app/                          # Application configuration
│   ├── providers/               # Context providers wrapper
│   │   ├── ReduxProvider.tsx
│   │   ├── RouterProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── routes/                  # Route configurations
│   │   ├── index.tsx           # Main router
│   │   ├── ProtectedRoute.tsx  # Auth guard
│   │   ├── PublicRoute.tsx     # Public route wrapper
│   │   └── routes.config.ts    # Route definitions
│   └── store/                   # Redux store setup
│       ├── index.ts
│       ├── rootReducer.ts
│       └── middleware.ts
│
├── features/                     # Feature modules (Domain-driven)
│   ├── auth/                    # Authentication feature
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── store/
│   │   │   └── authSlice.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   └── auth.utils.ts
│   │   └── index.ts            # Public exports
│   │
│   ├── dashboard/               # Dashboard feature
│   │   ├── components/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── hooks/
│   │   │   └── useDashboardData.ts
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   └── index.ts
│   │
│   ├── teams/                   # Teams feature
│   │   ├── api/
│   │   │   └── teamApi.ts
│   │   ├── components/
│   │   │   ├── TeamCard.tsx
│   │   │   ├── TeamForm.tsx
│   │   │   ├── TeamList.tsx
│   │   │   ├── TeamMemberRow.tsx
│   │   │   └── TeamFilters.tsx
│   │   ├── hooks/
│   │   │   ├── useTeams.ts
│   │   │   ├── useCreateTeam.ts
│   │   │   └── useTeamFilters.ts
│   │   ├── pages/
│   │   │   ├── TeamsPage.tsx
│   │   │   ├── TeamDetailPage.tsx
│   │   │   └── CreateTeamPage.tsx
│   │   ├── types/
│   │   │   └── team.types.ts
│   │   └── index.ts
│   │
│   ├── users/                   # User management feature
│   │   ├── api/
│   │   │   └── userApi.ts
│   │   ├── components/
│   │   │   ├── UserTable.tsx
│   │   │   ├── UserForm.tsx
│   │   │   └── UserFilters.tsx
│   │   ├── hooks/
│   │   │   └── useUsers.ts
│   │   ├── pages/
│   │   │   └── UsersPage.tsx
│   │   └── index.ts
│   │
│   ├── invitations/             # Invitations feature
│   │   ├── api/
│   │   │   └── invitationApi.ts
│   │   ├── components/
│   │   │   ├── InvitationCard.tsx
│   │   │   ├── InvitationForm.tsx
│   │   │   └── InvitationTable.tsx
│   │   ├── pages/
│   │   │   ├── InvitationsPage.tsx
│   │   │   └── AcceptInvitationPage.tsx
│   │   └── index.ts
│   │
│   ├── billing/                 # Billing feature
│   │   ├── api/
│   │   │   └── billingApi.ts
│   │   ├── components/
│   │   │   ├── PricingCard.tsx
│   │   │   ├── BillingToggle.tsx
│   │   │   └── PlanComparison.tsx
│   │   ├── pages/
│   │   │   └── BillingPage.tsx
│   │   └── index.ts
│   │
│   ├── organization/            # Organization feature
│   │   ├── api/
│   │   │   └── organizationApi.ts
│   │   ├── components/
│   │   │   ├── OrgSettings.tsx
│   │   │   ├── UsageLimits.tsx
│   │   │   └── PlanFeatures.tsx
│   │   ├── pages/
│   │   │   ├── OrganizationPage.tsx
│   │   │   └── SetupOrganizationPage.tsx
│   │   └── index.ts
│   │
│   ├── analytics/               # Analytics feature
│   │   ├── api/
│   │   │   └── analyticsApi.ts
│   │   ├── components/
│   │   │   ├── AnalyticsChart.tsx
│   │   │   └── MetricsCard.tsx
│   │   ├── pages/
│   │   │   └── AnalyticsPage.tsx
│   │   └── index.ts
│   │
│   └── reports/                 # Reports feature
│       ├── components/
│       │   ├── ReportFilters.tsx
│       │   ├── ReportPreview.tsx
│       │   └── ExportButtons.tsx
│       ├── pages/
│       │   └── ReportsPage.tsx
│       └── index.ts
│
├── shared/                       # Shared resources
│   ├── components/              # Shared UI components
│   │   ├── ui/                 # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── feedback/           # Feedback components
│   │   │   ├── Loader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Toast.tsx
│   │   ├── forms/              # Form components
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   └── FormError.tsx
│   │   └── common/             # Common components
│   │       ├── ConfirmDialog.tsx
│   │       ├── DataTable.tsx
│   │       └── StatusBadge.tsx
│   │
│   ├── hooks/                   # Shared custom hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── usePermissions.ts
│   │   ├── useToast.ts
│   │   └── usePagination.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── format.ts           # Formatting utilities
│   │   ├── validation.ts       # Validation helpers
│   │   ├── date.ts             # Date utilities
│   │   ├── api.ts              # API helpers
│   │   └── constants.ts        # App constants
│   │
│   ├── types/                   # Shared TypeScript types
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── config/                  # Configuration files
│   │   ├── env.ts              # Environment variables
│   │   ├── routes.ts           # Route constants
│   │   └── api.config.ts       # API configuration
│   │
│   └── constants/               # App-wide constants
│       ├── roles.ts
│       ├── permissions.ts
│       └── status.ts
│
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/                       # Global styles
│   ├── index.css               # Global CSS
│   ├── tailwind.css            # Tailwind base
│   └── variables.css           # CSS variables
│
├── lib/                         # Third-party library configs
│   └── utils.ts                # cn() utility
│
├── App.tsx                      # Root component
└── main.tsx                     # Application entry point
```

## 🎯 Key Principles Applied

### 1. **Feature-Based Architecture**
- Each feature is self-contained in its own folder
- Easy to scale, test, and maintain
- Clear boundaries between features

### 2. **Separation of Concerns**
- **API Layer:** All RTK Query endpoints
- **Components:** Presentational components
- **Pages:** Container components
- **Hooks:** Business logic extraction
- **Types:** TypeScript definitions
- **Utils:** Reusable utility functions

### 3. **Domain-Driven Design**
- Features organized by business domain (auth, teams, billing)
- Not by technical layer (all components together)

### 4. **Shared Resources Pattern**
- Common components in `shared/components/`
- Reusable hooks in `shared/hooks/`
- Utilities in `shared/utils/`

### 5. **Public API Pattern**
- Each feature has `index.ts` for controlled exports
- Prevents deep imports: `import { LoginPage } from '@/features/auth'`

## 📦 Import Alias Configuration

```typescript
// vite.config.ts
export default {
  resolve: {
    alias: {
      '@': '/src',
      '@/features': '/src/features',
      '@/shared': '/src/shared',
      '@/app': '/src/app',
      '@/assets': '/src/assets',
      '@/lib': '/src/lib',
    }
  }
}
```

## 🔄 Migration Plan

### Phase 1: Setup New Structure
1. Create new folder structure
2. Move shared components to `shared/components/`
3. Move UI components to `shared/components/ui/`

### Phase 2: Feature Migration
4. Migrate Auth feature
5. Migrate Teams feature
6. Migrate other features one by one

### Phase 3: Cleanup
7. Update all imports
8. Remove old structure
9. Update documentation

## 💡 Benefits

✅ **Scalability:** Easy to add new features
✅ **Maintainability:** Clear organization
✅ **Testability:** Isolated features
✅ **Developer Experience:** Easy to find files
✅ **Team Collaboration:** Multiple devs can work without conflicts
✅ **Code Reusability:** Shared components properly organized
✅ **Type Safety:** Types co-located with features
