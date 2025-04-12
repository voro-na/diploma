import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/shared/api';

import { GroupResponse, RemoveGroupResponse } from './types';

export const groupApi = createApi({
    reducerPath: 'groupApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (builder) => ({
        createGroup: builder.mutation<
            GroupResponse,
            {
                projectSlug: string;
                groupSlug: string;
                name?: string;
            }
        >({
            query: ({ projectSlug, groupSlug, name }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}`,
                method: 'POST',
                body: name ? { name } : undefined,
            }),
        }),

        removeGroup: builder.mutation<
            RemoveGroupResponse,
            {
                projectSlug: string;
                groupSlug: string;
            }
        >({
            query: ({ projectSlug, groupSlug }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useCreateGroupMutation, useRemoveGroupMutation } = groupApi;
