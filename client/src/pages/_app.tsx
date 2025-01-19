import type { AppProps } from 'next/app'

import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter'

import './global.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AppCacheProvider {...pageProps}>
                <Component {...pageProps} />
            </AppCacheProvider>
        </>
    )
}
