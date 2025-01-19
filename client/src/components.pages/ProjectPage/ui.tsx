import { FC } from 'react';

import { Box, Container } from '@mui/material';

import { NestedList } from '@/features/NestedFolders';
import { TestsGroup } from '@/features/TestsGroup';

import styles from './styles.module.css';

export const ProjectPage: FC = () => {
    return (
        <Container className={styles['ProjectPage']} component='section'>
            <Box component='article'>
                <NestedList />
            </Box>
            <Box component='article'>
                <TestsGroup />
            </Box>
        </Container>
    );
};
