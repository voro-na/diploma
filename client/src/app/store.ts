import { configureStore } from '@reduxjs/toolkit';

import { projectApi } from '@/entities/project/api';

export const store = configureStore({
    reducer: {
        [projectApi.reducerPath]: projectApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(projectApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
