// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IProject } from './types';

// Define a service using a base URL and expected endpoints
export const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/',
    }),
    endpoints: (builder) => ({
        getProjectByName: builder.query<IProject, string>({
            query: (name) => `projects/slug/${name}`,
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProjectByNameQuery } = projectApi;
