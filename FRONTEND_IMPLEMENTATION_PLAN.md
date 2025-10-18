# Frontend Implementation Plan - System Engineering Approach

## 📋 Overview
Complete frontend implementation for multi-organization team management system with trial expiry, invitation flow, and forced password changes.

---

## 🏗️ Architecture Layers

### Layer 1: Type Definitions & Interfaces
**Priority: CRITICAL** | **Estimated Time: 30 mins**

- [ ] Update user types (multi-org, mustChangePassword)
- [ ] Add trial status types
- [ ] Add invitation types
- [ ] Update API response types

**Files to Create/Modify:**
- `src/types/user.ts`
- `src/types/trial.ts` (new)
- `src/types/invitation.ts` (new)
- `src/types/api.ts`

---

### Layer 2: API Integration (RTK Query)
**Priority: CRITICAL** | **Estimated Time: 1 hour**

- [ ] Auth API endpoints (change password, force change)
- [ ] Trial API endpoints (status, can-access)
- [ ] Invitation API endpoints (validate, accept)
- [ ] Update login response handling

**Files to Create/Modify:**
- `src/redux/features/auth/authApi.ts`
- `src/redux/features/trial/trialApi.ts` (new)
- `src/redux/features/invitation/invitationApi.ts` (new)

---

### Layer 3: State Management (Redux Slices)
**Priority: HIGH** | **Estimated Time: 45 mins**

- [ ] Update auth slice (mustChangePassword flag)
- [ ] Create trial slice (status, daysLeft)
- [ ] Update user slice (organizationIds)

**Files to Create/Modify:**
- `src/redux/features/auth/authSlice.ts`
- `src/redux/features/trial/trialSlice.ts` (new)

---

### Layer 4: Utility Functions & Helpers
**Priority: MEDIUM** | **Estimated Time: 30 mins**

- [ ] Password validation helper
- [ ] Trial status formatter
- [ ] Date/time utilities for trial countdown
- [ ] Error message formatter

**Files to Create:**
- `src/utils/password.ts` (new)
- `src/utils/trial.ts` (new)

---

### Layer 5: Reusable Components
**Priority: HIGH** | **Estimated Time: 1.5 hours**

#### A. Trial Components
- [ ] `TrialBanner.tsx` - Shows days left, color-coded
- [ ] `TrialExpiredModal.tsx` - Blocking modal
- [ ] `UpgradeButton.tsx` - Call-to-action

#### B. Password Components
- [ ] `PasswordStrengthIndicator.tsx` - Visual strength meter
- [ ] `PasswordRequirements.tsx` - List of requirements

#### C. Form Components
- [ ] `PasswordInput.tsx` - With show/hide toggle
- [ ] `FormError.tsx` - Standardized error display

**Directory:**
- `src/components/trial/` (new)
- `src/components/password/` (new)
- `src/components/forms/` (new)

---

### Layer 6: Page Components
**Priority: CRITICAL** | **Estimated Time: 2 hours**

#### A. Authentication Pages
- [ ] `/accept-invitation/:token` - Accept team invitation
- [ ] `/change-password` - Force password change

#### B. Dashboard Enhancement
- [ ] Add trial banner to dashboard layout
- [ ] Block features when trial expired

**Files to Create:**
- `src/pages/AcceptInvitationPage.tsx` (new)
- `src/pages/ChangePasswordPage.tsx` (new)

**Files to Modify:**
- `src/pages/dashboard/DashboardPage.tsx`
- `src/components/Layout.tsx`

---

### Layer 7: Route Guards & Navigation
**Priority: CRITICAL** | **Estimated Time: 45 mins**

- [ ] Password change guard (redirects if mustChangePassword)
- [ ] Trial expiry guard (shows modal)
- [ ] Update route configuration

**Files to Modify:**
- `src/config/routes.config.tsx`
- `src/utils/navigation.helper.ts`

---

### Layer 8: Feature-Specific Integration
**Priority: HIGH** | **Estimated Time: 1 hour**

#### A. Team Management
- [ ] Block "Create Team" button if trial expired
- [ ] Show trial upgrade prompt on create attempt
- [ ] Filter teams for OrgMember role

#### B. Invitation Management
- [ ] Block "Invite Member" button if trial expired
- [ ] Show trial upgrade prompt on invite attempt

**Files to Modify:**
- `src/pages/dashboard/organization/teams/index.tsx`
- `src/pages/dashboard/organization/members/index.tsx`

---

### Layer 9: UI/UX Enhancements
**Priority: MEDIUM** | **Estimated Time: 1 hour**

- [ ] Loading states for all new features
- [ ] Error boundaries for trial/password pages
- [ ] Toast notifications for success/error
- [ ] Smooth transitions and animations

**Files to Modify:**
- `src/components/ui/*` (various)

---

### Layer 10: Testing & Validation
**Priority: HIGH** | **Estimated Time: 1 hour**

- [ ] Test invitation flow end-to-end
- [ ] Test password change flow
- [ ] Test trial expiry blocking
- [ ] Test multi-organization switching
- [ ] Cross-browser testing

---

## 📦 Implementation Order (Dependency-Based)

### Phase 1: Foundation (Layer 1-2)
**Time: 1.5 hours**
1. Type definitions
2. API integration
3. Redux slices

### Phase 2: Components (Layer 5)
**Time: 1.5 hours**
4. Reusable components
5. Trial components
6. Password components

### Phase 3: Pages (Layer 6)
**Time: 2 hours**
7. Accept invitation page
8. Change password page
9. Dashboard integration

### Phase 4: Guards & Routes (Layer 7-8)
**Time: 1.75 hours**
10. Route guards
11. Feature blocking
12. Team/member filtering

### Phase 5: Polish (Layer 9-10)
**Time: 2 hours**
13. UI enhancements
14. Testing
15. Bug fixes

**Total Estimated Time: ~9 hours**

---

## 🔧 Technical Specifications

### Password Validation Rules
```typescript
{
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  specialChars: "@$!%*?&#"
}
```

### Trial Banner Colors
```typescript
{
  daysLeft >= 7: "blue",    // Info
  daysLeft >= 3: "orange",  // Warning
  daysLeft >= 1: "red",     // Danger
  daysLeft === 0: "gray"    // Expired (blocked)
}
```

### API Error Handling
```typescript
// Trial expired error
if (error.status === 403 && error.message.includes("trial")) {
  showTrialExpiredModal();
}

// Must change password
if (loginResponse.mustChangePassword) {
  navigate("/change-password");
}
```

---

## 📝 Code Quality Standards

### 1. TypeScript Strict Mode
- All components must be fully typed
- No `any` types allowed
- Proper interface definitions

### 2. Component Structure
```tsx
// 1. Imports
// 2. Type definitions
// 3. Component logic
// 4. Return JSX
// 5. Export
```

### 3. Error Handling
- Try-catch for all API calls
- User-friendly error messages
- Proper loading states

### 4. Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility

---

## 🚀 Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Build successful (`npm run build`)
- [ ] All pages load without errors
- [ ] Trial banner shows correctly
- [ ] Password change flow works
- [ ] Invitation acceptance works
- [ ] Feature blocking works
- [ ] Multi-org switching works
- [ ] Responsive design verified
- [ ] Performance optimized (lazy loading)

---

## 📊 Success Metrics

### Functionality
- ✅ Users can accept invitations
- ✅ Users forced to change password
- ✅ Trial status visible
- ✅ Features blocked when expired
- ✅ Clear upgrade path

### UX
- ✅ Smooth transitions
- ✅ Clear error messages
- ✅ Loading states
- ✅ Responsive design

### Performance
- ✅ Page load < 2s
- ✅ API calls < 500ms
- ✅ Smooth animations (60fps)

---

## 🔄 Next Steps After Completion

1. **Integration Testing**
   - Test with real backend
   - Verify email flows
   - Test cron job behaviors

2. **User Acceptance Testing**
   - Gather feedback
   - Iterate on UX

3. **Documentation**
   - User guide
   - API documentation
   - Deployment guide

4. **Optional Enhancements**
   - Socket.io real-time updates
   - Advanced analytics
   - Custom branding
   - SSO integration

---

**Last Updated:** October 19, 2025
**Status:** Ready for Implementation
**Assigned To:** System Engineering Team
