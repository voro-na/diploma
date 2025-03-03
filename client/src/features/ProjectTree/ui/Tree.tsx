import { FC } from 'react';
import { useRouter } from 'next/router';

import { Alert, Skeleton } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { DotIcon } from '@/shared/ui/icons';

import { mapDataToTreeItems } from '../helpers';

import { TreeItem } from './CustomTreeItem';

import { useGetProjectBySlugQuery } from '@/entities/project/api';

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
                        item: TreeItem,
                    }}
                />
            )}
        </>
    );
};
