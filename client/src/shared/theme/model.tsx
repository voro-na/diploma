import React, {
    createContext,
    useState,
    useContext,
    FC,
    PropsWithChildren,
} from 'react';
import { lightTheme, darkTheme } from './lib';
import { Theme } from '@mui/material';

interface IThemeContext {
    theme: Theme;
    onToggle?: () => void;
}

const ThemeSwitchContext = createContext<IThemeContext>({ theme: lightTheme });

export const useTheme = () => useContext(ThemeSwitchContext);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(lightTheme);

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme.palette.mode === 'light' ? darkTheme : lightTheme
        );
    };

    const contextValue = {
        theme,
        onToggle: toggleTheme,
    };

    return (
        <ThemeSwitchContext.Provider value={contextValue}>
            {children}
        </ThemeSwitchContext.Provider>
    );
};
