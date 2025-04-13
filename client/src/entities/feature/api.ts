import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/shared/api';

import { FeatureResponse, RemoveFeatureResponse } from './types';

export const featureApi = createApi({
    reducerPath: 'featureApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (builder) => ({
        createFeature: builder.mutation<
            FeatureResponse,
            {
                projectSlug: string;
                groupSlug: string;
                featureSlug: string;
                name: string;
            }
        >({
            query: ({ projectSlug, groupSlug, featureSlug, name }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}`,
                method: 'POST',
                body: { name },
            }),
        }),

        removeFeature: builder.mutation<
            RemoveFeatureResponse,
            {
                projectSlug: string;
                groupSlug: string;
                featureSlug: string;
            }
        >({
            query: ({ projectSlug, groupSlug, featureSlug }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useCreateFeatureMutation, useRemoveFeatureMutation } =
    featureApi;
