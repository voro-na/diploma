import { FC } from 'react';

import { alpha, styled } from '@mui/material';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { DotIcon } from '@/shared/ui/icons';

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

const ITEMS: TreeViewBaseItem[] = [
    {
        id: 'grid',
        label: 'Data Grid',
        children: [
            { id: 'grid-community', label: '@mui/x-data-grid' },
            { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
            { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
        ],
    },
    {
        id: 'pickers',
        label: 'Date and Time Pickers',
        children: [
            { id: 'pickers-community', label: '@mui/x-date-pickers' },
            { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
        ],
    },
    {
        id: 'charts',
        label: 'Charts',
        children: [{ id: 'charts-community', label: '@mui/x-charts' }],
    },
    {
        id: 'tree-view',
        label: 'Tree View',
        children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
    },
];

export const ProjectTree: FC = () => {
    return (
        <>
            <RichTreeView
                items={ITEMS}
                onItemClick={(item, id) => console.log(item, id)}
                slots={{
                    endIcon: DotIcon,
                    item: CustomTreeItem,
                }}
            />
        </>
    );
};
