import { UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';

export interface DeleteEntityModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    entityName: string;
}

export interface CustomTreeItemProps extends UseTreeItem2Parameters {
    projectSlug: string;
}

export type ExtendedTreeItemProps = {
    allTestCount?: number;
    passTestCount?: number;
    id: string;
    label: string;
    groupSlug: string;
    featureSlug?: string;
};
