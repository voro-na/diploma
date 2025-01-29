import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { FC, useContext } from 'react';
import { useTheme } from './model';

export const ThemeToggler: FC = () => {
    const { onToggle } = useTheme();
    return (
        <IconButton aria-label='delete' onClick={onToggle}>
            <DarkModeIcon />
        </IconButton>
    );
};
