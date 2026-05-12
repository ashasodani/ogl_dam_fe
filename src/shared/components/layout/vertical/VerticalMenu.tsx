// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@shared/utils/getDictionary'
import type { VerticalMenuContextProps } from '@ui/menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@ui/menu/vertical-menu'

// import { GenerateVerticalMenu } from '@shared/components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@ui/menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@ui/menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* <SubMenu label={dictionary['navigation'].user} icon={<i className='ri-user-line' />}>
          <MenuItem href={`/${locale}/apps/user/list`}>{dictionary['navigation'].list}</MenuItem>
          <MenuItem href={`/${locale}/apps/user/view`}>{dictionary['navigation'].view}</MenuItem>
        </SubMenu> */}
        {/* <SubMenu label={dictionary['navigation'].candidate} icon={<i className='ri-user-line' />}>
          <MenuItem href={`/${locale}/apps/candidate/list`}>{dictionary['navigation'].list}</MenuItem>
          <MenuItem href={`/${locale}/apps/candidate/create`}>{dictionary['navigation'].create}</MenuItem>
        </SubMenu> */}
        {/* <SubMenu label={dictionary['navigation'].test} icon={<i className='ri-user-line' />}>
          <MenuItem href={`/${locale}/apps/test/list`}>{dictionary['navigation'].list}</MenuItem>
          <MenuItem href={`/${locale}/apps/test/create`}>{dictionary['navigation'].create}</MenuItem>
        </SubMenu> */}
        {/* <SubMenu label={dictionary['navigation'].mcq} icon={<i className='ri-user-line' />}>
          <MenuItem href={`/${locale}/apps/mcqtest/list`}>{dictionary['navigation'].list}</MenuItem>
          <MenuItem href={`/${locale}/apps/mcqtest/create`}>{dictionary['navigation'].create}</MenuItem>
        </SubMenu> */}
        {/* <SubMenu label={dictionary['navigation'].rolesPermissions} icon={<i className='ri-lock-2-line' />}>
          <MenuItem href={`/${locale}/a pps/roles`}>{dictionary['navigation'].roles}</MenuItem>
          <MenuItem href={`/${locale}/apps/permissions`}>{dictionary['navigation'].permissions}</MenuItem>
        </SubMenu> */}

        <MenuItem href={`/${locale}/apps/candidate/list`} icon={<i className='ri-user-line' />}>
          {dictionary['navigation'].candidate}
        </MenuItem>
        <MenuItem href={`/${locale}/apps/imported/list`} icon={<i className='ri-download-line' />}>
          {dictionary['navigation'].imported}
        </MenuItem>
        <MenuItem href={`/${locale}/apps/test/list`} icon={<i className='ri-graduation-cap-line' />}>
          {dictionary['navigation'].test}
        </MenuItem>
        <MenuItem href={`/${locale}/apps/mcqtest/list`} icon={<i className='ri-graduation-cap-line' />}>
          {dictionary['navigation'].mcq}
        </MenuItem>
        <SubMenu label={dictionary['navigation'].rolesPermissions} icon={<i className='ri-lock-2-line' />}>
          <MenuItem href={`/${locale}/apps/roles`}>{dictionary['navigation'].roles}</MenuItem>
          <MenuItem href={`/${locale}/apps/roles/create`}>{dictionary['navigation'].create}</MenuItem>
          <MenuItem href={`/${locale}/apps/permissions`}>{dictionary['navigation'].permissions}</MenuItem>
        </SubMenu>
        <MenuItem href={`/${locale}/apps/settings`} icon={<i className='ri-settings-4-line' />}>
          {dictionary['navigation'].settings}
        </MenuItem>


        {/* <MenuItem icon={<i className="ri-code-box-line" />} href={`/${locale}/ide`}>{dictionary['navigation'].codeEditor}</MenuItem> */}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
