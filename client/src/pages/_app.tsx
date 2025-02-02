import { observer } from 'mobx-react-lite';
import type { AppProps } from 'next/app';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

import './global.css';

import { themeStore } from '@/shared/theme';

const App = observer(({ Component, pageProps }: AppProps) => {
    return (
        <>
            <MuiThemeProvider theme={themeStore.theme}>
                <AppCacheProvider {...pageProps}>
                    <Component {...pageProps} />
                </AppCacheProvider>
            </MuiThemeProvider>
        </>
    );
});

export default App;
