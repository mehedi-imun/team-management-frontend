# Team Management SaaS - Frontend

Multi-tenant team management system with role-based dashboards.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🛠️ Tech Stack

- React 18 + TypeScript + Vite
- Redux Toolkit + RTK Query
- React Router v6
- Shadcn/UI + Tailwind CSS
- React Hook Form + Zod
- Stripe Integration

## 📁 Structure

```
src/
├── pages/              # All pages
│   └── dashboard/      # Role-based dashboards
├── redux/              # State & API calls
│   └── features/       # RTK Query APIs
├── components/         # UI components
│   ├── ui/            # Shadcn components
│   └── layout/        # Sidebar, Navbar
├── hooks/             # Custom hooks
└── types/             # TypeScript types
```

## 👥 User Roles

| Role | Access |
|------|--------|
| **SuperAdmin** | Full system access |
| **Admin** | Manage all organizations |
| **OrgOwner** | Full org control + billing |
| **OrgAdmin** | Manage teams & members |
| **OrgMember** | View-only access |

## ✨ Features

### Authentication
- Login/Register/Password Reset
- JWT token management
- Protected routes

### Platform (Admin)
- View/manage all organizations
- User management
- Platform analytics

### Organization
- Team management
- Member invitations
- Role assignment
- Analytics dashboard

### Billing (OrgOwner)
- Stripe checkout
- Subscription management
- Plan upgrades
- Usage tracking

## 🎨 UI Components

Shadcn/UI library with Tailwind CSS:
- Forms, Tables, Dialogs
- Cards, Badges, Toasts
- Responsive layouts

## 🔐 Security

- Role-based access control (RBAC)
- Permission checks
- Protected routes
- Secure API calls

## 📊 State Management

- Redux Toolkit for global state
- RTK Query for API calls with caching
- Optimistic updates

## 🌐 Environment

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📱 Responsive Design

Mobile-first, responsive sidebar, adaptive layouts