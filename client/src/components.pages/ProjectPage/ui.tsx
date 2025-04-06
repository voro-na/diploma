import { FC } from 'react';
import { useRouter } from 'next/router';

import { Alert, Box, Card, Container, Typography } from '@mui/material';

import { PageLayout } from '@/widgets/Layout';
import { TestsGroup } from '@/widgets/TestsGroup';
import { ProjectTree } from '@/features/ProjectTree';
import { useGetProjectBySlugQuery } from '@/entities/project';

import styles from './styles.module.css';

export const ProjectPage: FC = () => {
    const router = useRouter();
    const projectId = router.query.projectId as string;
    const { data, error } = useGetProjectBySlugQuery(projectId);

    return (
        <PageLayout>
            <Container
                className={styles['ProjectPage']}
                component='section'
                maxWidth='xl'
            >
                <Card variant='outlined'>
                    {error && (
                        <Alert severity='error'>
                            {
                                // eslint-disable-next-line
                                error?.data?.message || 'Some error occurred'
                            }
                        </Alert>
                    )}
                    {data && (
                        <Box className={styles['ProjectPage-header']}>
                            <Typography
                                variant='h5'
                                component='h1'
                                gutterBottom
                            >
                                {data.name}
                            </Typography>
                            {data.description && (
                                <Typography
                                    variant='body1'
                                    color='text.secondary'
                                >
                                    {data.description}
                                </Typography>
                            )}
                        </Box>
                    )}
                    <ProjectTree />
                </Card>
                <TestsGroup />
            </Container>
        </PageLayout>
    );
};
