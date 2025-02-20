import { TreeViewBaseItem } from "@mui/x-tree-view/models";

import { IProject } from "@/entities/project/types";

export const mapDataToTreeItems = (data: IProject): TreeViewBaseItem[] => {
    return data.groups.reduce((acc: TreeViewBaseItem[], project) => {
        acc.push({
            id: project.slug,
            label: project.name,
            children: project.features.map((feature) => ({
                id: feature.slug,
                label: feature.name,
            })),
        });

        return acc;
    }, []);
};
