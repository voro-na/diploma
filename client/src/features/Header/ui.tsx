import { FC } from 'react';

import { styled } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ThemeToggler } from '@/shared/theme';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: '8px 12px',
}));

export const Header: FC = () => {
    return (
        <AppBar
            position='static'
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                mt: '20px',
                backgroundImage: 'none',
            }}
        >
            <Container maxWidth='xl'>
                <StyledToolbar>
                    <Typography
                        variant='h6'
                        sx={{
                            fontFamily: 'monospace',
                            display: 'flex',
                            fontWeight: 700,
                            letterSpacing: '4px',
                            color: 'var(--mui-palette-info-dark)',
                        }}
                    >
                        LOGO
                    </Typography>
                    <ThemeToggler />
                </StyledToolbar>
            </Container>
        </AppBar>
    );
};
