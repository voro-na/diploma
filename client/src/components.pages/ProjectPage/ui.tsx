import { FC } from 'react';

import { Card, Container } from '@mui/material';

import { FirstComponent } from '@/features/ProjectTree';
import { TestsGroup } from '@/features/TestsGroup';
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
                    <FirstComponent />
                </Card>
                <TestsGroup />
            </Container>
        </PageLayout>
    );
};
