import { RichText } from "@graphcommerce/graphcms-ui";
import { MenuFragment } from './Menu.gql';

export function Menu(props: MenuFragment){
    const {copy,image} = props
    

    return(
        <div>
            {image?.url}
            <RichText
                {...copy}
                sxRenderer={{
                    paragraph:{
                        textAlign: 'center' as const,
                    },
                    'heading-one':(theme)=>({
                        color: theme.palette.primary.main,
                    }),
                }}
            />
        </div>
    )
}