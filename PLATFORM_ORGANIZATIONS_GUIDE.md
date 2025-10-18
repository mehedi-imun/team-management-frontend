# Platform Organizations - Admin Actions Guide

## 🎯 Role-Based Access Control (RBAC)

### Permission Levels

#### **SuperAdmin**

- ✅ View all organizations
- ✅ Create new organizations
- ✅ Update organization status (Suspend/Activate)
- ✅ Delete organizations permanently
- ✅ Manage organization members
- ✅ Access to all features

#### **Admin (Platform Admin)**

- ✅ View all organizations
- ✅ Create new organizations
- ✅ Update organization status (Suspend/Activate)
- ✅ Manage organization members
- ❌ Cannot delete organizations (SuperAdmin only)

#### **OrgOwner/OrgAdmin/OrgMember**

- ❌ No access to platform organizations page
- Shows "Access Denied" message

---

## 📋 Available Admin Actions

### 1. **View Details** (All Platform Admins)

- View complete organization information
- See subscription details
- Check usage statistics
- View billing information

### 2. **Manage Members** (SuperAdmin & Admin)

- Add new members to organization
- Update member roles
- Remove members
- Manage organization administrators

### 3. **Update Status** (SuperAdmin & Admin)

- **Suspend Organization**: Temporarily disable access
  - Organization status changes to "suspended"
  - Members cannot log in
  - Data preserved
- **Activate Organization**: Re-enable suspended organizations
  - Organization status changes to "active"
  - Members can log in again
  - All features restored

### 4. **Delete Organization** (SuperAdmin Only)

- ⚠️ **Permanent deletion**
- Removes all organization data
- Requires SuperAdmin role
- Cannot be undone
- Confirmation dialog shown

---

## 🔧 Technical Implementation

### Frontend Components

```typescript
// Main page with permission checks
/pages/aabddhors /
  platform /
  organizations /
  index.tsx /
  // Permission-based column rendering
  pages /
  dashboard /
  platform /
  organizations /
  columns.tsx /
  // Action dialogs
  pages /
  dashboard /
  platform /
  organizations /
  CreateOrganizationDialog.tsx /
  pages /
  dashboard /
  platform /
  organizations /
  UpdateStatusDialog.tsx /
  pages /
  dashboard /
  platform /
  organizations /
  DeleteConfirmDialog.tsx /
  pages /
  dashboard /
  platform /
  organizations /
  ManageMembersDialog.tsx /
  pages /
  dashboard /
  platform /
  organizations /
  ViewOrganizationDialog.tsx;
```

### Backend Endpoints

```typescript
// Get all organizations (SuperAdmin/Admin)
GET /api/v1/organizations/all

// Create for client (SuperAdmin/Admin)
POST /api/v1/organizations/create-for-client

// Update status (SuperAdmin/Admin)
PATCH /api/v1/organizations/:id/status

// Delete permanently (SuperAdmin only)
DELETE /api/v1/organizations/:id/permanent

// Get members
GET /api/v1/organizations/:id/members

// Add member
POST /api/v1/organizations/:id/members

// Update member
PATCH /api/v1/organizations/:id/members/:userId

// Remove member
DELETE /api/v1/organizations/:id/members/:userId
```

---

## 🎨 UI/UX Features

### Action Menu (Dropdown)

```
┌─────────────────────────┐
│ Actions                 │
├─────────────────────────┤
│ 👁️  View Details        │ (All)
│ 👥 Manage Members       │ (SuperAdmin/Admin)
├─────────────────────────┤
│ 🚫 Suspend              │ (SuperAdmin/Admin, if active)
│ ✅ Activate             │ (SuperAdmin/Admin, if suspended)
├─────────────────────────┤
│ 🗑️  Delete              │ (SuperAdmin only)
└─────────────────────────┘
```

### Permission-Based Rendering

- Actions not available to user role are **hidden** (not just disabled)
- Toast notifications show error if user tries unauthorized action
- Access denied page shows for non-platform admins

---

## 🔒 Security Features

### Permission Checks

1. **Frontend Level**

   - `usePermission` hook checks user role
   - UI elements conditionally rendered
   - Actions validated before execution

2. **Backend Level**
   - `authorize()` middleware validates role
   - Controller methods check permissions
   - Database operations protected

### Error Handling

```typescript
// Permission denied
toast.error("You don't have permission to delete organizations");

// Action failed
toast.error("Failed to update organization status");

// Success
toast.success("Organization status updated successfully");
```

---

## 📊 Organization Status Flow

```
┌──────────┐
│   Trial  │ ──> Initial creation
└────┬─────┘
     │
     ├──> Upgrade Plan ──> Active
     │
     └──> Trial Expires ──> Suspended
                              │
                              ├──> Admin Activates ──> Active
                              │
                              └──> Delete (SuperAdmin)
```

---

## 🧪 Testing Checklist

### SuperAdmin Actions

- [ ] Can view all organizations
- [ ] Can create new organization
- [ ] Can suspend active organization
- [ ] Can activate suspended organization
- [ ] Can delete any organization
- [ ] Can manage members of any organization

### Admin Actions

- [ ] Can view all organizations
- [ ] Can create new organization
- [ ] Can suspend active organization
- [ ] Can activate suspended organization
- [ ] Cannot see delete option
- [ ] Can manage members of any organization

### Non-Platform Users

- [ ] See "Access Denied" when trying to access page
- [ ] Redirected appropriately

---

## 🚀 Usage Example

### Login as SuperAdmin

```bash
Email: superadmin@teammanagement.com
Password: superadmin123
```

### Navigate to Organizations

```
Dashboard → Platform → Organizations
```

### Perform Actions

1. **View**: Click any organization row → View details
2. **Manage Members**: Actions menu → Manage Members
3. **Suspend**: Actions menu → Suspend (if active)
4. **Delete**: Actions menu → Delete → Confirm

---

## 📝 Notes

- All actions are logged for audit purposes
- Deletion is permanent - no recovery option
- Suspended organizations retain all data
- Members receive email notifications for status changes
- Platform analytics are updated in real-time

---

## 🔗 Related Documentation

- `/hooks/usePermission.ts` - Permission system
- `/redux/features/platform/platformApi.ts` - API endpoints
- Backend: `/modules/organization/organization.service.ts` - Business logic
- Backend: `/modules/organization/organization.routes.ts` - Route definitions
