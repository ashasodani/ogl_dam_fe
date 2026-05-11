# 📁 TrooAssessPro Frontend - Folder Structure

## 🎯 Organized & Clean Architecture

```
src/
├── 🏗️ app/                    # Next.js App Router
│   ├── [lang]/                # Internationalization routes
│   ├── api/                   # API routes
│   └── server/                # Server actions
│
├── 🎨 assets/                 # Static assets
│   ├── iconify-icons/         # Icon bundles
│   └── svg/                   # SVG files
│
├── ⚙️ config/                 # Configuration files
│   ├── i18n.ts               # Internationalization config
│   ├── primaryColorConfig.ts  # Theme colors
│   └── themeConfig.ts         # Theme settings
│
├── 🔧 core/                   # Core framework components
│   ├── components/            # Reusable core components
│   ├── hooks/                 # Core hooks
│   ├── styles/                # Core styling
│   ├── theme/                 # MUI theme configuration
│   ├── svg/                   # Core SVG components
│   └── utils/                 # Core utilities
│
├── 🗄️ fake-db/               # Mock database (temporary)
│   ├── apps/                  # App-specific mock data
│   └── pages/                 # Page-specific mock data
│
├── 🚀 features/               # Feature-based modules
│   ├── auth/                  # Authentication
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   │
│   ├── candidate/             # 🎯 MAIN FEATURE
│   │   ├── create/            # Candidate creation
│   │   └── list/              # Candidate listing
│   │
│   ├── dashboard/             # Dashboard views
│   │   └── crm/               # CRM dashboard
│   │
│   └── user/                  # User management
│       ├── permissions/       # Permission management
│       ├── roles/             # Role management
│       └── user/              # User CRUD
│
├── 🗃️ prisma/                # Database schema & migrations
│   ├── migrations/
│   ├── dev.db
│   └── schema.prisma
│
├── 🤝 shared/                 # Shared across features
│   ├── components/            # Shared UI components
│   ├── contexts/              # React contexts
│   ├── data/                  # Static data & navigation
│   ├── forms/                 # Form components
│   ├── hocs/                  # Higher-order components
│   ├── hooks/                 # Shared hooks
│   ├── libs/                  # Third-party lib configs
│   ├── pages/                 # Generic pages
│   ├── react-table/           # Table components
│   ├── services/              # API services
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
│
├── 🏪 store/                  # Redux store
│   ├── slices/                # Redux slices
│   ├── index.ts               # Store configuration
│   └── ReduxProvider.tsx      # Redux provider
│
└── 🎨 ui/                     # UI framework
    ├── layout/                # Layout components
    │   ├── components/        # Layout building blocks
    │   ├── styles/            # Layout styles
    │   └── utils/             # Layout utilities
    │
    └── menu/                  # Navigation system
        ├── components/        # Menu components
        ├── contexts/          # Menu contexts
        ├── hooks/             # Menu hooks
        ├── styles/            # Menu styles
        └── utils/             # Menu utilities
```

## 🎯 Key Benefits

### ✅ **Feature-Based Organization**
- Each feature (candidate, user, auth) has its own folder
- Easy to locate and maintain feature-specific code
- Clear separation of concerns

### ✅ **Shared Resources**
- Common components, hooks, and utilities in `/shared`
- Reusable across all features
- Prevents code duplication

### ✅ **Core Framework**
- Essential framework code in `/core`
- Theme, styling, and base components
- Foundation for the entire app

### ✅ **Clean UI Layer**
- Layout and menu systems in `/ui`
- Separation of UI framework from business logic
- Consistent design system

### ✅ **Centralized Configuration**
- All configs in `/config`
- Easy to manage settings
- Environment-specific configurations

## 🔧 Path Mappings (tsconfig.json)

```json
{
  "@/*": ["./src/*"],
  "@core/*": ["./src/core/*"],
  "@ui/*": ["./src/ui/*"],
  "@shared/*": ["./src/shared/*"],
  "@features/*": ["./src/features/*"],
  "@config/*": ["./src/config/*"],
  "@store/*": ["./src/store/*"],
  "@assets/*": ["./src/assets/*"]
}
```

## 🎯 Usage Examples

```typescript
// Import from features
import CandidateList from '@features/candidate/list'
import Login from '@features/auth/Login'

// Import from shared
import { Button } from '@shared/components/ui'
import { useApi } from '@shared/hooks'

// Import from core
import { useSettings } from '@core/hooks'
import { theme } from '@core/theme'

// Import from UI
import { VerticalLayout } from '@ui/layout'
import { Menu } from '@ui/menu'
```

## 🚀 Next Steps

1. **Focus on Candidate Feature** - Your main business logic
2. **Customize Dashboard** - Tailor CRM dashboard for your needs  
3. **Extend User Management** - Add role-based permissions
4. **Clean Up Unused** - Remove any remaining unused components

This structure scales well and keeps your candidate management system organized! 🎉