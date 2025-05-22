import { FC } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
} from '@mui/x-data-grid';

import { Status } from '@/entities/project';

import { generateUniqueId } from '../helpers';

interface AddTestButtonProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    groupId: string;
}

export const AddTestButton: FC<AddTestButtonProps> = ({
    setRows,
    setRowModesModel,
    groupId,
}) => {
    const handleAddTest = () => {
        const newId = generateUniqueId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id: newId,
                test: '',
                status: Status.FAIL,
                isNew: true,
                groupId,
            },
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
        <GridActionsCellItem
            icon={<AddIcon />}
            label='Add Test'
            onClick={handleAddTest}
            color='primary'
        />
    );
};
