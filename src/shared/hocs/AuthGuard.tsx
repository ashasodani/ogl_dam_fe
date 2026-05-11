// Third-party Imports
// import { getServerSession } from 'next-auth'

// Type Imports
import { getCookie } from 'cookies-next'

import type { Locale } from '@config/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  // const session = await getServerSession()
  const isUserAuthorized = await getCookie('isUserAuthenticated')

  console.log('isUserAuthenticated', isUserAuthorized)

  return <>{isUserAuthorized ? children : <AuthRedirect lang={locale} />}</>
}
