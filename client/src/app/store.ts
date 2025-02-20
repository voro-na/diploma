import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { projectApi } from '@/entities/project/api';

export const store = () =>
    configureStore({
        reducer: {
            [projectApi.reducerPath]: projectApi.reducer,
        },

        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(projectApi.middleware),
    });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(store);
