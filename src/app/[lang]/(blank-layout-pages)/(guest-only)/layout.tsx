// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@config/i18n'

// HOC Imports
import GuestOnlyRoute from '@shared/hocs/GuestOnlyRoute'

const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const params = await props.params

  const { children } = props

  return <GuestOnlyRoute lang={params.lang}>{children}</GuestOnlyRoute>
}

export default Layout
