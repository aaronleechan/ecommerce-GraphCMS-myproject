import { RichText } from '@graphcommerce/graphcms-ui'
import { BannerFragment } from './Banner.gql'

export function Banner(props: BannerFragment) {
  const { copy, image } = props

  return (
    <div>
      {image?.url}
      <RichText
        {...copy}
        sxRenderer={{
          paragraph: {
            textAlign: 'center' as const,
          },
          'heading-one': (theme) => ({
            color: theme.palette.primary.main,
          }),
        }}
      />
    </div>
  )
}