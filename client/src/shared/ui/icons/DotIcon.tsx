import { FC } from 'react';

import { Box, useTheme } from '@mui/material';

export const DotIcon: FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ marginRight: 1, display: 'flex', alignItems: 'center' }}>
            <svg width={6} height={6}>
                <circle cx={3} cy={3} r={3} fill={theme.palette.primary.main} />
            </svg>
        </Box>
    );
};
