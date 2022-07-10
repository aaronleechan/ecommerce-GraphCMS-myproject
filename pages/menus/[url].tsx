import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { Container } from '@mui/system'
import { GetStaticPaths } from 'next'
import { LayoutFull, LayoutFullProps, RowRenderer } from '../../components'
import { DefaultPageDocument, DefaultPageQuery } from '../../graphql/DefaultPage.gql'
import { PagesStaticPathsDocument } from '../../graphql/PagesStaticPaths.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import { GetStaticProps } from '@graphcommerce/next-ui'

type Props = DefaultPageQuery
type RouteProps = { url: string }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<LayoutFullProps, Props, RouteProps>

function MenuItem({ pages }: Props) {
  console.log({ ' This is Menus url ': pages })

  return (
    <Container>
      Menu Item 123
      {pages?.[0] && <RowRenderer content={pages?.[0].content} />}
    </Container>
  )
}

MenuItem.pageOptions = {
  Layout: LayoutFull,
} as PageOptions

export default MenuItem

export const getStaticPaths: GetPageStaticPaths = async (context) => {
  const { locales = [] } = context
  const path = async (locale: string) => {
    const client = graphqlSharedClient(locale)
    const { data } = await client.query({
      query: PagesStaticPathsDocument,
      variables: {
        first: 10,
        urlStartsWith: 'menus',
      },
    })
    return data.pages.map((page) => ({
      params: { url: page.url.split('/').slice(1)[0] },
      locale,
    }))
  }

  const paths = (await Promise.all(locales.map(path))).flat(1)

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetPageStaticProps = async (context) => {
  const { locale, params } = context
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)

  const conf = client.query({ query: StoreConfigDocument })
  const page = staticClient.query({
    query: DefaultPageDocument,
    variables: {
      url: `menus/${params?.url}`,
      rootCategory: (await conf).data.storeConfig?.root_category_uid ?? '',
    },
  })

  return {
    props: {
      ...(await page).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
