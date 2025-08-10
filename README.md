# Dashboard POS System

A comprehensive Point of Sale (POS) system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Multi-Branch Management System
- **Owner Dashboard**: Overview of all branches with key metrics
- **Owner Stats**: Aggregated statistics and charts across all branches
- **Branch Management**: Create, edit, view, and delete branches
- **Branch Detail View**: Individual branch dashboard with tabs for different aspects

### Core POS Features
- **Dashboard**: Main dashboard with overview statistics and charts
- **Inventory Management**: Track stock levels, suppliers, and purchases
- **Billing System**: Create invoices with customer and staff credit options
- **Sales Register**: Generate reports and track sales by date/category
- **Staff Management**: Manage employees, salaries, and permissions
- **Customer Management**: Track customer credit and payment history
- **Restaurant Management**: Menu items, orders, and table management

### Authentication & Authorization
- **Unified Login**: Single login for all user types
- **Role-Based Access**: Different permissions for different user roles
- **Staff Check-in System**: Dedicated interface for staff attendance

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Main dashboard
│   ├── owner/            # Owner-specific pages
│   │   ├── page.tsx      # Owner dashboard
│   │   ├── stats/        # Owner statistics
│   │   └── branch/       # Branch management
│   │       ├── create/   # Create new branch
│   │       └── [id]/     # Branch detail/edit
│   ├── inventory/        # Inventory management
│   ├── billing/          # Billing system
│   ├── staff-management/ # Staff management
│   ├── customer-management/ # Customer management
│   ├── restaurant/       # Restaurant management
│   └── staff-checkin/    # Staff attendance
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Custom components
├── contexts/              # React contexts
│   └── auth-context.tsx  # Authentication context
└── lib/                   # Utility functions
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Multi-Branch Architecture

The system now supports multiple branches under a single owner:

### Owner Level
- **Owner Dashboard** (`/owner`): Lists all branches with key metrics
- **Owner Stats** (`/owner/stats`): Aggregated data and charts
- **Branch Management**: Create, edit, and delete branches

### Branch Level
- **Branch Detail** (`/owner/branch/[id]`): Individual branch dashboard
- **Branch Edit** (`/owner/branch/[id]/edit`): Modify branch information
- **Branch Create** (`/owner/branch/create`): Add new branches

### Navigation
- Owner pages are accessible from the main sidebar
- Each branch has its own detailed view
- Seamless navigation between owner and branch levels

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Icons**: Tabler Icons
- **Charts**: Recharts
- **State Management**: React Context API
- **Database**: PostgreSQL (planned)
- **ORM**: TypeORM (planned)

## Development Status

- ✅ Multi-branch system architecture
- ✅ Owner dashboard and statistics
- ✅ Branch management (CRUD operations)
- ✅ Core POS features
- ✅ Authentication system
- ✅ Staff management
- ✅ Customer management
- ✅ Restaurant management
- 🔄 Backend API integration (in progress)
- 🔄 Database setup (planned)

## Contributing

This is a work-in-progress project. The current focus is on completing the multi-branch system and integrating the backend API.
