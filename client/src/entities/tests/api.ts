import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/shared/api';

import { ITestGroup } from '../project/types';

import { CreateTest, CreateTestGroup, EditTest, RemoveTest } from './types';

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

        addTest: builder.mutation<
            void,
            {
                projectSlug: string;
                groupSlug: string;
                featureSlug: string;
                testGroupId: string;
                testData: CreateTest;
            }
        >({
            query: ({
                projectSlug,
                groupSlug,
                featureSlug,
                testGroupId,
                testData,
            }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}/tests/${testGroupId}/test`,
                method: 'POST',
                body: testData,
            }),
        }),

        editTest: builder.mutation<
            void,
            {
                projectSlug: string;
                groupSlug: string;
                featureSlug: string;
                testGroupId: string;
                editTestData: EditTest;
            }
        >({
            query: ({
                projectSlug,
                groupSlug,
                featureSlug,
                testGroupId,
                editTestData,
            }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}/tests/${testGroupId}/test`,
                method: 'PATCH',
                body: editTestData,
            }),
        }),

        removeTest: builder.mutation<
            void,
            {
                projectSlug: string;
                groupSlug: string;
                featureSlug: string;
                testGroupId: string;
                removeTestData: RemoveTest;
            }
        >({
            query: ({
                projectSlug,
                groupSlug,
                featureSlug,
                testGroupId,
                removeTestData,
            }) => ({
                url: `projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}/tests/${testGroupId}/test`,
                method: 'DELETE',
                body: removeTestData,
            }),
        }),
    }),
});

export const {
    useCreateTestGroupQuery,
    useRemoveTestGroupQuery,
    useRemoveTestMutation,
    useAddTestMutation,
    useEditTestMutation,
} = testsApi;
