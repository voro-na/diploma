import { TreeViewBaseItem } from '@mui/x-tree-view/models';

import { IProject } from '@/entities/project/types';

export type ExtendedTreeItemProps = {
    allTestCount?: number;
    passTestCount?: number;
    id: string;
    label: string;
};

export const mapDataToTreeItems = (data: IProject): TreeViewBaseItem[] => {
    return data.groups.reduce(
        (acc: TreeViewBaseItem<ExtendedTreeItemProps>[], project) => {
            acc.push({
                id: project.slug,
                label: project.name,
                children: project.features.map((feature) => ({
                    id: feature.slug,
                    label: feature.name,
                    allTestCount: feature.allTestCount,
                    passTestCount: feature.passTestCount,
                })),
            });

            return acc;
        },
        []
    );
};
