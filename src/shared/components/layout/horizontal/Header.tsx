'use client'

// Type Imports
import type { getDictionary } from '@shared/utils/getDictionary'

// Component Imports
import Navigation from './Navigation'
import NavbarContent from './NavbarContent'
import Navbar from '@ui/layout/components/horizontal/Navbar'
import LayoutHeader from '@ui/layout/components/horizontal/Header'

// Hook Imports
import useHorizontalNav from '@ui/menu/hooks/useHorizontalNav'

const Header = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <>
      <LayoutHeader>
        <Navbar>
          <NavbarContent />
        </Navbar>
        {!isBreakpointReached && <Navigation dictionary={dictionary} />}
      </LayoutHeader>
      {isBreakpointReached && <Navigation dictionary={dictionary} />}
    </>
  )
}

export default Header
