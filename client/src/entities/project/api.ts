import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/shared/api';

import { IProject, ITestsDetailsResponse } from './types';

export const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (builder) => ({
        getProjectBySlug: builder.query<IProject, string>({
            query: (slug) => `projects/slug/${slug}`,
        }),

        getTestsDetails: builder.query<ITestsDetailsResponse,{ projectSlug: string; groupSlug: string; featureSlug: string }>({
            query: ({ projectSlug, groupSlug, featureSlug }) =>
                `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}`,
        }),
    }),
});

export const { useGetProjectBySlugQuery, useGetTestsDetailsQuery } = projectApi 