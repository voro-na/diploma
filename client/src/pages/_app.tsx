import type { AppProps } from 'next/app';

import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

import './global.css';
import { ThemeProvider, useTheme } from '@/shared/theme/model';
import { lightTheme } from '@/shared/theme';

const theme = createTheme({ cssVariables: true });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <ThemeProvider>
                <MuiThemeProvider theme={lightTheme}>
                <AppCacheProvider {...pageProps}>
                    <Component {...pageProps} />
                </AppCacheProvider>
                </MuiThemeProvider>
            </ThemeProvider>
        </>
    );
}
