import { FC } from 'react';

import { Container } from '@mui/material';

import { NestedList } from '@/features/NestedFolders';
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
                <NestedList />
                <TestsGroup />
            </Container>
        </PageLayout>
    );
};
