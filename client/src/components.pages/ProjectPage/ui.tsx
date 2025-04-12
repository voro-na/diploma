import { FC, useState } from 'react';
import { useRouter } from 'next/router';

import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, Card, Container, Typography } from '@mui/material';

import { PageLayout } from '@/widgets/Layout';
import { TestsGroup } from '@/widgets/TestsGroup';
import { AddGroupModal } from '@/features/NewEntityModal';
import { ProjectTree } from '@/features/ProjectTree';
import { useGetProjectBySlugQuery } from '@/entities/project';

import styles from './styles.module.css';

export const ProjectPage: FC = () => {
    const router = useRouter();
    const projectId = router.query.projectId as string;
    const { data, error } = useGetProjectBySlugQuery(projectId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddGroup = (name: string, slug: string, description?: string) => {
        console.log('Adding new group:', { name, slug, description, projectId });
    };

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
                            {(() => {
                                if (error && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
                                    return String(error.data.message);
                                }
                                return 'Some error occurred';
                            })()}
                        </Alert>
                    )}
                    {data && (
                        <Box className={styles['ProjectPage-header']}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography
                                    variant='h5'
                                    component='h1'
                                    gutterBottom
                                >
                                    {data.name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenModal}
                                >
                                    Добавить
                                </Button>
                            </Box>
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
            <AddGroupModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAddGroup}
                title='Добавить новую группу'
            />
        </PageLayout>
    )
}
