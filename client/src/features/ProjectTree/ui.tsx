import { FC } from 'react';
import { useRouter } from 'next/router';

import { Alert, alpha, Skeleton, styled } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { DotIcon } from '@/shared/ui/icons';

import { mapDataToTreeItems } from './helpers';

import { useGetProjectBySlugQuery } from '@/entities/project/api';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        padding: theme.spacing(0.5, 1),
        margin: theme.spacing(0.2, 0),
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
    },
}));

export const ProjectTree: FC = () => {
    const router = useRouter();
    const projectId = router.query.projectId as string;
    const { data, error, isLoading } = useGetProjectBySlugQuery(projectId);

    return (
        <>
            {isLoading && (
                <>
                    <Skeleton height={70} />
                    <Skeleton height={70} />
                    <Skeleton height={70} />
                </>
            )}
            {error && (
                <Alert severity='error'>
                    {
                        // eslint-disable-next-line
                        error?.data?.message || 'Some error occurred'
                    }
                </Alert>
            )}
            {data && (
                <RichTreeView
                    items={mapDataToTreeItems(data)}
                    slots={{
                        endIcon: DotIcon,
                        item: CustomTreeItem,
                    }}
                />
            )}
        </>
    );
};
