import { FC } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import { Skeleton } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';

import { useGetProjectBySlugQuery } from '@/entities/project/api';
import { DotIcon } from '@/shared/ui/icons';

import { mapDataToTreeItems } from '../helpers';

import { TreeItem } from './CustomTreeItem';

export const ProjectTree: FC = () => {
    const router = useRouter();
    const projectSlug = router.query.projectId as string;
    
    const { data, isLoading } = useGetProjectBySlugQuery(projectSlug);

    const updatePath = (query: ParsedUrlQuery) => {
        const joinedQuery = { ...router.query, ...query };

        void Router.push({ query: joinedQuery }, undefined, {
            shallow: true,
        }).catch();
    };

    const onItemClick = (id: string) => {
        const slugs = data?.groups.reduce((acc: { featureSlug?: string; groupSlug?: string}, group)=> {
            const feature = group.features?.find((feature) => feature._id === id)

            if (feature) {
                acc = {
                    featureSlug: feature.slug,
                    groupSlug: group.slug,
                };
            }
            return acc
        }, {});
    
        if (!slugs?.featureSlug || !slugs.groupSlug) {
            return;
        }
        updatePath({
            feature: slugs?.featureSlug || '',
            group: slugs.groupSlug || '',
        });
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
            {data && (
                <RichTreeView
                    items={mapDataToTreeItems(data) || []}
                    onItemClick={(_, id) => onItemClick(id)}
                    
                    slots={{
                        endIcon: DotIcon,
                        item: (props: UseTreeItem2Parameters) => <TreeItem {...props} projectSlug={projectSlug} />,
                    }}
                />
            )}
        </>
    );
};
