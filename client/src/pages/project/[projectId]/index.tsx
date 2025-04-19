import { GetServerSideProps } from 'next';

import { projectApi } from '@/entities/project/api';

import { wrapper } from '@/app/store';
import { ProjectPage } from '@/components.pages/ProjectPage';

export default ProjectPage;

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps((store) => async (context) => {
        const slug = context.params?.projectId;

        if (typeof slug === 'string') {
            void store.dispatch(
                projectApi.endpoints.getProjectBySlug.initiate(slug)
            );
        }

        await Promise.all(
            store.dispatch(projectApi.util.getRunningQueriesThunk())
        );

        return { props: {} };
    });
