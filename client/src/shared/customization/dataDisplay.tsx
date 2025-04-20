import { chipClasses } from '@mui/material/Chip';
import {  Components,Theme } from '@mui/material/styles';
import { svgIconClasses } from '@mui/material/SvgIcon';

import { brand, gray, green, orange, red } from './variables';

/* eslint-disable import/prefer-default-export */
export const dataDisplayCustomizations: Components<Theme> = {
  MuiChip: {
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        border: '1px solid',
        borderRadius: '999px',
        [`& .${chipClasses.label}`]: {
          fontWeight: 600,
        },
        variants: [
          {
            props: {
              color: 'default',
            },
            style: {
              borderColor: gray[200],
              backgroundColor: gray[100],
              [`& .${chipClasses.label}`]: {
                color: gray[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: gray[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: gray[700],
                backgroundColor: gray[800],
                [`& .${chipClasses.label}`]: {
                  color: gray[300],
                },
                [`& .${chipClasses.icon}`]: {
                  color: gray[300],
                },
              }),
            },
          },
          {
            props: {
              color: 'success',
            },
            style: {
              borderColor: green[200],
              backgroundColor: green[50],
              [`& .${chipClasses.label}`]: {
                color: green[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: green[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: green[800],
                backgroundColor: green[900],
                [`& .${chipClasses.label}`]: {
                  color: green[300],
                },
                [`& .${chipClasses.icon}`]: {
                  color: green[300],
                },
              }),
            },
          },
          {
            props: {
              color: 'error',
            },
            style: {
              borderColor: red[100],
              backgroundColor: red[50],
              [`& .${chipClasses.label}`]: {
                color: red[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: red[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: red[800],
                backgroundColor: red[900],
                [`& .${chipClasses.label}`]: {
                  color: red[200],
                },
                [`& .${chipClasses.icon}`]: {
                  color: red[300],
                },
              }),
            },
          },
          {
            props: {
              color: 'info',
            },
            style: {
              borderColor: brand[200],
              backgroundColor: brand[50],
              [`& .${chipClasses.label}`]: {
                color: brand[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: brand[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: brand[800],
                backgroundColor: brand[900],
                [`& .${chipClasses.label}`]: {
                  color: brand[300],
                },
                [`& .${chipClasses.icon}`]: {
                  color: brand[300],
                },
              }),
            },
          },
          {
            props: {
              color: 'warning',
            },
            style: {
              borderColor: orange[200],
              backgroundColor: orange[50],
              [`& .${chipClasses.label}`]: {
                color: orange[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: orange[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: orange[800],
                backgroundColor: orange[900],
                [`& .${chipClasses.label}`]: {
                  color: orange[300],
                },
                [`& .${chipClasses.icon}`]: {
                  color: orange[300],
                },
              }),
            },
          },
          {
            props: { size: 'small' },
            style: {
              maxHeight: 20,
              [`& .${chipClasses.label}`]: {
                fontSize: theme.typography.caption.fontSize,
              },
              [`& .${svgIconClasses.root}`]: {
                fontSize: theme.typography.caption.fontSize,
              },
            },
          },
          {
            props: { size: 'medium' },
            style: {
              [`& .${chipClasses.label}`]: {
                fontSize: theme.typography.caption.fontSize,
              },
            },
          },
        ],
      }),
    },
  },
};
