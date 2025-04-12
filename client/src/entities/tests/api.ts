import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/shared/api';

import { ITestGroup } from '../project/types';

import { CreateTestGroup } from './types';

export const testsApi = createApi({
    reducerPath: 'testsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (builder) => ({
        createTestGroup: builder.query<
            ITestGroup,
            {
                projectSlug: string;
                groupSlug: string;
                featureSlug: string;
                testGroupData: CreateTestGroup;
            }
        >({
            query: ({
                projectSlug,
                groupSlug,
                featureSlug,
                testGroupData,
            }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}/tests`,
                method: 'POST',
                body: testGroupData,
            }),
        }),

        removeTestGroup: builder.query<
            void,
            {
                projectSlug: string;
                groupSlug: string;
                featureSlug: string;
                testGroupId: string;
            }
        >({
            query: ({ projectSlug, groupSlug, featureSlug, testGroupId }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}/tests/${testGroupId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useCreateTestGroupQuery, useRemoveTestGroupQuery } = testsApi;
