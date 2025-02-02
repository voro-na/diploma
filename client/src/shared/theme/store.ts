import { makeAutoObservable } from 'mobx';

import { Theme } from '@mui/material';

import { darkTheme, lightTheme } from './lib';

class ThemeStore {
    theme: Theme = lightTheme;

    constructor() {
        makeAutoObservable(this);
    }

    toggleTheme = () => {
        this.theme =
            this.theme.palette.mode === 'light' ? darkTheme : lightTheme;
    };
}

export const themeStore = new ThemeStore();
