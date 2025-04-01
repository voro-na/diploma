import { FC } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import { Alert, Skeleton } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useGetProjectBySlugQuery } from '@/entities/project/api';
import { DotIcon } from '@/shared/ui/icons';

import { mapDataToTreeItems } from '../helpers';

import { TreeItem } from './CustomTreeItem';

export const ProjectTree: FC = () => {
    const router = useRouter();
    const projectId = router.query.projectId as string;
    const { data, error, isLoading } = useGetProjectBySlugQuery(projectId);

    const updatePath = (query: ParsedUrlQuery) => {
        const joinedQuery = { ...router.query, ...query };

        void Router.push({ query: joinedQuery }, undefined, {
            shallow: true,
        }).catch();
    };

    const onItemClick = (id: string) => {
        const group = data?.groups.filter((group) =>
            group.features.find((feature) => feature.slug === id)
        );
        console.log(group);
        if (!group?.length) {
            return;
        }
        updatePath({ feature: id, group: group[0].slug });
    };

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
                    onItemClick={(_, id) => onItemClick(id)}
                    slots={{
                        endIcon: DotIcon,
                        item: TreeItem,
                    }}
                />
            )}
        </>
    );
};
