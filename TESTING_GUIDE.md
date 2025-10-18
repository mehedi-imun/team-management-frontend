# Frontend Testing Guide 🧪

**Complete Manual Testing Workflow**

---

## 🎯 Pre-Testing Setup

### 1. Start Backend Server

```bash
cd team-management-backend
npm run dev
# Should start on http://localhost:5000
```

### 2. Start Frontend Dev Server

```bash
cd team-management-frontend
npm run dev
# Should start on http://localhost:5173
```

### 3. Database Setup

```bash
# Ensure MongoDB is running
# Ensure Redis is running (if used)

# Optional: Reset database for clean testing
cd team-management-backend
npm run reset-db
npm run seed:admin
```

---

## 📋 Test Scenarios

### ✅ Scenario 1: Invitation Acceptance Flow

**Objective:** Test new user invitation and account creation

**Steps:**

1. Login as Admin/OrgOwner
2. Go to Teams page
3. Click "Add Member" on any team
4. Enter email: `testuser@example.com`
5. Select role: "Member"
6. Click "Send Invitation"
7. Check backend console for invitation link
8. Copy token from logs or database
9. Open new incognito window
10. Navigate to: `http://localhost:5173/accept-invitation/{TOKEN}`

**Expected Results:**

- ✅ Page shows invitation details (email, org, team, role)
- ✅ Name field is empty
- ✅ Password field shows/hide toggle works
- ✅ Password requirements list appears
- ✅ Typing password shows strength meter
- ✅ Weak password shows red, strong shows green
- ✅ Submitting without name shows error
- ✅ Submitting with weak password shows error
- ✅ Valid submission auto-logs in and redirects to dashboard
- ✅ User appears in team members list

**Edge Cases:**

- ❌ Invalid token → Shows "Invalid Invitation" page
- ❌ Expired token → Shows "Invitation Expired" page
- ❌ Already used token → Shows error

---

### ✅ Scenario 2: Force Password Change Flow

**Objective:** Test temporary password enforcement

**Steps:**

1. Login as Admin/SuperAdmin
2. Go to Platform → Organizations
3. Click "Create Organization"
4. Fill form:
   - Name: "Test Org 2"
   - Slug: "test-org-2"
   - Owner Email: "owner2@example.com"
   - Owner Name: "Test Owner 2"
5. Submit
6. Check backend logs for temporary password
7. Logout
8. Login with:
   - Email: owner2@example.com
   - Password: {temp_password_from_logs}

**Expected Results:**

- ✅ Login successful
- ✅ Immediately redirects to `/change-password`
- ✅ Cannot access dashboard without changing password
- ✅ Shows welcome message with user name
- ✅ New password field has requirements checklist
- ✅ Confirm password field validates matching
- ✅ Non-matching passwords show error
- ✅ Weak password rejected
- ✅ Strong password accepted
- ✅ Success message appears
- ✅ Auto-redirects to dashboard after 2 seconds
- ✅ Can now access all features
- ✅ Logout and re-login doesn't force change again

**Edge Cases:**

- ❌ Manual navigation to `/dashboard` → Redirects back to `/change-password`
- ❌ Browser back button → Stays on change password page
- ✅ After change, can access all routes normally

---

### ✅ Scenario 3: Trial Status Banner

**Objective:** Test trial countdown display

**Prerequisites:**

- Create organization with trial (14 days default)
- Or manually set `trialEndsAt` in database

**Steps:**

1. Login as OrgOwner (trial organization)
2. Navigate to Dashboard → Organization → Overview

**Expected Results (Based on Days Left):**

**14+ Days Left:**

- ✅ Banner shows with BLUE color
- ✅ Message: "You have X days left in your trial period."
- ✅ No urgent warnings
- ✅ Upgrade button may not show

**7 Days Left:**

- ✅ Banner shows with ORANGE color
- ✅ Message: "7 days left in your trial..."
- ✅ "Upgrade Now" button appears

**3 Days Left:**

- ✅ Banner shows with RED color
- ✅ Message: "Only 3 days left in your trial!"
- ✅ "Upgrade Now" button prominent

**1 Day Left:**

- ✅ Banner shows with RED color (darker)
- ✅ Message: "Only 1 day left in your trial!"
- ✅ Urgent styling

**0 Days (Expired):**

- ✅ Banner shows with GRAY color
- ✅ Message: "Your trial has expired. Upgrade now..."
- ✅ All create/invite buttons disabled

**Not on Trial:**

- ✅ Banner doesn't appear
- ✅ Active subscription shows no warnings

---

### ✅ Scenario 4: Feature Blocking (Trial Expired)

**Objective:** Test feature restrictions when trial expires

**Prerequisites:**

- Organization with expired trial
- OR manually set `subscriptionStatus: "past_due"` in DB

**Steps:**

1. Login as OrgOwner (expired trial)
2. Go to Teams page

**Expected Results:**

- ✅ Trial banner shows "EXPIRED" message (gray)
- ✅ "Create Team" button is DISABLED
- ✅ Lock icon (🔒) appears on button
- ✅ Clicking button shows modal
- ✅ Modal title: "Trial Expired"
- ✅ Modal shows list of blocked features:
  - Create new teams
  - Invite new members
  - Advanced analytics
  - Custom branding
  - Priority support
- ✅ "Upgrade Now" button in modal
- ✅ Clicking upgrade → Navigate to `/dashboard/organization/billing?upgrade=true`
- ✅ Close modal → Returns to teams page

**Test Member Invitation:** 3. Go to any existing team 4. Click "Add Member" button

**Expected Results:**

- ✅ Button is disabled OR shows trial modal
- ✅ Cannot send invitations while trial expired

---

### ✅ Scenario 5: Regular Password Change

**Objective:** Test user-initiated password change

**Steps:**

1. Login as any user
2. Go to Settings (if available) OR create password change page
3. Fill form:
   - Current Password: {your_current_password}
   - New Password: NewSecure123!
   - Confirm Password: NewSecure123!
4. Submit

**Expected Results:**

- ✅ Current password validation works
- ✅ Wrong current password shows error
- ✅ New password strength meter shows
- ✅ Matching validation works
- ✅ Success message appears
- ✅ Password changed in database
- ✅ Can logout and login with new password

**Note:** This feature may need a settings page if not already created.

---

### ✅ Scenario 6: Trial-to-Active Upgrade

**Objective:** Test subscription upgrade flow

**Steps:**

1. Login as OrgOwner (on trial)
2. Click "Upgrade Now" from trial banner
3. Should navigate to billing page
4. Select a plan (if Stripe integration ready)
5. Complete payment (use Stripe test cards)

**Expected Results:**

- ✅ Redirects to `/dashboard/organization/billing?upgrade=true`
- ✅ Upgrade query parameter pre-selects plan
- ✅ After successful payment:
  - subscriptionStatus changes to "active"
  - Trial banner disappears
  - All features unlock
  - Create Team button enabled

**Note:** Full Stripe integration testing requires test mode setup.

---

## 🐛 Bug Testing Checklist

### Password Validation

- [ ] Empty password → Error shown
- [ ] 7 chars → Error (min 8)
- [ ] No uppercase → Error
- [ ] No lowercase → Error
- [ ] No number → Error
- [ ] No special char → Error
- [ ] Valid password → Green checkmark on all requirements

### Invitation Token

- [ ] Token with spaces → Handled
- [ ] Token with special chars → Handled
- [ ] Expired token (>7 days) → Shows expired page
- [ ] Already used token → Error message

### Trial Logic

- [ ] Future trial date → Shows correct days
- [ ] Past trial date → Shows expired
- [ ] Null trial date → No banner (not on trial)
- [ ] Invalid trial status → Handled gracefully

### Navigation

- [ ] Back button doesn't break flow
- [ ] Direct URL access works
- [ ] Refresh page maintains state
- [ ] Logout clears auth state

---

## 🔍 Network Testing

### API Calls to Monitor

**Login:**

```
POST /api/v1/auth/login
Response should include:
{
  data: {
    user: { mustChangePassword: true/false },
    accessToken: "...",
    refreshToken: "...",
    mustChangePassword: true/false  // Top level
  }
}
```

**Trial Status:**

```
GET /api/v1/trial/status
Response:
{
  data: {
    isOnTrial: true,
    daysLeft: 7,
    trialEndsAt: "2025-10-26T...",
    hasExpired: false,
    canAccessFeatures: true,
    subscriptionStatus: "trialing"
  }
}
```

**Validate Invitation:**

```
GET /api/v1/invitations/validate?token=abc123
Response:
{
  data: {
    email: "test@example.com",
    organizationName: "Test Org",
    teamName: "Dev Team",
    role: "Member",
    expiresAt: "...",
    isExpired: false
  }
}
```

**Accept Invitation:**

```
POST /api/v1/invitations/accept
Body: { token, name, password }
Response:
{
  data: {
    user: {...},
    accessToken: "...",
    refreshToken: "..."
  }
}
```

---

## 📱 Responsive Testing

### Desktop (1920x1080)

- [ ] Trial banner fits full width
- [ ] Password fields properly aligned
- [ ] Modals centered
- [ ] Buttons accessible

### Tablet (768px)

- [ ] Trial banner responsive
- [ ] Forms stack vertically
- [ ] Modals adjust size
- [ ] Touch targets adequate

### Mobile (375px)

- [ ] All text readable
- [ ] Buttons not too small
- [ ] Forms usable
- [ ] No horizontal scroll

---

## 🎨 Visual Testing

### Dark Mode

- [ ] All components support dark mode
- [ ] Text contrast sufficient
- [ ] Icons visible
- [ ] Borders visible

### Light Mode

- [ ] All colors appropriate
- [ ] No washed out text
- [ ] Professional appearance

### Accessibility

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color blind friendly (don't rely only on color)

---

## ⚡ Performance Testing

### Load Times

- [ ] Invitation page loads < 1s
- [ ] Password change page loads < 1s
- [ ] Trial status fetches < 500ms
- [ ] No memory leaks on navigation

### API Caching

- [ ] Trial status cached (don't refetch on every component mount)
- [ ] Invalidated on relevant mutations
- [ ] Teams list cached properly

---

## 🔐 Security Testing

### Input Validation

- [ ] SQL injection attempts blocked (backend)
- [ ] XSS attempts sanitized
- [ ] CSRF protection (cookies only)
- [ ] Rate limiting on endpoints

### Authentication

- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected
- [ ] Must be logged in for protected routes
- [ ] Password never logged or exposed

---

## 📊 Test Results Template

```markdown
## Test Session: [Date]

**Tester:** [Name]
**Environment:** [Local/Staging/Production]

### Scenario 1: Invitation Acceptance

- Status: ✅ PASS / ❌ FAIL
- Notes: [Any issues found]

### Scenario 2: Force Password Change

- Status: ✅ PASS / ❌ FAIL
- Notes: [Any issues found]

### Scenario 3: Trial Banner

- Status: ✅ PASS / ❌ FAIL
- Notes: [Any issues found]

### Scenario 4: Feature Blocking

- Status: ✅ PASS / ❌ FAIL
- Notes: [Any issues found]

### Bugs Found:

1. [Bug description]
2. [Bug description]

### Recommendations:

1. [Improvement suggestion]
2. [Improvement suggestion]
```

---

## 🚀 Pre-Deployment Checklist

- [ ] All test scenarios passed
- [ ] No console errors
- [ ] No network errors (404, 500)
- [ ] Build successful (npm run build)
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Database migrations run
- [ ] Redis connected (if used)
- [ ] Email service configured
- [ ] Cron jobs scheduled

---

**Happy Testing! 🎉**
