# Team Management App

> A comprehensive team management solution with hierarchical approval workflows, built with React and TypeScript.

## 🎯 Overview

This application streamlines team organization and member management through an intuitive interface. It implements a structured approval process where teams and members require validation from both managers and directors before finalization, ensuring proper oversight and accountability.

## ✨ Key Features

### Team Management
- **CRUD Operations**: Create, read, update, and delete teams with full validation
- **Drag & Drop Ordering**: Reorganize teams with intuitive drag-and-drop functionality
- **Bulk Operations**: Select and delete multiple teams efficiently
- **Search & Filter**: Real-time search across team names, descriptions, and member lists

### Member Management
- **Inline Editing**: Edit member details directly within the team view
- **Dynamic Addition**: Add or remove members without page reloads
- **Individual Control**: Manage each member with dedicated actions

### Approval Workflow
- **Three-State System**: Each team tracks approval from both Manager and Director
  - ✅ Approved (1)
  - ⏳ Pending (0)
  - ❌ Rejected (-1)
- **Visual Indicators**: Color-coded checkboxes show approval status at a glance
- **Hierarchical Control**: Separate approval levels for different management tiers

### User Experience
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Toast Notifications**: Real-time feedback for all operations
- **Confirmation Dialogs**: Prevents accidental data loss with confirmation prompts
- **Loading States**: Clear visual feedback during API operations

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with modern hooks |
| **TypeScript** | Type-safe development |
| **Redux Toolkit** | Predictable state management |
| **RTK Query** | Efficient data fetching and caching |
| **lodash** | Optimized utility functions (debounce) |

## 📁 Project Architecture

```
src/
├── components/              # Shared UI components
│   ├── ConfirmDialog.tsx   # Modal confirmation dialogs
│   ├── Loader.tsx          # Loading spinner overlay
│   ├── Toast.tsx           # Notification system
│   ├── ThreeStateCheckbox.tsx  # Approval status control
│   └── TeamMemberRow.tsx   # Member row renderer
│
├── modules/
│   └── team/
│       ├── TeamForm.tsx    # Team creation/editing form
│       └── Teams.tsx       # Main teams list page
│
├── redux/
│   └── features/team/
│       └── teamApi.ts      # API endpoints & queries
│
├── styles/
│   └── teams.css           # Component styling
│
└── types/
    └── index.ts            # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd team-management-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start

# Application runs on http://localhost:3000
```

### Production Build

```bash
# Create optimized production build
npm run build

# Build output in /build directory
```

## 📦 Core Components

### `Teams.tsx`
Main dashboard displaying all teams with:
- Expandable rows showing team members
- Search functionality with debounced input
- Multi-select capabilities for bulk actions
- Drag-and-drop reordering interface
- Approval status management

### `TeamForm.tsx`
Form component for team creation/editing:
- Controlled form inputs with validation
- Dynamic member list management
- Error handling and display
- Confirmation before submission

### `ThreeStateCheckbox.tsx`
Custom checkbox implementing three-state logic:
- Visual representation of approval status
- Click handling for state transitions
- Integration with approval workflow

## 🔌 API Integration

The application uses **RTK Query** for all backend communications:

| Endpoint | Purpose |
|----------|---------|
| `useGetAllTeamsQuery` | Fetch all teams with members |
| `useCreateTeamMutation` | Create new team |
| `useUpdateTeamMutation` | Update existing team |
| `useDeleteTeamMutation` | Delete single team |
| `useBulkDeleteTeamsMutation` | Delete multiple teams |
| `useUpdateApprovalStatusMutation` | Change approval status |
| `useUpdateTeamOrderMutation` | Save drag-drop order |
| `useUpdateMemberMutation` | Edit member information |
| `useDeleteMemberMutation` | Remove team member |

### Benefits of RTK Query
- **Automatic Caching**: Reduces unnecessary API calls
- **Optimistic Updates**: Instant UI feedback
- **Error Handling**: Centralized error management
- **Loading States**: Built-in loading indicators

## 📝 Data Models

```typescript
interface IMember {
  _id?: string;      // Unique identifier
  name: string;      // Member name
}

interface ITeam {
  _id?: string;           // Unique identifier
  name: string;           // Team name
  description: string;    // Team description
  status: "0" | "1" | "-1";           // Team status
  managerApproved: "0" | "1" | "-1";  // Manager approval
  directorApproved: "0" | "1" | "-1"; // Director approval
  members: IMember[];     // Team members array
}
```

## 💡 Best Practices

### Development Guidelines
- **Type Safety**: Always define TypeScript interfaces for data structures
- **Form Validation**: Validate all inputs before API submission
- **User Confirmation**: Show dialogs before destructive operations
- **Separation of Concerns**: Keep UI state separate from API state
- **Debouncing**: Use debounce for search inputs to optimize performance

### Code Quality
- Use functional components with hooks
- Follow React best practices for performance
- Maintain consistent naming conventions
- Write reusable components
- Keep components focused and single-purpose

## 🎯 Conclusion

The **Team Management App** represents a modern approach to organizational team coordination, combining intuitive user experience with robust technical architecture. By implementing a hierarchical approval workflow, it ensures proper oversight while maintaining operational efficiency.

### Key Achievements

✅ **Type-Safe Architecture**: Full TypeScript coverage eliminates runtime errors  
✅ **Efficient State Management**: RTK Query reduces boilerplate and optimizes performance  
✅ **Approval Workflow**: Three-state system provides clear accountability  
✅ **User-Centric Design**: Responsive, accessible interface with real-time feedback  
✅ **Scalable Foundation**: Built with enterprise patterns for future growth  

### Future Roadmap

🚀 **Phase 1** (Q1 2025)
- Role-based access control (RBAC)
- Team member profiles with avatars
- Activity log and audit trail

🚀 **Phase 2** (Q2 2025)
- Real-time collaboration with WebSockets
- Email notifications for approval requests
- Advanced analytics dashboard

🚀 **Phase 3** (Q3 2025)
- Integration with Slack/Teams
- Export reports (PDF/Excel)

### Why Choose This App?

In today's fast-paced business environment, effective team management is crucial. This application doesn't just track teams—it streamlines the entire approval process, reduces administrative overhead, and provides transparency at every level. Whether you're managing a small startup or a large enterprise, this solution scales with your needs.

