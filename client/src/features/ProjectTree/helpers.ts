import { TreeViewBaseItem } from '@mui/x-tree-view/models';

import { IProject } from '@/entities/project/types';

import { ExtendedTreeItemProps } from './types';

export const mapDataToTreeItems = (data: IProject): TreeViewBaseItem[] => {
    return data.groups.reduce(
        (acc: TreeViewBaseItem<ExtendedTreeItemProps>[], group) => {
            acc.push({
                id: group._id,
                label: group.name,
                groupSlug: group.slug,
                children: group.features?.map((feature) => ({
                    id: feature._id,
                    label: feature.name,
                    allTestCount: feature.allTestCount,
                    passTestCount: feature.passTestCount,
                    groupSlug: group.slug,
                    featureSlug: feature.slug,
                })),
            });

            return acc;
        },
        []
    );
};
