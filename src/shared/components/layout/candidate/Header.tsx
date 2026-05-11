'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Component Imports
import Logo from '@shared/components/layout/shared/Logo'
import UserDropdown from '@shared/components/layout/shared/UserDropdown'
import LayoutHeader from '@ui/layout/components/horizontal/Header'
import Navbar from '@ui/layout/components/horizontal/Navbar'

// Util Imports
import { horizontalLayoutClasses } from '@ui/layout/utils/layoutClasses'
import { getLocalizedUrl } from '@shared/utils/i18n'

// Type Imports
import type { Locale } from '@config/i18n'

const CandidateHeader = () => {
  const { lang: locale } = useParams()

  return (
    <LayoutHeader>
      <Navbar>
        <div className={`${horizontalLayoutClasses.navbarContent} flex items-center justify-between gap-4 is-full`}>
          <div className='flex items-center gap-4'>
            <Link href={getLocalizedUrl('/', locale as Locale)}>
              <Logo />
            </Link>
          </div>
          <div className='flex items-center ml-auto'>
            <UserDropdown/> 
              </div>
            </div>
      </Navbar>
    </LayoutHeader>
  )
}

export default CandidateHeader