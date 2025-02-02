import { FC } from 'react';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import IconButton from '@mui/material/IconButton';

import { themeStore } from './store';

export const ThemeToggler: FC = () => {
    return (
        <IconButton
            aria-label='delete'
            onClick={() => themeStore.toggleTheme()}
        >
            <DarkModeIcon />
        </IconButton>
    );
};
