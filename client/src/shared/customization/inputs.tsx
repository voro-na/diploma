import { alpha, Components, Theme } from '@mui/material/styles';
import { svgIconClasses } from '@mui/material/SvgIcon';

import { gray } from './variables';

export const inputsCustomizations: Components<Theme> = {
    MuiIconButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                boxShadow: 'none',
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                fontWeight: theme.typography.fontWeightMedium,
                letterSpacing: 0,
                color: theme.palette.text.primary,
                border: '1px solid ',
                borderColor: gray[200],
                backgroundColor: alpha(gray[50], 0.3),
                '&:hover': {
                    backgroundColor: gray[100],
                    borderColor: gray[300],
                },
                '&:active': {
                    backgroundColor: gray[200],
                },
                ...theme.applyStyles('dark', {
                    backgroundColor: gray[800],
                    borderColor: gray[700],
                    '&:hover': {
                        backgroundColor: gray[900],
                        borderColor: gray[600],
                    },
                    '&:active': {
                        backgroundColor: gray[900],
                    },
                }),
                variants: [
                    {
                        props: {
                            size: 'small',
                        },
                        style: {
                            width: '2.25rem',
                            height: '2.25rem',
                            padding: '0.25rem',
                            [`& .${svgIconClasses.root}`]: { fontSize: '1rem' },
                        },
                    },
                    {
                        props: {
                            size: 'medium',
                        },
                        style: {
                            width: '2.5rem',
                            height: '2.5rem',
                        },
                    },
                ],
            }),
        },
    },
};
