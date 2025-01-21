import type { AppProps } from 'next/app';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

import './global.css';

const theme = createTheme({ cssVariables: true });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <ThemeProvider theme={theme}>
                <AppCacheProvider {...pageProps}>
                    <Component {...pageProps} />
                </AppCacheProvider>
            </ThemeProvider>
        </>
    );
}
