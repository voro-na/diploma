import { createTheme } from '@mui/material/styles';

import { colorSchemes, inputsCustomizations } from '../customization';

export const theme = createTheme({
    palette: {
        mode: 'light',
    },
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    colorSchemes,
    components: {
        ...inputsCustomizations,
    },
});
