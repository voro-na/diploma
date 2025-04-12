import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { featureApi } from '@/entities/feature/api';
import { groupApi } from '@/entities/group/api';
import { projectApi } from '@/entities/project/api';
import { testsApi } from '@/entities/tests/api';

export const store = () =>
    configureStore({
        reducer: {
            [projectApi.reducerPath]: projectApi.reducer,
            [groupApi.reducerPath]: groupApi.reducer,
            [testsApi.reducerPath]: testsApi.reducer,
            [featureApi.reducerPath]: featureApi.reducer,
        },

        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                projectApi.middleware,
                groupApi.middleware,
                testsApi.middleware,
                featureApi.middleware
            ),
    });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(store);
