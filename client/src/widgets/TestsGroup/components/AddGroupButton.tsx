import { FC } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import {
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
} from '@mui/x-data-grid';

import { generateUniqueId } from '../helpers';

interface AddGroupButtonProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
}

export const AddGroupButton: FC<AddGroupButtonProps> = ({
    setRows,
    setRowModesModel,
}) => {
    const handleAddGroup = () => {
        const newId = generateUniqueId();
        setRows((oldRows) => [
            {
                id: newId,
                test: '',
                isNew: true,
            },
            ...oldRows,
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [newId]: {
                mode: GridRowModes.Edit,
                fieldToFocus: 'test',
            },
        }));
    };

    return (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
                startIcon={<AddIcon />}
                onClick={handleAddGroup}
                variant="text"
                size="small"
            >
                Добавить группу
            </Button>
        </Box>
    );
};
