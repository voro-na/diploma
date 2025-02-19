import { Provider } from 'react-redux'
import type { AppProps } from 'next/app';

import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

import { theme } from '@/shared/theme';

import './global.css';

import { store } from '@/app/store';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <AppCacheProvider {...pageProps}>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </AppCacheProvider>
                </MuiThemeProvider>
            </Provider>
        </>
    );
};

export default App;
