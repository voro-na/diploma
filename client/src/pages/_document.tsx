import { JSX } from 'react';
import { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import {
    documentGetInitialProps,
    DocumentHeadTags,
    DocumentHeadTagsProps,
} from '@mui/material-nextjs/v13-pagesRouter';

export default function Document(props: JSX.IntrinsicAttributes & DocumentHeadTagsProps) {
    return (
        <Html lang='en'>
            <Head>
                <DocumentHeadTags {...props} />
            </Head>
            <body>
                <InitColorSchemeScript attribute='class' />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
    const finalProps = await documentGetInitialProps(ctx);
    return finalProps;
};
