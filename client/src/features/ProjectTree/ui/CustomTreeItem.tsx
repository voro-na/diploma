import { forwardRef, Ref, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';
import {
    TreeItem2Checkbox,
    TreeItem2Content,
    TreeItem2GroupTransition,
    TreeItem2IconContainer,
    TreeItem2Label,
    TreeItem2Root} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import {
    useTreeItem2,
} from '@mui/x-tree-view/useTreeItem2';

import { AddGroupModal } from '@/features/NewEntityModal';
import { useCreateFeatureMutation } from '@/entities/feature/api';
import { useRemoveGroupMutation } from '@/entities/group/api';
import { useGetProjectBySlugQuery } from '@/entities/project';

import { CustomTreeItemProps, ExtendedTreeItemProps } from '../types';

import { DeleteEntityModal } from './DeleteEntityModal';


export const TreeItem = forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: Ref<HTMLLIElement>
) {
    const { id, itemId, label, disabled, children, projectSlug, ...other } = props;

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addFeatureModalOpen, setAddFeatureModalOpen] = useState(false);
    const [removeGroup] = useRemoveGroupMutation();
    const [createFeature] = useCreateFeatureMutation();
    const { refetch } = useGetProjectBySlugQuery(projectSlug);
    
    const handleDeleteGroup = async (item: ExtendedTreeItemProps) => {
        try {
            await removeGroup({
                projectSlug: projectSlug,
                groupSlug: item.groupSlug,
            });
            await refetch();
        } catch (error) {}
    };

    const handleCreateFeature = async (name: string, slug: string) => {
        try {
            await createFeature({
                projectSlug,
                groupSlug: item.groupSlug,
                featureSlug: slug,
                name
            });
            await refetch();
        } catch (error) {}
    };
    
    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        getDragAndDropOverlayProps,
        status,
        publicAPI,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });
    
    const item = publicAPI.getItem(itemId) as ExtendedTreeItemProps;

    return (
        <TreeItem2Provider itemId={itemId}>
            <TreeItem2Root {...getRootProps(other)}>
                <TreeItem2Content {...getContentProps()}>
                    <TreeItem2IconContainer {...getIconContainerProps()}>
                        <TreeItem2Icon status={status} />
                    </TreeItem2IconContainer>
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                        <TreeItem2Checkbox {...getCheckboxProps()} />
                        <TreeItem2Label {...getLabelProps()} />
                        {item.allTestCount &&
                            `${item.passTestCount} / ${item.allTestCount}`}
                        
                        <Box sx={{ ml: 'auto', display: 'flex' }}>
                            {!item.featureSlug && (
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAddFeatureModalOpen(true);
                                    }}
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton 
                                size="small" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteModalOpen(true);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    <TreeItem2DragAndDropOverlay
                        {...getDragAndDropOverlayProps()}
                    />
                </TreeItem2Content>
                {children && (
                    <TreeItem2GroupTransition {...getGroupTransitionProps()} />
                )}
            </TreeItem2Root>
            
            <DeleteEntityModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() =>  void handleDeleteGroup(item)}
                entityName={label as string}
            />
            
            <AddGroupModal
                open={addFeatureModalOpen}
                onClose={() => setAddFeatureModalOpen(false)}
                onSubmit={(name, slug) => void handleCreateFeature(name, slug)}
                title="Добавить новую фичу"
            />
        </TreeItem2Provider>
    );
});
