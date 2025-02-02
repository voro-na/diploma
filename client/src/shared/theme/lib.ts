import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    cssVariables: true,
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    cssVariables: true,
});
