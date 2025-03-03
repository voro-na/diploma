import { forwardRef, Ref } from 'react';

import { Box } from '@mui/material';
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
    UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2';

import { ExtendedTreeItemProps } from '../helpers';

export const TreeItem = forwardRef(function CustomTreeItem(
    props: UseTreeItem2Parameters,
    ref: Ref<HTMLLIElement>
) {
    const { id, itemId, label, disabled, children, ...other } = props;

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
                            `${item.passTestCount} / ${item.allTestCount}`}
                    </Box>

                    <TreeItem2DragAndDropOverlay
                        {...getDragAndDropOverlayProps()}
                    />
                </TreeItem2Content>
                {children && (
                    <TreeItem2GroupTransition {...getGroupTransitionProps()} />
                )}
            </TreeItem2Root>
        </TreeItem2Provider>
    );
});
