import { FC } from 'react';

import { Card, Container } from '@mui/material';

import { ProjectTree } from '@/features/ProjectTree';
import { TestsGroup } from '@/widgets/TestsGroup';
import { PageLayout } from '@/widgets/Layout';

import styles from './styles.module.css';

export const ProjectPage: FC = () => {
    return (
        <PageLayout>
            <Container
                className={styles['ProjectPage']}
                component='section'
                maxWidth='xl'
            >
                <Card variant='outlined'>
                    <ProjectTree />
                </Card>
                <TestsGroup />
            </Container>
        </PageLayout>
    );
};
