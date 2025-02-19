import type { AppProps } from 'next/app';

import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

import { theme } from '@/shared/theme';

import './global.css';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <MuiThemeProvider theme={theme}>
                <AppCacheProvider {...pageProps}>
                    <CssBaseline />
                    <Component {...pageProps} />
                </AppCacheProvider>
            </MuiThemeProvider>
        </>
    );
};

export default App;
