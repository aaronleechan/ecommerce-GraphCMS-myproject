import { CartFab } from '@graphcommerce/magento-cart'
import { CustomerFab, CustomerMenuFabItem } from '@graphcommerce/magento-customer'
import { SearchLink } from '@graphcommerce/magento-search'
import { WishlistMenuFabItem } from '@graphcommerce/magento-wishlist'
import {
  DesktopNavActions,
  LayoutDefault,
  LayoutDefaultProps,
  PlaceholderFab,
  IconSvg,
  iconSearch,
  MenuFabSecondaryItem,
  iconCustomerService,
  DarkLightModeMenuSecondaryItem,
  MenuFabItem,
  iconHeart,
} from '@graphcommerce/next-ui'
import {CustomMenuFab} from './LayoutParts/CustomMenuFab'
import { Box, Fab } from '@mui/material'
import PageLink from 'next/link'
import { useRouter } from 'next/router'
import { DefaultPageQuery } from '../../graphql/DefaultPage.gql'
import { Footer } from './Footer'
import { Logo } from './Logo'
import { Trans } from '@lingui/react'

export type LayoutFullProps = Omit<
  DefaultPageQuery & Omit<LayoutDefaultProps, 'footer'>,
  'pages' | 'header' | 'cartFab' | 'menuFab'
>

export function LayoutFull(props: LayoutFullProps) {
  const { footer, menu = {}, children, ...uiProps } = props

  const router = useRouter()
  const menuItemsIncludeInMenu = menu?.items?.filter((items) => items?.include_in_menu === 1)

  return (
    <LayoutDefault
      {...uiProps}
      noSticky={router.asPath.split('?')[0] === '/'}
      header={
        <>
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
            pointerEvents: 'none',
          }}
        >
          <Logo />
        </Box>
          <DesktopNavActions>
            <PageLink href='/search' passHref>
            <Fab aria-label={`Search`} size='large' color='inherit'>
              <IconSvg src={iconSearch} size='large' />
            </Fab>
            </PageLink>
            <CustomerFab guestHref='/account/signin' authHref='/account' />
            {/* The placeholder exists because the CartFab is sticky but we want to reserve the space for the <CartFab /> */}
            <PlaceholderFab />
          </DesktopNavActions>
        </>
      }

      footer={<Footer footer={footer} />}
      cartFab={<CartFab />}
      menuFab={
        <CustomMenuFab
          search={
            <SearchLink href='/search' sx={{ width: '100%' }}>
              <Trans id='Search...' />
            </SearchLink>
          }
          secondary={[
            <CustomerMenuFabItem key='account' guestHref='/account/signin' authHref='/account'>
              <Trans id='Account' />
            </CustomerMenuFabItem>,
            <MenuFabSecondaryItem
              key='service'
              icon={<IconSvg src={iconCustomerService} size='medium' />}
              href='/service'
            >
              <Trans id='Customer Service' />
            </MenuFabSecondaryItem>,
            <WishlistMenuFabItem key='wishlist' icon={<IconSvg src={iconHeart} size='medium' />}>
              <Trans id='Wishlist' />
            </WishlistMenuFabItem>,
            <DarkLightModeMenuSecondaryItem key='darkmode' />,
          ]}
        >
          <MenuFabItem href='/'>
            <Trans id='Home' />
          </MenuFabItem>
          {menuItemsIncludeInMenu?.map((item) => {
            const highLight = item?.name?.toLowerCase().includes('sale')
              ? { textTransform: 'uppercase', letterSpacing: 0.3, color: 'primary.main' }
              : {}
            return (
              <MenuFabItem key={item?.uid} href={`/${item?.url_path}`} sx={highLight}>
                {item?.name}
              </MenuFabItem>
            )
          })}
          <MenuFabItem href='/blog'>
            <Trans id='Blog' />
          </MenuFabItem>
        </CustomMenuFab>
      }
    >
      {children}
    </LayoutDefault>
  )
}
