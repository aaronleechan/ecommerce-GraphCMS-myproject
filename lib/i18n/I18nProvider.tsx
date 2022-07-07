import { LinguiProvider, LinguiProviderProps } from '@graphcommerce/lingui-next'

type I18nProviderProps = Pick<LinguiProviderProps, 'locale' | 'children'>

/**
 * Reason for it to exist: We're loading the translations from a relative path, this a good thing.
 * This allows for easy overwriting of translations.
 *
 * We provide the loader and ssrLoader because we need to:
 *
 * - Be able to load different translations based on the locale in the browser.
 * - Be able to load the translations while rendering server side. We need this to be synchronous.
 *
 * See `examples/magento-graphcms/pages/_app.tsx` for usage.
 *
 * Todo: When React Server Components is released, move this to a server component.
 */
export function I18nProvider({ locale, children }: I18nProviderProps) {
  return (
    <LinguiProvider
      key={locale}
      locale={locale}
      loader={(l) => import(`../../locales/${l}.po`)}
      ssrLoader={(l) =>
        // eslint-disable-next-line global-require, import/no-dynamic-require
        typeof window === 'undefined' ? require(`../../locales/${l}.po`) : { messages: {} }
      }
    >
      {children}
    </LinguiProvider>
  )
}
