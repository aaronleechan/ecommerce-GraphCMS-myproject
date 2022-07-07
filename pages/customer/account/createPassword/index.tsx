import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useGoogleRecaptcha } from '@graphcommerce/googlerecaptcha'
import { ResetPasswordForm } from '@graphcommerce/magento-customer'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutOverlayHeader, LayoutTitle } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Container, Link, NoSsr, Button } from '@mui/material'
import router, { useRouter } from 'next/router'
import { LayoutOverlay, LayoutOverlayProps } from '../../../../components'
import { graphqlSharedClient } from '../../../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function CustomerAccountCreatePasswordPage() {
  useGoogleRecaptcha()
  const { token, success } = useRouter().query

  if (typeof token !== 'undefined' && success === 'undefined') return null

  return (
    <>
      <PageMeta title={i18n._(/* i18n */ 'Create new password')} metaRobots={['noindex']} />
      <LayoutOverlayHeader>
        <LayoutTitle size='small' component='span'>
          {!success ? (
            <Trans id='Set your new password' />
          ) : (
            <Trans id='You have now successfully reset your password' />
          )}
        </LayoutTitle>
      </LayoutOverlayHeader>
      <Box pt={4} pb={4}>
        {!success && (
          <Container maxWidth='sm'>
            <LayoutTitle>
              <Trans id='Set your new password' />
            </LayoutTitle>

            <Box textAlign='center'>
              <p>
                <Trans id='Fill in your new password, confirm it and click on the save button.' />
              </p>
            </Box>

            <ResetPasswordForm token={(token as string) ?? ''} />
          </Container>
        )}

        {success && (
          <Container>
            <LayoutTitle>
              <Trans id='You have now successfully reset your password' />
            </LayoutTitle>

            <Box textAlign='center'>
              <p>
                <Trans
                  id='You can now<0>sign in again</0>.'
                  components={{
                    0: <Link color='primary' href='/account/signin' underline='hover' />,
                  }}
                />
              </p>

              <Button onClick={() => router.back()} variant='pill' color='secondary' size='large'>
                <Trans id='Continue shopping' />
              </Button>
            </Box>
          </Container>
        )}
      </Box>
    </>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  overlayGroup: 'account-public',
  Layout: LayoutOverlay,
}
CustomerAccountCreatePasswordPage.pageOptions = pageOptions

export default CustomerAccountCreatePasswordPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })

  return {
    props: {
      apolloState: await conf.then(() => client.cache.extract()),
      variantMd: 'bottom',
      size: 'max',
      up: { href: '/account/signin', title: 'Sign in' },
    },
  }
}
