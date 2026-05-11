// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@config/i18n'

// Component Imports
import Providers from '@shared/components/Providers'
import CandidateHeader from '@shared/components/layout/candidate/Header'
import Footer from '@shared/components/layout/horizontal/Footer'

// Config Imports
import { i18n } from '@config/i18n'

// Util Imports
import { getDictionary } from '@shared/utils/getDictionary'
import { getSystemMode } from '@core/utils/serverHelpers'

const CandidateDashboardLayout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const params = await props.params
  const { children } = props

  const direction = i18n.langDirection[params.lang]
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <div className="flex flex-col min-h-screen">
        <CandidateHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  )
}

export default CandidateDashboardLayout