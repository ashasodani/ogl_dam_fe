// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@shared/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  {
    label: 'Dashboard',
    icon: 'ri-home-smile-line',
    href: '/dashboards/crm'
  },
  {
    label: 'Candidate Management',
    isSection: true,
    children: [
      {
        label: 'Candidates',
        icon: 'ri-user-line',
        children: [
          {
            label: 'List',
            href: '/apps/candidate/list'
          },
          {
            label: 'Create',
            href: '/apps/candidate/create'
          }
        ]
      },
      {
        label: 'Users',
        icon: 'ri-user-line',
        children: [
          {
            label: 'List',
            href: '/apps/user/list'
          },
          {
            label: 'View',
            href: '/apps/user/view'
          }
        ]
      },
      {
        label: 'Roles & Permissions',
        icon: 'ri-lock-2-line',
        children: [
          {
            label: 'Roles',
            href: '/apps/roles'
          },
          {
            label: 'Permissions',
            href: '/apps/permissions'
          }
        ]
      }
    ]
  },
  {
    label: 'Forms & Tables',
    isSection: true,
    children: [
      {
        label: 'Form Layouts',
        icon: 'ri-layout-4-line',
        href: '/forms/form-layouts'
      },
      {
        label: 'Form Validation',
        icon: 'ri-checkbox-multiple-line',
        href: '/forms/form-validation'
      },
      {
        label: 'React Table',
        icon: 'ri-table-alt-line',
        href: '/react-table'
      }
    ]
  },
  {
    label: 'Pages',
    isSection: true,
    children: [
      {
        label: 'Account Settings',
        icon: 'ri-settings-line',
        href: '/pages/account-settings'
      },
      {
        label: 'User Profile',
        icon: 'ri-user-line',
        href: '/pages/user-profile'
      },
      {
        label: 'Miscellaneous',
        icon: 'ri-more-line',
        children: [
          {
            label: 'Not Found (404)',
            href: '/pages/misc/404-not-found',
            target: '_blank'
          },
          {
            label: 'Not Authorized (401)',
            href: '/pages/misc/401-not-authorized',
            target: '_blank'
          }
        ]
      }
    ]
  }
]

export default verticalMenuData
