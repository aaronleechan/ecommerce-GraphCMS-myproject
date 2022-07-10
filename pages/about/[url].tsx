import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps } from '@graphcommerce/next-ui'
import { Container } from '@mui/material'
import { GetStaticPaths } from 'next'
import { LayoutFull, LayoutFullProps } from '../../components'
import { DefaultPageDocument, DefaultPageQuery } from '../../graphql/DefaultPage.gql'
import { PagesStaticPathsDocument } from '../../graphql/PagesStaticPaths.gql'
import { graphqlSsrClient, graphqlSharedClient } from '../../lib/graphql/graphqlSsrClient'

type Props = DefaultPageQuery
type RouteProps = { url: string }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<LayoutFullProps, Props, RouteProps>

function AboutUs({ pages }: Props) {
  const title = pages?.[0].title ?? ''

  return <Container>About Us {title}</Container>
}

AboutUs.pageOptions = {
  Layout: LayoutFull,
} as PageOptions

export default AboutUs

export const getStaticPaths: GetPageStaticPaths = async (context) => {
  const { locales = [] } = context
  // if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

  const path = async (locale: string) => {
    const client = graphqlSharedClient(locale)
    const { data } = await client.query({
      query: PagesStaticPathsDocument,
      variables: {
        first: 10,
        urlStartsWith: 'about',
      },
    })
    return data.pages.map((page) => ({
      params: { url: page.url.split('/').slice(1)[0] },
      locale,
    }))
  }
  const paths = (await Promise.all(locales.map(path))).flat(1)
  // console.log(paths)
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
      url: `about/${params?.url}`,
      rootCategory: (await conf).data.storeConfig?.root_category_uid ?? '',
    },
  })
  // if (!(await page).data.pages?.[0]) return { notFound: true }
  return {
    props: {
      ...(await page).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
