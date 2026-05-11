// Type Imports
import type { Locale } from '@config/i18n'

// Component Imports
import Providers from '@shared/components/Providers'
import BlankLayout from '@ui/layout/BlankLayout'
import NotFound from '@/views/NotFound'

// Config Imports
import { i18n } from '@config/i18n'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

const NotFoundPage = async (props: { params: Promise<{ lang: Locale }> }) => {
  const params = await props.params

  // Vars
  const direction = i18n.langDirection[params.lang]
  const mode = await getServerMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
