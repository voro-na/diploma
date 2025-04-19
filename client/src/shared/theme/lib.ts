import { createTheme } from '@mui/material/styles';

import {
    colorSchemes,
    inputsCustomizations,
    surfacesCustomizations,
} from '../customization';
import { dataDisplayCustomizations } from '../customization/dataDisplay';

export const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    colorSchemes,
    components: {
        ...inputsCustomizations,
        ...surfacesCustomizations,
        ...dataDisplayCustomizations,
    },
});
