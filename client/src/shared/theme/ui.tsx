import { FC } from 'react';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useColorScheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';

export const ThemeToggler: FC = () => {
    const { mode, setMode } = useColorScheme();

    return (
        <IconButton
            aria-label='delete'
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
            <DarkModeIcon />
        </IconButton>
    );
};
