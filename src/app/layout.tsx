// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@config/i18n'

// Component Imports

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'TrooAssess Pro',
  description: 'TrooAssess Pro '
}

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  return (
      <html id='__next' suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          {children}
        </body>
      </html>
  )
}

export default RootLayout
