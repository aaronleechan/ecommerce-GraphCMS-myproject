// import { GoogleTagManagerNoScript } from '@graphcommerce/googletagmanager'
import { withLingui, LinguiDocumentProps } from '@graphcommerce/lingui-next'
import { EmotionCacheProps } from '@graphcommerce/next-ui'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

class Document extends NextDocument<EmotionCacheProps & LinguiDocumentProps> {
  render() {
    return (
      <Html>
        <Head>
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {this.props.emotionStyleTags}
          {this.props.linguiScriptTag}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default withLingui(Document, (locale) => import(`../locales/${locale}.po`))
