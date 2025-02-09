import { createTheme } from '@mui/material/styles';

import {
    colorSchemes,
    inputsCustomizations,
    surfacesCustomizations,
} from '../customization';

export const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    colorSchemes,
    components: {
        ...inputsCustomizations,
        ...surfacesCustomizations,
    },
});
