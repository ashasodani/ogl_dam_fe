// Next Imports
import { headers } from 'next/headers'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@config/i18n'

// HOC Imports
import TranslationWrapper from '@shared/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@config/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'TrooAssess Pro',
  description: 'TrooAssess Pro'
}

const RootLayout = async (
  props: ChildrenType & { params: Promise<{ lang: Locale }> }
) => {
  const params = await props.params
  const { children } = props

  const headersList = await headers()
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection[params.lang]

  return (
    <html id='__next' lang={params.lang} dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        <TranslationWrapper headersList={headersList} lang={params.lang}>
          {children}
        </TranslationWrapper>
      </body>
    </html>
  )
}

export default RootLayout
