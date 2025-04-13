import { FC, useState } from 'react';
import { useRouter } from 'next/router';

import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, Card, Container, Typography } from '@mui/material';

import { PageLayout } from '@/widgets/Layout';
import { TestsGroup } from '@/widgets/TestsGroup';
import { AddGroupModal } from '@/features/NewEntityModal';
import { ProjectTree } from '@/features/ProjectTree';
import { useCreateGroupMutation } from '@/entities/group';
import { useGetProjectBySlugQuery } from '@/entities/project';

import styles from './styles.module.css';

export const ProjectPage: FC = () => {
    const router = useRouter();
    const projectSlug = router.query.projectId as string;
    const { data, error, refetch } = useGetProjectBySlugQuery(projectSlug);
    const [createGroup] = useCreateGroupMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddGroup = (name: string, slug: string) => {
        createGroup({
            projectSlug: projectSlug,
            groupSlug: slug,
            name,
        })
            .unwrap()
            .then(() => {
                refetch().catch(err => console.error('Failed to refetch project:', err));
                handleCloseModal();
            })
            .catch((error) => {
                console.error('Failed to create group:', error);
            });
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
                            {
                                // @ts-expect-error - error handling for RTK Query error
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                (error?.data?.message as string) ||
                                    'Some error occurred'
                            }
                        </Alert>
                    )}
                    {data && (
                        <Box className={styles['ProjectPage-header']}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant='h5'
                                    component='h1'
                                    gutterBottom
                                >
                                    {data.name}
                                </Typography>
                                <Button
                                    variant='contained'
                                    color='primary'
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
    );
};
