import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IProject, ITestGroup } from './types';

export const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/',
    }),
    endpoints: (builder) => ({
        getProjectBySlug: builder.query<IProject, string>({
            query: (slug) => `projects/slug/${slug}`,
        }),

        getTestsDetails: builder.query<ITestGroup[],{ projectSlug: string; groupSlug: string; featureSlug: string }>({
            query: ({ projectSlug, groupSlug, featureSlug }) =>
                `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}`,
        }),
    }),
});

export const { useGetProjectBySlugQuery, useGetTestsDetailsQuery } = projectApi 