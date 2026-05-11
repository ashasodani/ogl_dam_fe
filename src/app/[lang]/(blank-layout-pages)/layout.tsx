// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@config/i18n'

// Component Imports
import Providers from '@shared/components/Providers'
import BlankLayout from '@ui/layout/BlankLayout'

// Config Imports
import { i18n } from '@config/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType & {
  params: Promise<{ lang: Locale }>
}

const Layout = async (props: Props) => {
  const params = await props.params
  const { children } = props

  // Vars
  const direction = i18n.langDirection[params.lang]
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
