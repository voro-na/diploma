import { FC, useState } from 'react';
import { Tab, Tabs, Typography, Box, Container } from '@mui/material';
import { LoginForm } from './AuthPage.components/LoginForm/LoginForm';

const TABS_VALUES = ['Вход', 'Регистрация'];

export const AuthPage: FC = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8, textAlign: 'center' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label={TABS_VALUES[0]} />
                    <Tab label={TABS_VALUES[1]} />
                </Tabs>
                <Box sx={{ mt: 3 }}>
                    {tabValue === 0 && (
                        <Typography component="div" hidden={tabValue !== 0}>
                            <LoginForm type={tabValue} />
                        </Typography>
                    )}
                    {tabValue === 1 && (
                        <Typography component="div" hidden={tabValue !== 1}>
                            <LoginForm type={tabValue} />

                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
};
