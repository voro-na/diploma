import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IProject } from './types';

export const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/',
    }),
    endpoints: (builder) => ({
        getProjectBySlug: builder.query<IProject, string>({
            query: (slug) => `projects/slug/${slug}`,
        }),
    }),
});

export const { useGetProjectBySlugQuery } = projectApi;
